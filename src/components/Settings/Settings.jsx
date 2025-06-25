// src/components/Settings/Settings.jsx
import React from 'react';
import AccountSection from './AccountSection';
import DataSection from './DataSection.jsx';

const Settings = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Pengaturan</h2>

      <AccountSection />
      <DataSection />

    </div>
  );
};

export default Settings;
