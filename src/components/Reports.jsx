import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Reports = ({ products, sales, isLoading }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  // Filter sales berdasarkan rentang datepicker
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.date);
    if (startDate && saleDate < startDate) return false;
    if (endDate && saleDate > endDate) return false;
    return true;
  });

  // Ringkasan inventory
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
  const lowStockItems = products.filter((product) => product.stock < 10).length;

  // Ringkasan penjualan
  const totalSalesValue = filteredSales.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0);
  const completedSales = filteredSales.filter((s) => s.status === "completed").length;
  const totalQtySold = filteredSales.reduce((sum, sale) => sum + (Number(sale.qty) || 0), 0);

  // Data grafik penjualan per tanggal
  const salesByDateMap = {};
  filteredSales.forEach((sale) => {
    const date = new Date(sale.date).toLocaleDateString("id-ID");
    salesByDateMap[date] = (salesByDateMap[date] || 0) + (Number(sale.total) || 0);
  });
  const salesChartData = Object.entries(salesByDateMap).map(([date, total]) => ({ date, total }));

  // Top Produk Terlaris
  const productSalesMap = {};
  filteredSales.forEach((sale) => {
    if (!sale.productId) return;
    productSalesMap[sale.productId] = (productSalesMap[sale.productId] || 0) + (Number(sale.qty) || 0);
  });

  const topProducts = Object.entries(productSalesMap)
    .map(([productId, qty]) => {
      const product = products.find((p) => p._id === productId);
      return {
        id: productId,
        name: product ? product.name : "Produk Tidak Dikenal",
        qty,
      };
    })
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Top Produk Paling Untung
  const productProfitMap = {};
  filteredSales.forEach((sale) => {
    if (!sale.productId) return;
    const product = products.find((p) => p._id === sale.productId);
    if (!product) return;

    const cost = Number(product.cost || 0); // harga modal
    const totalProfit = (Number(sale.total) || 0) - cost * (Number(sale.qty) || 0);
    productProfitMap[sale.productId] = (productProfitMap[sale.productId] || 0) + totalProfit;
  });

  const topProfitProducts = Object.entries(productProfitMap)
    .map(([productId, profit]) => {
      const product = products.find((p) => p._id === productId);
      return {
        id: productId,
        name: product ? product.name : "Produk Tidak Dikenal",
        profit,
      };
    })
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  // Format rupiah
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Laporan</h1>

        {/* Filter & Info tanggal */}
        <div className="flex items-center space-x-4">
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setStartDate(update[0]);
              setEndDate(update[1]);
            }}
            isClearable
            placeholderText="dd/MM/yyyy - dd/MM/yyyy"
            className="border rounded-lg px-3 py-2 text-sm"
            dateFormat="dd/MM/yyyy"
            shouldCloseOnSelect={false}
          />
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            {startDate && endDate ? (
              <span>{startDate.toLocaleDateString("id-ID")} - {endDate.toLocaleDateString("id-ID")}</span>
            ) : (
              <span>{new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
            )}
          </div>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ringkasan Penjualan */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ringkasan Penjualan {startDate && endDate && (
              <span className="text-sm text-gray-500">
                ({startDate.toLocaleDateString("id-ID")} - {endDate.toLocaleDateString("id-ID")})
              </span>
            )}
          </h3>
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

        {/* Top Produk Terlaris */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produk Paling Laris {startDate && endDate && (
              <span className="text-sm text-gray-500">
                ({startDate.toLocaleDateString("id-ID")} - {endDate.toLocaleDateString("id-ID")})
              </span>
            )}</h3>
          
          {topProducts.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {topProducts.map((prod, idx) => (
                <li key={prod.id} className="flex justify-between items-center py-2">
                  <span>{idx + 1}. {prod.name}</span>
                  <span className="font-semibold text-gray-700">{prod.qty} unit</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Belum ada data penjualan</p>
          )}
        </div>

        {/* Top Produk Paling Untung */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produk Paling Untung {startDate && endDate && (
              <span className="text-sm text-gray-500">
                ({startDate.toLocaleDateString("id-ID")} - {endDate.toLocaleDateString("id-ID")})
              </span>
            )}</h3>
          {topProfitProducts.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {topProfitProducts.map((prod, idx) => (
                <li key={prod.id} className="flex justify-between items-center py-2">
                  <span>{idx + 1}. {prod.name}</span>
                  <span className="font-semibold text-gray-700">{formatCurrency(prod.profit)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Belum ada data penjualan</p>
          )}
        </div>

        {/* Grafik Penjualan */}
        <div className="bg-white rounded-xl shadow-lg p-6 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performa Penjualan {startDate && endDate && (
              <span className="text-sm text-gray-500">
                ({startDate.toLocaleDateString("id-ID")} - {endDate.toLocaleDateString("id-ID")})
              </span>
            )}</h3>
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesChartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis width={90} tick={{ fontSize: 12 }} tickFormatter={(val) => `Rp${(val / 1000000).toFixed(1)}jt`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
