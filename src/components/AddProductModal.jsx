import React, { useState, useEffect } from 'react';

const baseURL = import.meta.env.VITE_API_URL;

const AddProductModal = ({ setShowAddProduct, fetchProducts, selectedProduct, mode }) => {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    stock: '',
    price: '',
    status: 'active',
    category: ''
  });

  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
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
    if (!form.name || !form.sku || !form.stock || !form.price) {
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

    if (form.sku.trim() === '' || !/^[a-zA-Z0-9-_]+$/.test(form.sku)) {
      setMessage('Masukan SKU yang valid.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessMessage('');

    if (!validate()) return;

    setSubmitting(true);

    try {
      const isEdit = mode === 'edit';
      const url = isEdit
        ? `${baseURL}/api/products/${selectedProduct._id}`
        : `${baseURL}/api/products`;

      const method = isEdit ? 'PUT' : 'POST';

      const user = JSON.parse(localStorage.getItem('user'));

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user': JSON.stringify(user)
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(data.message || (isEdit ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!'));
        fetchProducts();
        setShowAddProduct(false);

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
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-auto py-10">
    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">
        {mode === 'view'
          ? 'Detail Produk'
          : mode === 'edit'
          ? 'Edit Produk'
          : 'Tambah Produk Baru'}
      </h2>

      {successMessage && (
        <p className="text-sm text-green-600 mb-2">{successMessage}</p>
      )}
      {!successMessage && message && (
        <p className="text-sm text-red-600 mb-2">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Input Fields */}
        <input
          type="text"
          name="name"
          placeholder="Nama Produk"
          value={form.name}
          onChange={handleChange}
          readOnly={isReadOnly}
          className="w-full p-2 border rounded bg-white"
        />
        <input
          type="text"
          name="sku"
          placeholder="SKU (misal: ABC123)"
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

        <div className="flex justify-between items-center pt-2">
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
              disabled={submitting}
              className={`px-4 py-2 rounded text-white ${
                submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          )}
        </div>
      </form>
    </div>
  </div>
);

};

export default AddProductModal;
