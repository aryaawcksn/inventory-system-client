import React, { useEffect, useState } from 'react';
import BASE_URL from '../services/config';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/activity`);
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        console.error('❌ Gagal ambil log:', err);
      }
    };

    fetchLogs(); // 🔁 Panggil saat komponen mount
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Log Aktivitas</h2>
      <ul className="space-y-2">
        {logs.map((log, index) => (
          <li key={index} className="p-2 bg-white rounded shadow text-sm">
            <strong>{log.user?.name}</strong>: {log.action} —{' '}
            <span className="text-gray-500">
              {new Date(log.timestamp).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;
