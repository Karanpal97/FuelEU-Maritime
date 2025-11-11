/**
 * Banking Tab Component - Article 20 - Modern Dark Theme
 */
import React, { useState, useEffect } from 'react';
import { BankRecordsResponse, BankingResult } from '@/core/domain/entities/Banking';
import { ComplianceBalance } from '@/core/domain/entities/Compliance';
import { bankingApi, complianceApi } from '@/adapters/infrastructure/api';
import { Card } from '../shared/Card';
import { KPICard } from '../shared/KPICard';
import { Table, Column } from '../shared/Table';
import { Loading } from '../shared/Loading';
import { ErrorMessage } from '../shared/ErrorMessage';
import { FaPiggyBank, FaCoins, FaCheckCircle, FaExclamationTriangle, FaWallet } from 'react-icons/fa';
import { MdAccountBalance } from 'react-icons/md';

export const BankingTab: React.FC = () => {
  const [shipId, setShipId] = useState('R001');
  const [year, setYear] = useState(2024);
  const [bankRecords, setBankRecords] = useState<BankRecordsResponse | null>(null);
  const [complianceBalance, setComplianceBalance] = useState<ComplianceBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bankAmount, setBankAmount] = useState('');
  const [applyAmount, setApplyAmount] = useState('');
  const [result, setResult] = useState<BankingResult | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [records, balance] = await Promise.all([
        bankingApi.getBankRecords(shipId),
        complianceApi.getComplianceBalance(shipId, year),
      ]);
      setBankRecords(records);
      setComplianceBalance(balance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch banking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [shipId, year]);

  const handleBankSurplus = async () => {
    try {
      setError(null);
      const amount = parseFloat(bankAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid positive amount');
        return;
      }
      const res = await bankingApi.bankSurplus(shipId, year, amount);
      setResult(res);
      setBankAmount('');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bank surplus');
    }
  };

  const handleApplyBanked = async () => {
    try {
      setError(null);
      const amount = parseFloat(applyAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid positive amount');
        return;
      }
      const res = await bankingApi.applyBanked(shipId, year, amount);
      setResult(res);
      setApplyAmount('');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply banked surplus');
    }
  };

  const columns: Column<{ id: number; year: number; amount: number; remaining: number }>[] = [
    { key: 'id', header: 'ID', align: 'center' },
    { key: 'year', header: 'Year', align: 'center' },
    {
      key: 'amount',
      header: 'Amount (gCO₂eq)',
      align: 'right',
      render: (item) => item.amount.toLocaleString(),
    },
    {
      key: 'remaining',
      header: 'Remaining (gCO₂eq)',
      align: 'right',
      render: (item) => item.remaining.toLocaleString(),
    },
  ];

  const tableData = bankRecords?.records.map((r) => ({
    id: r.id,
    year: r.year,
    amount: r.amountGco2eq,
    remaining: r.remainingGco2eq,
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Banking Configuration" icon={<MdAccountBalance />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ship/Route ID</label>
            <select
              className="input w-full"
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
            >
              <option value="R001">R001</option>
              <option value="R002">R002</option>
              <option value="R003">R003</option>
              <option value="R004">R004</option>
              <option value="R005">R005</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              className="input w-full"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>
      </Card>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={fetchData} />}

      {!loading && !error && complianceBalance && bankRecords && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard
              title="Current CB"
              value={complianceBalance.cb.toLocaleString()}
              subtitle="gCO₂eq"
              color={complianceBalance.cb > 0 ? 'green' : complianceBalance.cb < 0 ? 'red' : 'gray'}
              icon={<FaWallet />}
            />
            <KPICard
              title="Available Banked"
              value={bankRecords.totalAvailable.toLocaleString()}
              subtitle="gCO₂eq"
              color="cyan"
              icon={<FaCoins />}
            />
            <KPICard
              title="Status"
              value={complianceBalance.isSurplus ? 'Surplus' : complianceBalance.isDeficit ? 'Deficit' : 'Neutral'}
              color={complianceBalance.isSurplus ? 'green' : complianceBalance.isDeficit ? 'red' : 'gray'}
              icon={complianceBalance.isSurplus ? <FaCheckCircle /> : <FaExclamationTriangle />}
            />
          </div>

          {result && (
            <Card>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Operation Result</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">CB Before:</span>
                    <span className="ml-2 font-medium">{result.cbBefore.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Applied:</span>
                    <span className="ml-2 font-medium">{result.applied.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">CB After:</span>
                    <span className="ml-2 font-medium">{result.cbAfter.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Bank Surplus" icon={<FaPiggyBank />}>
              <p className="text-sm text-gray-400 mb-4">
                Bank positive compliance balance for future use.
              </p>
              <div className="space-y-3">
                <input
                  type="number"
                  className="input w-full"
                  placeholder="Amount (gCO₂eq)"
                  value={bankAmount}
                  onChange={(e) => setBankAmount(e.target.value)}
                />
                <button
                  className="btn-primary w-full"
                  onClick={handleBankSurplus}
                  disabled={!complianceBalance.isSurplus}
                >
                  Bank Surplus
                </button>
                {!complianceBalance.isSurplus && (
                  <p className="text-xs text-red-600">
                    Cannot bank: No surplus balance available
                  </p>
                )}
              </div>
            </Card>

            <Card title="Apply Banked" icon={<FaCoins />}>
              <p className="text-sm text-gray-400 mb-4">
                Apply previously banked surplus to current deficit.
              </p>
              <div className="space-y-3">
                <input
                  type="number"
                  className="input w-full"
                  placeholder="Amount (gCO₂eq)"
                  value={applyAmount}
                  onChange={(e) => setApplyAmount(e.target.value)}
                />
                <button
                  className="btn-primary w-full"
                  onClick={handleApplyBanked}
                  disabled={bankRecords.totalAvailable <= 0}
                >
                  Apply Banked
                </button>
                {bankRecords.totalAvailable <= 0 && (
                  <p className="text-xs text-red-600">
                    Cannot apply: No banked surplus available
                  </p>
                )}
              </div>
            </Card>
          </div>

          <Card title="Bank Records">
            <Table columns={columns} data={tableData} emptyMessage="No bank records found" />
          </Card>
        </>
      )}
    </div>
  );
};

