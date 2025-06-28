import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import InventorySalesSystem from './pages/InventorySalesSystem';
import { Toaster } from 'react-hot-toast'; // ⬅️ import toaster

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<InventorySalesSystem />} />
          <Route path="/products" element={<InventorySalesSystem />} />
          <Route path="/sales" element={<InventorySalesSystem />} />
          <Route path="/reports" element={<InventorySalesSystem />} />
          <Route path="/activity" element={<InventorySalesSystem />} />
          <Route path="/settings" element={<InventorySalesSystem />} />
        </Routes>

        {/* ⬇️ letakkan Toaster di luar <Routes> agar selalu tersedia */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '8px',
              padding: '12px 16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </>
    </Router>
  );
}

export default App;
