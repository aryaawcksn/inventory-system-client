// src/pages/InventorySalesSystem.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import ProductManagement from '../components/ProductManagement';
import SalesManagement from '../components/SalesManagement';
import Reports from '../components/Reports';
import AddProductModal from '../components/AddProductModal';
import SaleFormModal from '../components/SaleFormModal';
import Settings from '../components/Settings/Settings';
import AccessDenied from '../components/AccessDenied'; // ✅ Tambahkan ini


const baseURL = import.meta.env.VITE_API_URL;


const InventorySalesSystem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.replace('/', '') || 'dashboard';

  const [activeTab, setActiveTab] = useState(currentTab);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  // ✅ Definisikan tab yang diizinkan per role
  const allowedTabs = {
    admin: ['dashboard', 'products', 'sales', 'reports', 'settings'],
    gudang: ['products'],
    kasir: ['sales'],
  };

  // Fetch data awal
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, salesRes] = await Promise.all([
          fetch(`${baseURL}/api/products`),
          fetch(`${baseURL}/api/sales`),
        ]);

        const productsData = await productsRes.json();
        const salesData = await salesRes.json();

        setProducts(productsData.products || []);
        setSales(salesData.sales || []);
      } catch (error) {
        console.error('❌ Gagal ambil data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cek login user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
    } else {
      setUserRole(user.role);
    }
  }, [navigate]);

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  // ⛔ Cek izin role
  const isAllowed = allowedTabs[userRole]?.includes(activeTab);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${baseURL}/api/products`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Gagal memuat produk:', err);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await fetch(`${baseURL}/api/sales`);
      const data = await res.json();
      setSales(data.sales);
    } catch (err) {
      console.error('❌ Gagal mengambil data penjualan:', err);
    }
  };

  useEffect(() => {
    if (currentTab === 'sales') {
      fetchSales();
    }
  }, [currentTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="ml-64 p-8">
        {/* 🛡️ Privilege Check */}
        {!isAllowed ? (
          <AccessDenied />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard products={products} sales={sales} />
            )}
            {activeTab === 'products' && (
              <ProductManagement
                products={products}
                setShowAddProduct={setShowAddProduct}
              />
            )}
            {activeTab === 'sales' && (
              <SalesManagement
                sales={sales}
                setShowSaleForm={setShowSaleForm}
              />
            )}
            {activeTab === 'reports' && (
              <Reports products={products} sales={sales} />
            )}
            {activeTab === 'settings' && <Settings />}
          </>
        )}
      </div>

      {/* Modals */}
      {showAddProduct && (
        <AddProductModal
          setShowAddProduct={setShowAddProduct}
          fetchProducts={fetchProducts}
        />
      )}
      {showSaleForm && (
        <SaleFormModal
          setShowSaleForm={setShowSaleForm}
          products={products}
          onSubmit={fetchSales}
        />
      )}
    </div>
  );
};

export default InventorySalesSystem;
