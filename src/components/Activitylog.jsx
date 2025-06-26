import React, { useEffect, useState } from 'react';
import BASE_URL from '../services/config'; // pastikan file ini ada dan benar

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/activity`);
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        console.error('❌ Gagal ambil log:', err);
        setError('Gagal memuat log aktivitas');
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Log Aktivitas</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {logs.map((log, index) => (
          <li key={index} className="bg-white p-3 rounded shadow text-sm">
            <span className="font-medium">{log.user?.name || 'Unknown'}:</span>{' '}
            {log.action} — <span className="text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;
