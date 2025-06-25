import { useEffect, useState } from 'react';
import { getAllBarang, createBarang } from '../services/barangService';

export default function Barang() {
  const [barang, setBarang] = useState([]);
  const [form, setForm] = useState({ nama: '', stok: 0, harga: 0 });

  useEffect(() => {
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
    const data = await getAllBarang();
    setBarang(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBarang(form);
    setForm({ nama: '', stok: 0, harga: 0 });
    fetchBarang();
  };

  return (
    <div className="p-4">
      <h1>Daftar Barang</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nama"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stok"
          value={form.stok}
          onChange={(e) => setForm({ ...form, stok: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Harga"
          value={form.harga}
          onChange={(e) => setForm({ ...form, harga: Number(e.target.value) })}
        />
        <button type="submit">Tambah</button>
      </form>

      <ul>
        {barang.map((b) => (
          <li key={b.id}>
            {b.nama} — Stok: {b.stok} — Rp {b.harga}
          </li>
        ))}
      </ul>
    </div>
  );
}
