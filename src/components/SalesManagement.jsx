import React, { useState, useEffect } from 'react';
import {
  Plus,
  DollarSign,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import StatCard from './StatCard';
import SaleSkeleton from './SaleSkeleton';

const SalesManagement = ({ sales, setShowSaleForm }) => {
  const [loading, setLoading] = useState(true);

  const toDateStr = (date) => date.toISOString().split('T')[0];

  const getTotalSalesBetween = (startDate, endDate) => {
    return sales
      .filter((sale) => {
        const saleDate = toDateStr(new Date(sale.date));
        return saleDate >= toDateStr(startDate) && saleDate <= toDateStr(endDate);
      })
      .reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  };

  const getSalesByDate = (dateStr) => {
    return sales
      .filter((sale) => toDateStr(new Date(sale.date)) === dateStr)
      .reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  // === Trend Mingguan ===
  const today = new Date();

  const endThisWeek = new Date(today);
  const startThisWeek = new Date(today);
  startThisWeek.setDate(startThisWeek.getDate() - 6);

  const endLastWeek = new Date(startThisWeek);
  endLastWeek.setDate(endLastWeek.getDate() - 1);
  const startLastWeek = new Date(endLastWeek);
  startLastWeek.setDate(startLastWeek.getDate() - 6);

  const totalThisWeek = getTotalSalesBetween(startThisWeek, endThisWeek);
  const totalLastWeek = getTotalSalesBetween(startLastWeek, endLastWeek);

  const trendValue =
    totalLastWeek > 0
      ? (((totalThisWeek - totalLastWeek) / totalLastWeek) * 100).toFixed(1)
      : totalThisWeek > 0
      ? 100
      : 0;

  const trendText = trendValue >= 0 ? `+${trendValue}%` : `${trendValue}%`;
  const trendColor = trendValue >= 0 ? 'text-green-600' : 'text-red-600';
  const trendIcon = trendValue >= 0 ? TrendingUp : TrendingDown;

  const totalSalesValue = sales.reduce((sum, sale) => sum + Number(sale.total), 0);

  const todayStr = toDateStr(today);
  const todaySales = sales.filter(
    (sale) => toDateStr(new Date(sale.date)) === todayStr
  ).length;

  const avgTransaction = totalSalesValue / (sales.length || 1);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [sales]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Penjualan</h1>
        <button
          onClick={() => setShowSaleForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Transaksi Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total Penjualan"
          value={formatCurrency(totalSalesValue)}
          icon={DollarSign}
          color="#10B981"
          trend={trendText}
          trendColor={trendColor}
          trendIcon={trendIcon}
          loading={loading}
        />
        <StatCard
          title="Transaksi Hari Ini"
          value={todaySales}
          icon={ShoppingCart}
          color="#3B82F6"
          loading={loading}
        />
        <StatCard
          title="Rata-rata Transaksi"
          value={formatCurrency(avgTransaction)}
          icon={BarChart3}
          color="#8B5CF6"
          loading={loading}
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Riwayat Penjualan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-gray-500 uppercase tracking-wider">Produk</th>
                <th className="px-6 py-3 text-gray-500 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-3 text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                [...Array(5)].map((_, i) => <SaleSkeleton key={i} />)
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{formatDate(sale.date)}</td>
                    <td className="px-6 py-4">{sale.items}</td>
                    <td className="px-6 py-4">{sale.qty}</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(sale.total)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          sale.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {sale.status === 'completed' ? 'Selesai' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
              {!loading && sales.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-center text-gray-400">
                    Belum ada data penjualan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesManagement;
