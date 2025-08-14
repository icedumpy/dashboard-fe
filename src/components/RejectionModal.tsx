import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Defect } from '../types';

interface RejectionModalProps {
  defect: Defect;
  onReject: (defectId: string, reason: string, comments?: string) => void;
  onClose: () => void;
}

export const RejectionModal: React.FC<RejectionModalProps> = ({ defect, onReject, onClose }) => {
  const [rejectionReason, setRejectionReason] = useState('');

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    onReject(defect.id, rejectionReason.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">ปฏิเสธการแก้ไข Defect</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-sm font-medium text-red-800">
                ปฏิเสธการแก้ไขสำหรับ:
              </p>
            </div>
            <p className="text-sm text-red-700 mt-1">
              {defect.productCode} - {defect.station === 'Roll' ? 'Roll' : 'Bundle'} {defect.station === 'Roll' ? defect.rollNumber : defect.bundleNumber} ({defect.status})
            </p>
          </div>

          <div>
            <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
              เหตุผล *
            </label>
            <textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder=""
              required
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleReject}
            disabled={!rejectionReason.trim()}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};