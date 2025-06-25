import React, { useState, useEffect } from 'react';
import Select from 'react-select';


const baseURL = import.meta.env.VITE_API_URL;


const SaleFormModal = ({ setShowSaleForm, products, onSubmit }) => {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    customer: '',
    productId: '',
    qty: 1,
    total: 0,
    status: 'completed'
  });

  const productOptions = products.map(p => ({
    value: p.id,
    label: `${p.name} - Rp${Number(p.price).toLocaleString('id-ID')}`,
  }));

  const selectedOption = productOptions.find(opt => opt.value === selectedProductId);

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find(p => p.id === parseInt(selectedProductId));
      setSelectedProduct(product);
      const price = product?.price || 0;
      const qty = parseInt(form.qty) || 1;
      setForm(prev => ({ ...prev, total: price * qty, productId: selectedProductId }));
    }
  }, [selectedProductId, form.qty]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const statusOptions = [
    { value: 'completed', label: 'Selesai' },
    { value: 'pending', label: 'Pending' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customer || !selectedProductId || !form.qty) {
      alert('Mohon lengkapi semua field');
      return;
    }

    if (!selectedProduct) {
      alert('Pilih produk terlebih dahulu.');
      return;
    }

    if (form.qty > selectedProduct.stock) {
      alert(`Stok produk tidak mencukupi. Stok tersedia hanya ${selectedProduct.stock} unit.`);
      return;
    }

    const newSale = {
      date: form.date,
      customer: form.customer,
      productId: selectedProduct.id,
      items: selectedProduct.name,
      qty: parseInt(form.qty),
      total: form.total,
      status: form.status
    };

    try {
      const res = await fetch(`${baseURL}/api/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSale)
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Transaksi berhasil disimpan');
        onSubmit(); // ⬅️ Refresh data
        setShowSaleForm(false);
      } else {
        alert('❌ Gagal menyimpan transaksi: ' + data.message);
      }
    } catch (err) {
      alert('❌ Terjadi kesalahan saat menyimpan transaksi');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Tambah Transaksi Baru</h2>

        <div className="flex items-start bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-3 rounded mb-4">
          <svg
            className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0 text-yellow-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 4.93a10 10 0 0114.14 0M12 12a10 10 0 100 0z" />
          </svg>
          <p className="text-sm">
            <strong>Perhatian:</strong> Transaksi bersifat <span className="text-red-600 font-semibold">final</span>, harap masukkan dengan bijak.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="customer"
            placeholder="Nama Pelanggan"
            value={form.customer}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Produk</label>
            <Select
              options={productOptions}
              value={selectedOption}
              onChange={(selected) => setSelectedProductId(selected?.value || null)}
              placeholder="Cari produk..."
              className="text-sm"
            />
          </div>

          <input
            type="number"
            name="qty"
            value={form.qty}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            min="1"
          />

          {selectedProduct && (
            <p className="text-xs text-gray-500">
              Stok tersedia: <span className="font-semibold">{selectedProduct.stock}</span> unit
            </p>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select
              options={statusOptions}
              value={statusOptions.find(opt => opt.value === form.status)}
              onChange={(selected) => setForm({ ...form, status: selected.value })}
              className="text-sm"
              placeholder="Pilih status"
            />
          </div>

          <div className="text-right font-semibold">
            Total: Rp{form.total.toLocaleString('id-ID')}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowSaleForm(false)}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleFormModal;
