// src/components/ProductManagement.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Eye, Edit, Trash2, ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import AddProductModal from './AddProductModal';

const baseURL = import.meta.env.VITE_API_URL;

const ProductSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-100 rounded w-1/2 mt-2"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
  </tr>
);

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('sku');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [showAddProduct, setShowAddProduct] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseURL}/api/products`);
      const data = await res.json();
      setProducts(data.products);
      console.log('📦 Produk masuk ke state:', data.products);
    } catch (err) {
      console.error('Gagal memuat data produk:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const sortedFilteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm.trim()) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'price' || sortBy === 'stock') {
        valA = Number(valA);
        valB = Number(valB);
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [products, searchTerm, sortBy, sortOrder]);

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Apakah Anda yakin ingin menghapus produk ini?');
    if (!confirm) return;

    const user = JSON.parse(localStorage.getItem('user'));

    try {
      const res = await fetch(`${baseURL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user': JSON.stringify(user),
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Produk berhasil dihapus!');
        fetchProducts();
      } else {
        alert(data.message || 'Gagal menghapus produk.');
      }
    } catch (error) {
      console.error('Gagal hapus produk:', error);
      alert('Terjadi kesalahan saat menghapus produk.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Produk</h1>
        <button 
          onClick={() => {
            setSelectedProduct(null);
            setModalMode('add');
            setShowAddProduct(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk atau SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button onClick={() => toggleSort('sku')} className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              {sortBy === 'sku' && sortOrder === 'asc' ? <ArrowDownAZ /> : <ArrowUpAZ />}
              <span>SKU</span>
            </button>
            <button onClick={() => toggleSort('stock')} className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <span>Stok</span>
            </button>
            <button onClick={() => toggleSort('price')} className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <span>Harga</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading
                ? [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
                : sortedFilteredProducts.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock === 0
                          ? 'bg-red-600 text-white'
                          : product.stock < 10
                          ? 'bg-red-100 text-red-800'
                          : product.stock < 20
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stock === 0 ? 'Stok Habis' : `${product.stock} unit`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" onClick={() => {
                          setSelectedProduct(product);
                          setModalMode('view');
                          setShowAddProduct(true);
                        }}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900" onClick={() => {
                          setSelectedProduct(product);
                          setModalMode('edit');
                          setShowAddProduct(true);
                        }}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(product._id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
              {!loading && sortedFilteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-center text-gray-400">
                    Belum ada data produk
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddProduct && (
        <AddProductModal
          setShowAddProduct={setShowAddProduct}
          fetchProducts={fetchProducts}
          selectedProduct={selectedProduct}
          mode={modalMode}
        />
      )}
    </div>
  );
};

export default ProductManagement;
