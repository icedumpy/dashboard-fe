import React, { useState } from 'react';
import { X, AlertTriangle, Package, Upload, Image } from 'lucide-react';
import { Defect } from '../types';

interface ScrapAcknowledgeModalProps {
  defect: Defect;
  onConfirm: (defectId: string, finalStatus: string, imageFile?: File) => void;
  onClose: () => void;
}

export const ScrapAcknowledgeModal: React.FC<ScrapAcknowledgeModalProps> = ({ defect, onConfirm, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    if (!selectedOption) return;
    onConfirm(defect.id, selectedOption, selectedImage || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">จำแนกประเภทของ Scrap</h3>
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
              <Package className="w-5 h-5 text-red-600" />
              <p className="text-sm font-medium text-red-800">
                จำแนกประเภทของ Scrap:
              </p>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-sm text-red-700">
                <strong>Product Code:</strong> {defect.productCode}
              </p>
              <p className="text-sm text-red-700">
                <strong>{defect.station === 'Roll' ? 'Roll Number' : 'Bundle Number'}:</strong> {defect.station === 'Roll' ? defect.rollNumber : defect.bundleNumber}
              </p>
              <p className="text-sm text-red-700">
                <strong>Job Order Number:</strong> {defect.jobOrderNumber}
              </p>
              <p className="text-sm text-red-700">
                <strong>Station:</strong> {defect.station}
              </p>
              <p className="text-sm text-red-700">
                <strong>สถานะปัจจุบัน:</strong> {defect.status}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              กรุณาเลือกประเภทของ Scrap:
            </p>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="scrapOption"
                  value="Defect: ฉลาก"
                  checked={selectedOption === 'Defect: ฉลาก'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Defect: ฉลาก</p>
                  <p className="text-xs text-gray-600"></p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="scrapOption"
                  value="Scrap"
                  checked={selectedOption === 'Scrap'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Scrap</p>
                  <p className="text-xs text-gray-600"></p>
                </div>
              </label>
            </div>
          </div>

          {/* Conditional Image Upload - Only for Defect: Label */}
          {selectedOption === 'Defect: ฉลาก' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                <Image className="w-4 h-4 mr-2" />
                อัปโหลดรูปหลังการแก้ไข (บังคับ) *
              </h5>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="scrap-image-upload"
                  />
                  <label
                    htmlFor="scrap-image-upload"
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
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              การเลือกตัวเลือก คุณยืนยันว่าได้:
            </p>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>ตรวจสอบชิ้นงานอย่างละเอียดแล้ว</li>
              <li>เลือกประเภทของ Scrap หรือ Defect ถูกต้องแล้ว</li>
            </ul>
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
            disabled={!selectedOption || (selectedOption === 'Defect: ฉลาก' && !selectedImage)}
            className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            ยืนยันการจำแนกประเภท
          </button>
        </div>
      </div>
    </div>
  );
};