import React, { useState } from 'react';

const baseURL = import.meta.env.VITE_API_URL;

const DataSection = () => {
  const [file, setFile] = useState(null);

  const handleExport = () => {
  window.open(`${baseURL}/api/sales/export-json`, '_blank');
};

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
  if (!file) return alert('📁 Pilih file JSON terlebih dahulu');

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const jsonData = JSON.parse(e.target.result);

      const res = await fetch(`${baseURL}/api/sales/import-json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user': JSON.stringify(JSON.parse(localStorage.getItem('user'))),
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

  const handleReset = async () => {
    const confirmed = window.confirm('⚠️ Yakin ingin mereset semua data penjualan? Tindakan ini tidak dapat dibatalkan.');
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

    const user = JSON.parse(localStorage.getItem('user'));

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
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Export Data Penjualan (JSON)
        </button>

        {/* IMPORT */}
        <div className="space-y-2">
          <input
  type="file"
  accept=".json"
  onChange={handleFileChange}
  className="w-full text-sm text-gray-700"
/>
          <button
            onClick={handleImport}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full"
          >
            Import Data Penjualan (JSON)
          </button>
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
