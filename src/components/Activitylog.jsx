// src/components/Activitylog.jsx
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import BASE_URL from '../services/config'; // ✅ pastikan file ini ada dan path benar

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/activity`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        console.error('❌ Gagal ambil log:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="bg-white shadow rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Log Aktivitas</h2>

      {loading ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Nama</th>
              <th className="p-2">Role</th>
              <th className="p-2">Aksi</th>
              <th className="p-2">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b">
                <td className="p-2"><Skeleton width={120} /></td>
                <td className="p-2"><Skeleton width={80} /></td>
                <td className="p-2"><Skeleton width={200} /></td>
                <td className="p-2"><Skeleton width={160} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">Belum ada aktivitas.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Nama</th>
              <th className="p-2">Role</th>
              <th className="p-2">Aksi</th>
              <th className="p-2">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id || log.id} className="border-b">
                <td className="p-2">{log.name}</td>
                <td className="p-2 capitalize">{log.role}</td>
                <td className="p-2">{log.action}</td>
                <td className="p-2">{new Date(log.timestamp).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ActivityLog;
