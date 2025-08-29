import React, { useState, useEffect } from 'react';
import {
  Plus, DollarSign, ShoppingCart, BarChart3,
  ArrowUpAZ, ArrowDownAZ, CalendarClock, Check
} from 'lucide-react';
import StatCard from './StatCard';
import SaleSkeleton from './SaleSkeleton';

const baseURL = import.meta.env.VITE_API_URL;

const SalesManagement = ({ sales, setShowSaleForm }) => {
  const [loading, setLoading] = useState(true);
  const [sortByQtyDesc, setSortByQtyDesc] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [localSales, setLocalSales] = useState([]);
  const [role, setRole] = useState(null); // 👈 simpan role user
  const itemsPerPage = 8;

  const timeFilters = ['all', 'today', 'week', 'month'];
  const timeLabels = {
    all: 'All Time', today: 'Today', week: 'This Week', month: 'This Month'
  };

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      setRole(parsed.role); // ✅ ambil role dari user object
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }
}, []);

  const toggleTimeFilter = () => {
    const currentIndex = timeFilters.indexOf(timeFilter);
    const nextIndex = (currentIndex + 1) % timeFilters.length;
    setTimeFilter(timeFilters[nextIndex]);
  };

  const toDateStr = (date) => date.toISOString().split('T')[0];
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const today = new Date();
  const totalSalesValue = localSales.reduce((sum, sale) => sum + Number(sale.total), 0);
  const todayStr = toDateStr(today);
  const todaySales = localSales.filter((sale) => toDateStr(new Date(sale.date)) === todayStr).length;
  const avgTransaction = totalSalesValue / (localSales.length || 1);

  const filterSalesByTime = () => {
    const now = new Date();
    return localSales.filter((sale) => {
      const date = new Date(sale.date);
      if (timeFilter === 'today') return toDateStr(date) === toDateStr(now);
      if (timeFilter === 'week') {
        const start = new Date(now);
        start.setDate(start.getDate() - 6);
        return date >= start && date <= now;
      }
      if (timeFilter === 'month') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filteredSales = filterSalesByTime();
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getGroupedSales = () => {
    const grouped = {};
    filteredSales.forEach((sale) => {
      const key = sale.items;
      if (!grouped[key]) {
        grouped[key] = { items: sale.items, qty: 0, total: 0 };
      }
      grouped[key].qty += Number(sale.qty);
      grouped[key].total += Number(sale.total);
    });
    return Object.values(grouped);
  };

  const sortedGroupedSales = getGroupedSales().sort((a, b) =>
    sortByQtyDesc ? b.qty - a.qty : a.qty - b.qty
  );

  // Konfirmasi penjualan → update ke backend
  const confirmSale = async (saleId) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  try {
    const res = await fetch(`${baseURL}/api/sales/${saleId}/status`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "x-user": JSON.stringify(user) // ✅ kirim user ke backend
      },
      body: JSON.stringify({ status: "completed" }),
    });

    if (!res.ok) throw new Error("Gagal update status");

    // update state lokal biar UI real-time
    setLocalSales((prev) =>
      prev.map((sale) =>
        sale._id === saleId ? { ...sale, status: "completed" } : sale
      )
    );
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    setLocalSales(sales);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [sales]);

  useEffect(() => {
    setCurrentPage(1);
  }, [timeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Penjualan</h1>
        <button
          onClick={() => setShowSaleForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" /> <span>Transaksi Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Penjualan" value={formatCurrency(totalSalesValue)} icon={DollarSign} color="#10B981" loading={loading} />
        <StatCard title="Transaksi Hari Ini" value={todaySales} icon={ShoppingCart} color="#3B82F6" loading={loading} />
        <StatCard title="Rata-rata Transaksi" value={formatCurrency(avgTransaction)} icon={BarChart3} color="#8B5CF6" loading={loading} />
      </div>

      {/* TABEL 1: Riwayat Penjualan */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-6 pt-6 pb-3 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Riwayat Penjualan</h3>
          <button
            onClick={toggleTimeFilter}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <CalendarClock className="w-4 h-4" /> <span>{timeLabels[timeFilter]}</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y min-h-[400px]">
              {loading ? (
                [...Array(5)].map((_, i) => <SaleSkeleton key={i} />)
              ) : (
                paginatedSales.map((sale, i) => {
                  const globalIndex = (currentPage - 1) * itemsPerPage + i;
                  return (
                    <tr key={sale._id} className="hover:bg-gray-50">
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
                      <td className="px-6 py-4 text-center">
  {sale.status === "completed" ? (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold  bg-green-100 text-green-800">
      <Check className="w-3 h-3" /> Selesai
    </span>
  ) : role === "admin" ? (   // ✅ hanya admin yang bisa
    <button
      onClick={() => confirmSale(sale._id)}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-gray-800 text-white hover:bg-gray-700"
    >
      <Check className="w-3 h-3" /> Konfirmasi
    </button>
  ) : (
    <span className="text-xs text-gray-500">Menunggu admin</span>  // user lain hanya lihat
  )}
</td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 px-6 py-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            &lt; Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-gray-200 font-semibold' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next &gt;
          </button>
        </div>
      </div>

      {/* TABEL 2: Produk Paling Banyak Keluar */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-6 pt-6 pb-3 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Produk Terjual</h3>
          <button
            onClick={() => setSortByQtyDesc((p) => !p)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            {sortByQtyDesc ? (
              <ArrowDownAZ className="w-4 h-4" />
            ) : (
              <ArrowUpAZ className="w-4 h-4" />
            )}{' '}
            <span>Jumlah</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {loading ? (
                [...Array(5)].map((_, i) => <SaleSkeleton key={i} />)
              ) : (
                sortedGroupedSales.slice(0, 10).map((sale, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{sale.items}</td>
                    <td className="px-6 py-4">{sale.qty}</td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(sale.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesManagement;
