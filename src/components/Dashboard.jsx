// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Package,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
} from 'lucide-react';
import StatCard from './StatCard';

const Dashboard = ({ products, sales }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading data (1 detik)
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockItems = products.filter((p) => p.stock < 10).length;
  const totalSalesValue = sales.reduce((sum, sale) => sum + sale.total, 0);

  // Hitung penjualan hari ini
const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const today = new Date();
const todaySales = sales.filter((sale) => isSameDay(new Date(sale.date), today)).length;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
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

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Produk"
          value={totalProducts}
          icon={Package}
          color="#3B82F6"
          loading={loading}
        />
        <StatCard
          title="Total Stok"
          value={totalStock}
          icon={TrendingUp}
          color="#10B981"
          loading={loading}
        />
        <StatCard
          title="Stok Menipis"
          value={lowStockItems}
          icon={AlertTriangle}
          color="#F59E0B"
          loading={loading}
        />
        <StatCard
          title="Penjualan Hari Ini"
          value={todaySales}
          icon={ShoppingCart}
          color="#8B5CF6"
          loading={loading}
        />
      </div>

      {/* Dua Panel: Stok Menipis & Penjualan Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produk Stok Rendah */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produk Stok Rendah</h3>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 rounded-lg animate-pulse"
                />
              ))
            ) : (
              products
                .filter((p) => p.stock < 10)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    </div>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                      {product.stock} tersisa
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Penjualan Terbaru */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Penjualan Terbaru</h3>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-200 rounded-lg animate-pulse"
                />
              ))
            ) : (
              sales.slice(0, 4).map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{sale.customer}</p>
                    <p className="text-sm text-gray-600">{sale.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(sale.total)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        sale.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {sale.status === 'completed' ? 'Selesai' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
