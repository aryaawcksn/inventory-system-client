import React, { useEffect, useState } from 'react';
import BASE_URL from '../services/config'; // pastikan path sesuai
const res = await fetch(`${BASE_URL}/api/activity`);



const ActivityLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/activity`);
        const data = await res.json();
        setLogs(data.logs);
      } catch (err) {
        console.error('❌ Gagal ambil log:', err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="bg-white shadow rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Log Aktivitas</h2>
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
          {logs.map(log => (
            <tr key={log._id} className="border-b">
              <td className="p-2">{log.name}</td>
              <td className="p-2 capitalize">{log.role}</td>
              <td className="p-2">{log.action}</td>
              <td className="p-2">{new Date(log.timestamp).toLocaleString('id-ID')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLog;
