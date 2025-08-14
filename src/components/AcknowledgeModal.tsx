import React from 'react';
import { X, AlertTriangle, Upload, Image } from 'lucide-react';
import { Defect } from '../types';

interface AcknowledgeModalProps {
  defect: Defect;
  onConfirm: (defectId: string, imageFile?: File) => void;
  onClose: () => void;
}

export const AcknowledgeModal: React.FC<AcknowledgeModalProps> = ({ defect, onConfirm, onClose }) => {
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleConfirm = () => {
    onConfirm(defect.id, selectedImage || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">ยืนยันการแก้ไข</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <p className="text-sm font-medium text-orange-800">
                ยืนยันการแก้ไขสำหรับ:
              </p>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-sm text-orange-700">
                <strong>Product Code:</strong> {defect.productCode}
              </p>
              <p className="text-sm text-orange-700">
                <strong>{defect.station === 'Roll' ? 'Roll Number' : 'Bundle Number'}:</strong> {defect.station === 'Roll' ? defect.rollNumber : defect.bundleNumber}
              </p>
              <p className="text-sm text-orange-700">
                <strong>Job Order Number:</strong> {defect.jobOrderNumber}
              </p>
              <p className="text-sm text-orange-700">
                <strong>Station:</strong> {defect.station}
              </p>
              <p className="text-sm text-orange-700">
                <strong>สถานะ:</strong> {defect.status}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              การยืนยันการแก้ไขข้อบกพร่องนี้ คุณยืนยันว่าได้:
            </p>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>ตรวจสอบรายละเอียด Defect แล้ว</li>
              <li>ดำเนินการแก้ไขแล้ว</li>
            </ul>
          </div>

          {defect.state === 'rejected' && defect.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-800">เหตุผลการปฏิเสธครั้งก่อน:</p>
              <p className="text-sm text-red-700 mt-1">{defect.rejectionReason}</p>
            </div>
          )}

          {/* Image Upload Section */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h5 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
              <Image className="w-4 h-4 mr-2" />
              อัปโหลดรูปหลังการแก้ไข (จำเป็น) *
            </h5>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-blue-400" />
                  <span className="text-sm text-blue-600 font-medium">
                    คลิกเพื่ออัปโหลดรูปหลังการแก้ไข
                  </span>
                  <span className="text-xs text-blue-500">
                    PNG, JPG ขนาดไม่เกิน 10MB
                  </span>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Repair preview"
                    className="w-full h-32 object-cover rounded-lg border border-blue-200"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-blue-600">
                  รูปพร้อมอัปโหลด: {selectedImage?.name}
                </p>
              </div>
            )}
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
            onClick={handleConfirm}
            disabled={!selectedImage}
            className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            ยืนยันการแก้ไข
          </button>
        </div>
      </div>
    </div>
  );
};