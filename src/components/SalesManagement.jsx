import React from 'react';
import {
  Plus,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Download,
  Eye,
  Edit,
} from 'lucide-react';
import StatCard from './StatCard';

const SalesManagement = ({ sales, setShowSaleForm }) => {
  const today = new Date().toLocaleDateString('id-ID'); // e.g. "23/6/2025"


  const totalSalesValue = sales.reduce((sum, sale) => sum + Number(sale.total), 0);

  const todaySales = sales.filter((sale) => {
  const saleDate = new Date(sale.date).toLocaleDateString('id-ID');
  return saleDate === today;
}).length;

  const avgTransaction = totalSalesValue / (sales.length || 1);

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

    const getSalesByDate = (dateStr) => {
  return sales
    .filter(sale => new Date(sale.date).toLocaleDateString('id-ID') === dateStr)
    .reduce((sum, sale) => sum + Number(sale.total || 0), 0);
};

      const todayStr = new Date().toLocaleDateString('id-ID');
      const yesterdayStr = new Date(Date.now() - 86400000).toLocaleDateString('id-ID');

      const todayTotal = getSalesByDate(todayStr);
      const yesterdayTotal = getSalesByDate(yesterdayStr);

      const trendValue = yesterdayTotal
        ? (((todayTotal - yesterdayTotal) / yesterdayTotal) * 100).toFixed(1)
        : 0;

      const trendText = trendValue >= 0 ? `+${trendValue}%` : `${trendValue}%`;
// const trendColor = trendValue >= 0 ? 'text-green-600' : 'text-red-600'; ← tidak dipakai, bisa hapus



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
        />
        <StatCard
          title="Transaksi Hari Ini"
          value={todaySales}
          icon={ShoppingCart}
          color="#3B82F6"
        />
        <StatCard
          title="Rata-rata Transaksi"
          value={formatCurrency(avgTransaction)}
          icon={BarChart3}
          color="#8B5CF6"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Riwayat Penjualan</h3>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
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
              {sales.map((sale) => (
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
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      
                    </div>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-6 text-center text-gray-400">
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
