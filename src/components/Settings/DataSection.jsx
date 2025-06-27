import React, { useState } from 'react';

const baseURL = import.meta.env.VITE_API_URL;

const DataSection = () => {
  const [file, setFile] = useState(null);
  const [importType, setImportType] = useState(''); // "sales" atau "products"

  const user = JSON.parse(localStorage.getItem('user'));

  // === EXPORT ===
  const handleExportSales = () => {
    window.open(`${baseURL}/api/sales/export-json`, '_blank');
  };

  const handleExportProducts = () => {
    window.open(`${baseURL}/api/products/export-json`, '_blank');
  };

  // === IMPORT ===
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file || !importType) return alert('📁 Pilih file dan jenis data yang akan diimpor');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        const endpoint =
          importType === 'sales' ? '/api/sales/import-json' : '/api/products/import-json';

        const res = await fetch(`${baseURL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user': JSON.stringify(user),
          },
          body: JSON.stringify(jsonData),
        });

        const data = await res.json();
        if (res.ok) {
          alert(`✅ ${data.message}`);
          setFile(null);
        } else {
          alert('❌ Gagal import: ' + data.message);
        }
      } catch (err) {
        alert('❌ Format JSON tidak valid');
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  // === RESET ===
  const handleReset = async () => {
    const confirmed = window.confirm('⚠️ Yakin ingin mereset semua data penjualan?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${baseURL}/api/sales/reset`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok) {
        alert('🧹 Semua data penjualan berhasil dihapus');
      } else {
        alert('❌ Gagal reset: ' + data.message);
      }
    } catch (error) {
      alert('❌ Terjadi kesalahan saat reset');
      console.error(error);
    }
  };

  const handleResetAll = async () => {
    const confirmed = window.confirm('⚠️ Yakin ingin mereset semua data produk dan penjualan?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${baseURL}/api/system/reset-all`, {
        method: 'DELETE',
        headers: {
          'x-user': JSON.stringify(user),
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || '✅ Semua data berhasil direset');
      } else {
        alert('❌ Gagal reset semua data');
      }
    } catch (error) {
      alert('❌ Terjadi kesalahan saat reset semua data');
      console.error(error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Backup & Restore</h3>

      <div className="space-y-4">
        {/* EXPORT */}
        <button
          onClick={handleExportSales}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Export Data Penjualan (JSON)
        </button>
        <button
          onClick={handleExportProducts}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Export Data Produk (JSON)
        </button>

        {/* IMPORT */}
        <div className="space-y-2">
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-700"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                setImportType('sales');
                handleImport();
              }}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full"
            >
              Import Data Penjualan (JSON)
            </button>
            <button
              onClick={() => {
                setImportType('products');
                handleImport();
              }}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full"
            >
              Import Data Produk (JSON)
            </button>
          </div>
        </div>

        {/* RESET */}
        <button
          onClick={handleResetAll}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
        >
          Reset Semua Data
        </button>
        <button
          onClick={handleReset}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
        >
          Reset Data Penjualan
        </button>
      </div>
    </div>
  );
};

export default DataSection;
