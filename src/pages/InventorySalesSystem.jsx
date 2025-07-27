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
import AccessDenied from '../components/AccessDenied';
import ActivityLog from '../components/Activitylog';

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
  const [authLoading, setAuthLoading] = useState(true);
  const [authDone, setAuthDone] = useState(false); 
  const [longLoading, setLongLoading] = useState(false); // NEW: cek loading lama

  const allowedTabs = {
    admin: ['dashboard', 'products', 'sales', 'reports', 'settings', 'activity'],
    gudang: ['products'],
    kasir: ['sales'],
  };

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
    } else {
      setUserRole(user.role);
      setAuthDone(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (authDone && !isLoading) {
      const timer = setTimeout(() => {
        setAuthLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [authDone, isLoading]);

  // NEW: deteksi loading > 10 detik
  useEffect(() => {
    if (authLoading) {
      const timer = setTimeout(() => setLongLoading(true), 10000);
      return () => clearTimeout(timer);
    } else {
      setLongLoading(false);
    }
  }, [authLoading]);

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

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
    if (currentTab === 'sales') fetchSales();
  }, [currentTab]);

  useEffect(() => {
    if (currentTab === 'reports') {
      setIsLoading(true);
      Promise.all([
        fetch(`${baseURL}/api/products`),
        fetch(`${baseURL}/api/sales`)
      ])
        .then(async ([resProducts, resSales]) => {
          const dataProducts = await resProducts.json();
          const dataSales = await resSales.json();
          setProducts(dataProducts.products || []);
          setSales(dataSales.sales || []);
        })
        .catch((err) => console.error('Gagal mengambil data untuk reports:', err))
        .finally(() => setIsLoading(false));
    }
  }, [currentTab]);

  useEffect(() => {
    if (currentTab === 'dashboard') {
      setIsLoading(true);
      Promise.all([
        fetch(`${baseURL}/api/products`),
        fetch(`${baseURL}/api/sales`)
      ])
        .then(async ([resProducts, resSales]) => {
          const dataProducts = await resProducts.json();
          const dataSales = await resSales.json();
          setProducts(dataProducts.products || []);
          setSales(dataSales.sales || []);
        })
        .catch((err) => console.error('Gagal mengambil data untuk dashboard:', err))
        .finally(() => setIsLoading(false));
    }
  }, [currentTab]);

  // === LOADING SCREEN DENGAN FADE IN / OUT ===
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 transition-opacity duration-500">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>

          <div
            className={`transition-opacity duration-500 ${
              longLoading ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {longLoading ? (
              <div className="text-center text-gray-600 text-sm space-y-1">
                <p>Waking Up Server...</p>
                <p>This may take a while...</p>
                <p>Some Data May Not Shown...</p>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Memuat Data...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="ml-64 p-8">
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
              <Reports products={products} sales={sales} isLoading={isLoading} />
            )}
            {activeTab === 'settings' && <Settings />}
            {activeTab === 'activity' && <ActivityLog />}
          </>
        )}
      </div>

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
