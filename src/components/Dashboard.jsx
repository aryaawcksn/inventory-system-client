import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Package,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  Wallet,
  Clock,
  XCircle,
  TrendingDown,
  TrendingUp as TrendingUpIcon,
  Slash,
} from 'lucide-react';
import StatCard from './StatCard';

const Dashboard = ({ products, sales }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const getDailySales = (date) =>
    sales.filter((s) => isSameDay(new Date(s.date), date)).length;

  const getDailyRevenue = (date) =>
    sales
      .filter((s) => isSameDay(new Date(s.date), date) && s.status === 'completed')
      .reduce((sum, s) => sum + s.total, 0);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockItems = products.filter((p) => p.stock < 10).length;
  const outOfStockItems = products.filter((p) => p.stock === 0).length;

  const todaySales = getDailySales(today);
  const yesterdaySales = getDailySales(yesterday);
  const salesDiff = todaySales - yesterdaySales;
  const salesTrendText =
    salesDiff === 0
      ? 'Stabil'
      : `${salesDiff > 0 ? '+' : '-'}${Math.abs(salesDiff)} dari kemarin`;
  const salesTrendColor =
    salesDiff > 0 ? 'text-green-600' : salesDiff < 0 ? 'text-red-600' : 'text-gray-500';
  const salesTrendIcon = salesDiff > 0 ? TrendingUpIcon : salesDiff < 0 ? TrendingDown : null;

  const todayRevenue = getDailyRevenue(today);
  const yesterdayRevenue = getDailyRevenue(yesterday);
  const revenueDiff = todayRevenue - yesterdayRevenue;
  const revenueTrendText =
    revenueDiff === 0
      ? 'Stabil'
      : `${revenueDiff > 0 ? '+' : '-'}${formatCurrency(Math.abs(revenueDiff))} dari kemarin`;
  const revenueTrendColor =
    revenueDiff > 0 ? 'text-green-600' : revenueDiff < 0 ? 'text-red-600' : 'text-gray-500';
  const revenueTrendIcon = revenueDiff > 0 ? TrendingUpIcon : revenueDiff < 0 ? TrendingDown : null;

  const pendingSales = sales.filter((sale) => sale.status === 'pending').length;

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const inactiveProducts = products.filter((product) => {
    const relatedSales = sales.filter((sale) => sale.productId === product._id);
    if (relatedSales.length === 0) return true;
    const latestSale = relatedSales.reduce((latest, current) =>
      new Date(current.date) > new Date(latest.date) ? current : latest
    );
    return new Date(latestSale.date) < oneMonthAgo;
  }).length;

  // ✅ Sort sales by createdAt descending & ambil 4 terbaru
  const latestSales = [...sales]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-5 h-5" />
          <span>
            {today.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Produk" value={totalProducts} icon={Package} color="#3B82F6" loading={loading} />
        <StatCard title="Total Stok" value={totalStock} icon={TrendingUp} color="#10B981" loading={loading} />
        <StatCard title="Stok Menipis" value={lowStockItems} icon={AlertTriangle} color="#F59E0B" loading={loading} />
        <StatCard
          title="Penjualan Hari Ini"
          value={todaySales}
          icon={ShoppingCart}
          color="#8B5CF6"
          trend={salesTrendText}
          trendColor={salesTrendColor}
          trendIcon={salesTrendIcon}
          loading={loading}
        />
        <StatCard
          title="Pendapatan Hari Ini"
          value={formatCurrency(todayRevenue)}
          icon={Wallet}
          color="#22C55E"
          trend={revenueTrendText}
          trendColor={revenueTrendColor}
          trendIcon={revenueTrendIcon}
          loading={loading}
        />
        <StatCard
          title="Penjualan Pending"
          value={pendingSales}
          icon={Clock}
          color="#FBBF24"
          trend="Butuh konfirmasi"
          trendColor="text-yellow-600"
          loading={loading}
        />
        <StatCard
          title="Produk Kosong"
          value={outOfStockItems}
          icon={XCircle}
          color="#EF4444"
          trend="Segera restok"
          trendColor="text-red-600"
          loading={loading}
        />
        <StatCard
          title="Produk Tidak Aktif"
          value={inactiveProducts}
          icon={Slash}
          color="#9CA3AF"
          trend="Tidak terjual lebih dari 1 bulan"
          trendColor="text-gray-600"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produk Stok Rendah */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produk Stok Rendah</h3>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
              ))
            ) : products.filter((p) => p.stock < 10).length === 0 ? (
              <div className="text-gray-500 text-sm">Tidak ada produk dengan stok rendah.</div>
            ) : (
              products
                .filter((p) => p.stock < 10)
                .map((product) => (
                  <div
                    key={product._id}
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
                <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
              ))
            ) : latestSales.length === 0 ? (
              <div className="text-gray-500 text-sm">Belum ada penjualan.</div>
            ) : (
              latestSales.map((sale) => (
                <div
                  key={sale._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{sale.items}</p>
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
