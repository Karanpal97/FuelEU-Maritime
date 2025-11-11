/**
 * Compare Tab Component - Modern Dark Theme
 */
import React, { useState, useEffect } from 'react';
import { ComparisonResult, RouteComparison } from '@/core/domain/entities/Route';
import { routesApi } from '@/adapters/infrastructure/api';
import { Card } from '../shared/Card';
import { Table, Column } from '../shared/Table';
import { Loading } from '../shared/Loading';
import { ErrorMessage } from '../shared/ErrorMessage';
import { FaChartBar, FaBullseye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export const CompareTab: React.FC = () => {
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await routesApi.getComparison();
      setComparison(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comparison data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchComparison} />;
  if (!comparison) return null;

  const allRoutes: RouteComparison[] = [comparison.baseline, ...comparison.comparisons];

  const columns: Column<RouteComparison>[] = [
    {
      key: 'routeId',
      header: 'Route ID',
      render: (route) => (
        <span className="font-medium text-gray-900">
          {route.routeId}
          {route.isBaseline && (
            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
              Baseline
            </span>
          )}
        </span>
      ),
    },
    { key: 'vesselType', header: 'Vessel Type' },
    { key: 'fuelType', header: 'Fuel Type' },
    {
      key: 'ghgIntensity',
      header: 'GHG Intensity (gCO₂e/MJ)',
      align: 'right',
      render: (route) => route.ghgIntensity.toFixed(4),
    },
    {
      key: 'percentDiff',
      header: '% Difference',
      align: 'right',
      render: (route) =>
        route.percentDiff !== undefined ? (
          <span className={route.percentDiff > 0 ? 'text-red-600' : 'text-green-600'}>
            {route.percentDiff > 0 ? '+' : ''}
            {route.percentDiff.toFixed(2)}%
          </span>
        ) : (
          '-'
        ),
    },
    {
      key: 'compliant',
      header: 'Compliant',
      align: 'center',
      render: (route) => (
        <span className="text-xl">
          {route.compliant ? (
            <FaCheckCircle className="w-5 h-5 text-accent-green inline" />
          ) : (
            <FaTimesCircle className="w-5 h-5 text-accent-red inline" />
          )}
        </span>
      ),
    },
  ];

  const chartData = allRoutes.map((route) => ({
    name: route.routeId,
    intensity: route.ghgIntensity,
    isBaseline: route.isBaseline,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <Card icon={<FaBullseye />}>
        <div className="bg-gradient-to-br from-primary-500/20 to-primary-500/5 border border-primary-500/30 rounded-2xl p-6 mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <FaBullseye className="w-5 h-5 text-primary-400" />
            </div>
            <h4 className="font-semibold text-primary-300">Target Intensity (2025)</h4>
          </div>
          <p className="text-3xl font-bold text-primary-400">
            {comparison.targetIntensity.toFixed(4)} <span className="text-lg text-gray-400">gCO₂e/MJ</span>
          </p>
          <p className="text-sm text-gray-400 mt-2">2% below baseline (91.16 gCO₂e/MJ)</p>
        </div>
      </Card>

      <Card title="GHG Intensity Comparison Chart" icon={<FaChartBar />}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'gCO₂e/MJ', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <ReferenceLine
                y={comparison.targetIntensity}
                label="Target (89.3368)"
                stroke="red"
                strokeDasharray="5 5"
              />
              <Bar
                dataKey="intensity"
                fill="#3b82f6"
                name="GHG Intensity"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Comparison Table">
        <Table columns={columns} data={allRoutes} />
      </Card>
    </div>
  );
};

