// src/components/Activitylog.jsx
import React, { useEffect, useState } from 'react';
import BASE_URL from '../services/config'; // pastikan file ini ada dan export string URL

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/activity`);
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (error) {
        console.error('❌ Gagal ambil log:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Activity Log</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2 text-sm text-gray-700">
          {logs.map((log, index) => (
            <li key={index} className="border-b py-2">
              [{log.date}] {log.user} - {log.action}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLog;
