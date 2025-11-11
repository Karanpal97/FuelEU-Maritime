/**
 * Pooling Tab Component - Article 21 - Modern Dark Theme
 */
import React, { useState } from 'react';
import { PoolMember, PoolResult } from '@/core/domain/entities/Pooling';
import { poolingApi, complianceApi } from '@/adapters/infrastructure/api';
import { Card } from '../shared/Card';
import { KPICard } from '../shared/KPICard';
import { Table, Column } from '../shared/Table';
import { ErrorMessage } from '../shared/ErrorMessage';
import { FaUsers, FaPlus, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { MdGroupWork } from 'react-icons/md';

export const PoolingTab: React.FC = () => {
  const [year, setYear] = useState(2024);
  const [members, setMembers] = useState<PoolMember[]>([
    { shipId: '', cbBefore: 0 },
  ]);
  const [result, setResult] = useState<PoolResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addMember = () => {
    setMembers([...members, { shipId: '', cbBefore: 0 }]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof PoolMember, value: string | number) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const loadCBForMember = async (index: number) => {
    const member = members[index];
    if (!member.shipId) return;

    try {
      const balance = await complianceApi.getComplianceBalance(member.shipId, year);
      updateMember(index, 'cbBefore', balance.cb);
    } catch (err) {
      setError(`Failed to load CB for ${member.shipId}`);
    }
  };

  const calculatePoolSum = (): number => {
    return members.reduce((sum, m) => sum + (m.cbBefore || 0), 0);
  };

  const validatePool = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (members.length < 2) {
      errors.push('Pool must have at least 2 members');
    }

    const poolSum = calculatePoolSum();
    if (poolSum < 0) {
      errors.push('Pool sum is negative. Total deficits exceed total surplus.');
    }

    for (const member of members) {
      if (!member.shipId) {
        errors.push('All members must have a ship ID');
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleCreatePool = async () => {
    try {
      setError(null);
      setLoading(true);

      const validation = validatePool();
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        setLoading(false);
        return;
      }

      const poolResult = await poolingApi.createPool(year, members);
      setResult(poolResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pool');
    } finally {
      setLoading(false);
    }
  };

  const poolSum = calculatePoolSum();
  const isPoolValid = validatePool().isValid;

  const resultColumns: Column<PoolMember>[] = [
    { key: 'shipId', header: 'Ship ID' },
    {
      key: 'cbBefore',
      header: 'CB Before',
      align: 'right',
      render: (m) => (
        <span className={m.cbBefore < 0 ? 'text-red-600' : 'text-green-600'}>
          {m.cbBefore.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'cbAfter',
      header: 'CB After',
      align: 'right',
      render: (m) => (
        <span className={(m.cbAfter || 0) < 0 ? 'text-red-600' : 'text-green-600'}>
          {(m.cbAfter || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'allocation',
      header: 'Allocation',
      align: 'right',
      render: (m) => {
        const alloc = m.allocation || 0;
        return (
          <span className={alloc > 0 ? 'text-green-600' : alloc < 0 ? 'text-red-600' : 'text-gray-600'}>
            {alloc > 0 ? '+' : ''}{alloc.toLocaleString()}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Pool Configuration" icon={<MdGroupWork />}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select
            className="input w-48"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </Card>

      <Card title="Pool Members" icon={<FaUsers />}>
        <div className="space-y-4">
          {members.map((member, index) => (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ship/Route ID
                </label>
                <select
                  className="input w-full"
                  value={member.shipId}
                  onChange={(e) => updateMember(index, 'shipId', e.target.value)}
                >
                  <option value="">Select ship...</option>
                  <option value="R001">R001</option>
                  <option value="R002">R002</option>
                  <option value="R003">R003</option>
                  <option value="R004">R004</option>
                  <option value="R005">R005</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CB Before (gCO₂eq)
                </label>
                <input
                  type="number"
                  className="input w-full"
                  value={member.cbBefore}
                  onChange={(e) => updateMember(index, 'cbBefore', parseFloat(e.target.value) || 0)}
                />
              </div>
              <button
                className="btn-secondary"
                onClick={() => loadCBForMember(index)}
                disabled={!member.shipId}
              >
                Load CB
              </button>
              <button
                className="btn-secondary text-red-600"
                onClick={() => removeMember(index)}
                disabled={members.length <= 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button className="btn-secondary flex items-center gap-2" onClick={addMember}>
            <FaPlus /> Add Member
          </button>
        </div>
      </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Pool Sum"
          value={poolSum.toLocaleString()}
          subtitle="gCO₂eq"
          color={poolSum >= 0 ? 'green' : 'red'}
          icon={<FaCheckCircle />}
        />
        <KPICard
          title="Members"
          value={members.length}
          color="purple"
          icon={<FaUsers />}
        />
        <KPICard
          title="Status"
          value={isPoolValid ? 'Valid' : 'Invalid'}
          color={isPoolValid ? 'green' : 'red'}
          icon={<FaInfoCircle />}
        />
      </div>

      {error && <ErrorMessage message={error} />}

      <Card>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">Pooling Rules (Article 21)</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Pool sum (Σ CB) must be ≥ 0</li>
            <li>• Deficit ships cannot exit worse than before</li>
            <li>• Surplus ships cannot exit with negative CB</li>
            <li>• Greedy allocation: transfers from surplus to deficit</li>
          </ul>
        </div>
        <button
          className="btn-primary w-full"
          onClick={handleCreatePool}
          disabled={!isPoolValid || loading}
        >
          {loading ? 'Creating Pool...' : 'Create Pool'}
        </button>
      </Card>

      {result && (
        <Card title="Pool Result">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <KPICard
              title="Pool ID"
              value={result.poolId}
              color="blue"
            />
            <KPICard
              title="Total Surplus"
              value={result.totalSurplus.toLocaleString()}
              subtitle="gCO₂eq"
              color="green"
            />
            <KPICard
              title="Total Deficit"
              value={result.totalDeficit.toLocaleString()}
              subtitle="gCO₂eq"
              color="red"
            />
          </div>
          <Table columns={resultColumns} data={result.members} />
        </Card>
      )}
    </div>
  );
};

