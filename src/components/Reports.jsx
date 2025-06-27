import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Reports = ({ products, sales, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <Skeleton height={24} width={200} />
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
          </div>
        ))}
      </div>
    );
  }

  // 🔢 Ringkasan inventory
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
  const lowStockItems = products.filter(product => product.stock < 10).length;

  // 🔢 Ringkasan penjualan
  const totalSalesValue = sales.reduce((sum, sale) => {
    const total = Number(sale.total);
    return sum + (isNaN(total) ? 0 : total);
  }, 0);

  const completedSales = sales.filter(s => s.status === 'completed').length;
  const totalQtySold = sales.reduce((sum, sale) => {
    const qty = Number(sale.qty);
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);

  // 📊 Data grafik penjualan per tanggal
  const salesByDateMap = {};

  sales.forEach((sale) => {
    const date = new Date(sale.date).toLocaleDateString('id-ID');
    const total = Number(sale.total) || 0;

    if (salesByDateMap[date]) {
      salesByDateMap[date] += total;
    } else {
      salesByDateMap[date] = total;
    }
  });

  const salesChartData = Object.entries(salesByDateMap).map(([date, total]) => ({
    date,
    total,
  }));

  // 💸 Format rupiah
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Laporan</h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-5 h-5" />
          <span>
            {new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ringkasan Penjualan */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Penjualan</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Penjualan</span>
              <span className="font-semibold">{formatCurrency(totalSalesValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Transaksi Selesai</span>
              <span className="font-semibold">{completedSales}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Produk Terjual</span>
              <span className="font-semibold">{totalQtySold} unit</span>
            </div>
          </div>
        </div>

        {/* Ringkasan Inventory */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Inventory</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Produk</span>
              <span className="font-semibold">{totalProducts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Stok Tersedia</span>
              <span className="font-semibold">{totalStock} unit</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Stok Menipis</span>
              <span className="font-semibold text-red-600">{lowStockItems} produk</span>
            </div>
          </div>
        </div>

        {/* Grafik Penjualan */}
        <div className="bg-white rounded-xl shadow-lg p-6 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performa Penjualan</h3>
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesChartData}
                margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis
                  width={90}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(val) => `Rp${(val / 1000000).toFixed(1)}jt`}
                />
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(value)
                  }
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
