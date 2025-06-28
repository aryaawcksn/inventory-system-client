import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const DeletionToast = ({ count, onCancel }) => {
  const [progress, setProgress] = useState(0);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    let frame;
    let start;
    const duration = 3000;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const percent = Math.min((elapsed / duration) * 100, 100);
      setProgress(percent);
      if (elapsed < duration && !isCancelling) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [count, isCancelling]);

  const handleCancel = () => {
    setIsCancelling(true);
    setTimeout(() => {
      onCancel(); // tetap panggil fungsi pembatalan
    }, 300); // beri waktu sedikit sebelum menghilang
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg p-4 w-72 border-l-4 border-red-500"
    >
      <p className="text-sm font-medium text-gray-900 mb-2">
        {isCancelling
          ? 'Membatalkan...'
          : `Menghapus ${count.toLocaleString('id-ID')} produk yang dipilih mohon tunggu...`}
      </p>
      {!isCancelling && (
        <>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button
            onClick={handleCancel}
            className="text-sm text-gray-500 hover:text-red-600 float-right"
          >
            Batal
          </button>
        </>
      )}
    </motion.div>
  );
};

export default DeletionToast;
