import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Defect } from '../types';

interface ApprovalModalProps {
  defect: Defect;
  onApprove: (defectId: string, comments?: string) => void;
  onClose: () => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({ defect, onApprove, onClose }) => {
  const [comments, setComments] = useState('');

  const handleApprove = () => {
    onApprove(defect.id, comments || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">อนุมัติการแก้ไข Defect</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-800">
                ยืนยันการแก้ไข Defect สำหรับ:
              </p>
            </div>
            <p className="text-sm text-green-700 mt-1">
              {defect.productCode} - {defect.station === 'Roll' ? 'Roll' : 'Bundle'} {defect.station === 'Roll' ? defect.rollNumber : defect.bundleNumber} ({defect.status})
            </p>
          </div>

          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
              ความคิดเห็นเพิ่มเติม (ไม่บังคับ)
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder=""
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
            onClick={handleApprove}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};