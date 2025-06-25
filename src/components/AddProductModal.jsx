// src/components/AddProductModal.jsx
import React, { useState, useEffect } from 'react';

const AddProductModal = ({ setShowAddProduct, fetchProducts, selectedProduct, mode }) => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    sku: '',
    stock: '',
    price: '',
    status: 'active',
  });

  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const isReadOnly = mode === 'view';

  useEffect(() => {
    if (selectedProduct) {
      setForm({
        name: selectedProduct.name || '',
        category: selectedProduct.category || '',
        sku: selectedProduct.sku || '',
        stock: selectedProduct.stock || '',
        price: selectedProduct.price || '',
        status: selectedProduct.status || 'active',
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name || !form.category || !form.sku || !form.stock || !form.price) {
      setMessage('Semua field wajib diisi.');
      return false;
    }

    if (parseInt(form.stock) < 1) {
      setMessage('Stok minimal 1.');
      return false;
    }

    if (parseInt(form.price) < 1000) {
      setMessage('Harga minimal 1000.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setSuccessMessage('');

  if (!validate()) return;

  try {
    const isEdit = mode === 'edit';
    const url = isEdit
      ? `http://localhost:5000/api/products/${selectedProduct.id}`
      : `http://localhost:5000/api/products`;

    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (res.ok) {
      setSuccessMessage(data.message || (isEdit ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!'));

      fetchProducts(); // refresh data

      setShowAddProduct(false); // ✅ tutup modal

      if (!isEdit) {
        setForm({
          name: '',
          category: '',
          sku: '',
          stock: '',
          price: '',
          status: 'active',
        });
      }
    } else {
      setMessage(data.message || 'Terjadi kesalahan.');
    }
  } catch (error) {
    console.error('Gagal simpan produk:', error);
    setMessage('Terjadi kesalahan saat menghubungi server.');
  }
}; // ✅ TUTUP handleSubmit di sini

// ⬇️ setelah ini baru mulai return UI



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">
          {mode === 'view'
            ? 'Detail Produk'
            : mode === 'edit'
            ? 'Edit Produk'
            : 'Tambah Produk Baru'}
        </h2>

        {/* Pesan */}
        {successMessage && (
          <p className="text-sm text-green-600 mb-2">{successMessage}</p>
        )}
        {!successMessage && message && (
          <p className="text-sm text-red-600 mb-2">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Nama Produk"
            value={form.name}
            onChange={handleChange}
            readOnly={isReadOnly}
            className="w-full p-2 border rounded bg-white"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            disabled={isReadOnly}
            className="w-full p-2 border rounded bg-white"
            required
          >
            <option value="">Pilih Kategori</option>
            <option value="Elektronik">Elektronik</option>
            <option value="Aksesoris">Aksesoris</option>
            <option value="Audio">Audio</option>
            <option value="Pakaian">Pakaian</option>
            <option value="Lainnya">Lainnya</option>
          </select>
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
            readOnly={isReadOnly}
            className="w-full p-2 border rounded bg-white"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stok"
            value={form.stock}
            onChange={handleChange}
            readOnly={isReadOnly}
            className="w-full p-2 border rounded bg-white"
          />
          <input
            type="number"
            name="price"
            placeholder="Harga"
            value={form.price}
            onChange={handleChange}
            readOnly={isReadOnly}
            className="w-full p-2 border rounded bg-white"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={isReadOnly}
            className="w-full p-2 border rounded bg-white"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowAddProduct(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              {mode === 'view' ? 'Tutup' : 'Batal'}
            </button>

            {mode !== 'view' && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Simpan
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
