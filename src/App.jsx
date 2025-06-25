import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import InventorySalesSystem from './pages/InventorySalesSystem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<InventorySalesSystem />} />
        <Route path="/products" element={<InventorySalesSystem />} />
        <Route path="/sales" element={<InventorySalesSystem />} />
        <Route path="/reports" element={<InventorySalesSystem />} />
        <Route path="/settings" element={<InventorySalesSystem />} />
      </Routes>
    </Router>
  );
}

export default App;
