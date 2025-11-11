/**
 * Routes Tab Component - Modern Dark Theme
 */
import React, { useState, useEffect } from 'react';
import { Route, RouteFilters } from '@/core/domain/entities/Route';
import { routesApi } from '@/adapters/infrastructure/api';
import { Card } from '../shared/Card';
import { Table, Column } from '../shared/Table';
import { Loading } from '../shared/Loading';
import { ErrorMessage } from '../shared/ErrorMessage';
import { FaShip, FaFilter, FaStar, FaCheckCircle } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';

export const RoutesTab: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RouteFilters>({});

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await routesApi.getAllRoutes(filters);
      setRoutes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [filters]);

  const handleSetBaseline = async (routeId: string) => {
    try {
      setError(null);
      await routesApi.setBaseline(routeId);
      await fetchRoutes(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set baseline');
    }
  };

  const columns: Column<Route>[] = [
    {
      key: 'routeId',
      header: 'Route ID',
      render: (route) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary-400">{route.routeId}</span>
          {route.isBaseline && (
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30">
              <FaStar className="w-3 h-3" />
              Baseline
            </span>
          )}
        </div>
      ),
    },
    { key: 'vesselType', header: 'Vessel Type' },
    { key: 'fuelType', header: 'Fuel Type' },
    {
      key: 'year',
      header: 'Year',
      align: 'center',
    },
    {
      key: 'ghgIntensity',
      header: 'GHG Intensity (gCO₂e/MJ)',
      align: 'right',
      render: (route) => route.ghgIntensity.toFixed(4),
    },
    {
      key: 'fuelConsumption',
      header: 'Fuel (t)',
      align: 'right',
      render: (route) => route.fuelConsumption.toLocaleString(),
    },
    {
      key: 'distance',
      header: 'Distance (km)',
      align: 'right',
      render: (route) => route.distance.toLocaleString(),
    },
    {
      key: 'totalEmissions',
      header: 'Emissions (t)',
      align: 'right',
      render: (route) => route.totalEmissions.toLocaleString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      render: (route) => (
        <button
          onClick={() => handleSetBaseline(route.routeId)}
          disabled={route.isBaseline}
          className="btn-secondary text-xs disabled:opacity-50"
        >
          Set Baseline
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Route Filters" icon={<FaFilter />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Vessel Type</label>
            <select
              className="input w-full"
              value={filters.vesselType || ''}
              onChange={(e) =>
                setFilters({ ...filters, vesselType: e.target.value || undefined })
              }
            >
              <option value="">All Vessels</option>
              <option value="Container">🚢 Container</option>
              <option value="BulkCarrier">⛴️ Bulk Carrier</option>
              <option value="Tanker">🛢️ Tanker</option>
              <option value="RoRo">🚗 RoRo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Fuel Type</label>
            <select
              className="input w-full"
              value={filters.fuelType || ''}
              onChange={(e) => setFilters({ ...filters, fuelType: e.target.value || undefined })}
            >
              <option value="">All Fuels</option>
              <option value="HFO">⚫ HFO</option>
              <option value="LNG">💨 LNG</option>
              <option value="MGO">🔵 MGO</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Year</label>
            <select
              className="input w-full"
              value={filters.year || ''}
              onChange={(e) =>
                setFilters({ ...filters, year: e.target.value ? parseInt(e.target.value) : undefined })
              }
            >
              <option value="">All Years</option>
              <option value="2024">📅 2024</option>
              <option value="2025">📅 2025</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="Maritime Routes" icon={<MdLocalShipping />}>
        {loading && <Loading message="Loading routes..." />}
        {error && <ErrorMessage message={error} onRetry={fetchRoutes} />}
        {!loading && !error && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-accent-green" />
                {routes.length} routes found
              </span>
              <span>{routes.filter(r => r.isBaseline).length} baseline set</span>
            </div>
            <Table columns={columns} data={routes} />
          </div>
        )}
      </Card>
    </div>
  );
};

