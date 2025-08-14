import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Defect } from '../types';

interface InspectModalProps {
  defect: Defect;
  onClose: () => void;
  userRole?: string;
  onOpenApproveModal?: (defectId: string) => void;
  onOpenRejectModal?: (defectId: string) => void;
  onOpenAcknowledgeModal?: (defectId: string) => void;
  onOpenScrapAcknowledgeModal?: (defectId: string) => void;
  isAlreadyInspected?: boolean;
  onDirectApprove?: (defectId: string, comments?: string) => void;
  onDirectReject?: (defectId: string, reason: string, comments?: string) => void;
}

export const InspectModal: React.FC<InspectModalProps> = ({ 
  defect, 
  onClose, 
  userRole,
  onOpenApproveModal,
  onOpenRejectModal,
  onOpenAcknowledgeModal,
  onOpenScrapAcknowledgeModal,
  isAlreadyInspected = false,
  onDirectApprove,
  onDirectReject
}) => {
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentRepairImageIndex, setCurrentRepairImageIndex] = useState(0);
  const [hasBeenInspectedLocally, setHasBeenInspectedLocally] = useState(isAlreadyInspected);

  // Mark as inspected when modal opens
  useEffect(() => {
    setHasBeenInspectedLocally(true);
  }, []);

  // Mock defect images - in real app, this would come from defect.original_images
  const defectImages = [
    defect.imageUrl,
    'https://images.pexels.com/photos/159740/library-la-trobe-study-students-159740.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=400'
  ].filter(Boolean) as string[];

  // Mock repair images - only for QC and when repair image exists
  const repairImages = (userRole === 'qc' || defect.status === 'QC Passed') && defect.repairImageUrl ? [
    defect.repairImageUrl,
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=400'
  ].filter(Boolean) as string[] : [];

  const handleImageClick = (src: string) => {
    setEnlargedImage(src);
  };

  const qcPassedRepairImages = defect.status === 'QC Passed' ? (
    defect.repairImageUrl ? [
      defect.repairImageUrl,
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=400'
    ].filter(Boolean) as string[] : []
  ) : [];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % defectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + defectImages.length) % defectImages.length);
  };

  const nextRepairImage = () => {
    setCurrentRepairImageIndex(prev => (prev + 1) % repairImages.length);
  };

  const prevRepairImage = () => {
    setCurrentRepairImageIndex(prev => (prev - 1 + repairImages.length) % repairImages.length);
  };

  const formatDate = (dateString: string) => {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const [hour, minute] = timePart.split(':');
    date.setHours(parseInt(hour), parseInt(minute));
    
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'รอดำเนินการ';
      case 'acknowledged': return 'รับทราบแล้ว';
      case 'approved': return 'อนุมัติแล้ว';
      case 'rejected': return 'ปฏิเสธแล้ว';
      default: return status;
    }
  };

  const getDefectTypeLabel = (status: string) => {
    if (status.includes('บาร์โค้ด')) return 'บาร์โค้ด/คิวอาร์โค้ด';
    if (status.includes('ฉลาก')) return 'ฉลาก';
    if (status.includes('ด้านบน')) return 'ด้านบน';
    if (status.includes('ด้านล่าง')) return 'ด้านล่าง';
    if (status.includes('Scrap')) return 'Scrap';
    return status;
  };

  // Action handlers
  const handleApprove = () => {
    if (onOpenApproveModal) {
      // Open approval confirmation modal
      onOpenApproveModal(defect.id);
      onClose();
    }
  };

  const handleReject = () => {
    if (onOpenRejectModal) {
      // Open rejection confirmation modal
      onOpenRejectModal(defect.id);
      onClose();
    }
  };

  const handleAcknowledge = () => {
    if (defect.status === 'Scrap (ไม่พบฉลาก)' && onOpenScrapAcknowledgeModal) {
      onOpenScrapAcknowledgeModal(defect.id);
    } else if (onOpenAcknowledgeModal) {
      onOpenAcknowledgeModal(defect.id);
    }
    onClose();
  };

  // Determine if action buttons should be shown
  const showQCActions = userRole === 'qc' && defect.state === 'acknowledged';
  const showOperatorActions = userRole === 'operator' && 
    (defect.state === 'pending' || defect.state === 'rejected') && 
    defect.status !== 'Normal' && 
    defect.status !== 'QC Passed';

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">ตรวจสอบ Defect</h2>
              <p className="text-sm text-gray-600 mt-1">
                {defect.productCode} - {defect.station === 'Roll' ? 'Roll' : 'Bundle'} {defect.station === 'Roll' ? defect.rollNumber : defect.bundleNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Standardized Side-by-Side Image Comparison for All Items */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-1 h-6 bg-blue-500 rounded mr-3"></div>
                {defect.status === 'QC Passed' 
                  ? 'การเปรียบเทียบก่อนและหลังการแก้ไข - QC Passed'
                  : 'การเปรียบเทียบรูป Defect และรูปหลังการแก้ไข'
                }
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Before Fix (Defect) Images */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-red-700 flex items-center">
                    <div className="w-1 h-5 bg-red-500 rounded mr-2"></div>
                    {defect.status === 'QC Passed' ? 'รูปก่อนแก้ไข (Defect)' : 'รูป Defect ที่ระบบตรวจพบ'}
                  </h4>
                  
                  {defectImages.length > 0 ? (
                    <div className="space-y-3">
                      <div className="relative bg-gray-50 rounded-lg overflow-hidden border-2 border-red-200">
                        <div className="relative">
                          <img
                            src={defectImages[currentImageIndex]}
                            alt={`Defect image ${currentImageIndex + 1}`}
                            className="w-full h-80 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleImageClick(defectImages[currentImageIndex])}
                          />
                          
                          {/* Defect Image Navigation */}
                          {defectImages.length > 1 && (
                            <>
                              <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1.5 rounded-full transition-all"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>
                              <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1.5 rounded-full transition-all"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          
                          {/* Defect Image Counter */}
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                            {currentImageIndex + 1} / {defectImages.length}
                          </div>
                          
                          {/* Defect Type Label */}
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {getDefectTypeLabel(defect.status)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Defect Thumbnails */}
                      {defectImages.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                          {defectImages.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                currentImageIndex === index 
                                  ? 'border-red-500 ring-2 ring-red-200' 
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              <img
                                src={image}
                                alt={`Defect thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <p className="text-gray-500">ไม่มีรูป Defect</p>
                    </div>
                  )}
                </div>

                {/* After Fix (Repair) Images */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-green-700 flex items-center">
                    <div className="w-1 h-5 bg-green-500 rounded mr-2"></div>
                    รูปหลังการแก้ไข (Repair)
                  </h4>
                  
                  {repairImages.length > 0 ? (
                    <div className="space-y-3">
                      <div className="relative bg-gray-50 rounded-lg overflow-hidden border-2 border-green-200">
                        <div className="relative">
                          <img
                            src={repairImages[currentRepairImageIndex]}
                            alt={`Repair image ${currentRepairImageIndex + 1}`}
                            className="w-full h-80 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleImageClick(repairImages[currentRepairImageIndex])}
                          />
                          
                          {/* Repair Image Navigation */}
                          {repairImages.length > 1 && (
                            <>
                              <button
                                onClick={prevRepairImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1.5 rounded-full transition-all"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>
                              <button
                                onClick={nextRepairImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1.5 rounded-full transition-all"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          
                          {/* Repair Image Counter */}
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                            {currentRepairImageIndex + 1} / {repairImages.length}
                          </div>
                          
                          {/* Status Label */}
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {defect.status === 'QC Passed' ? 'QC Passed' : 'แก้ไขแล้ว'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Repair Thumbnails */}
                      {repairImages.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                          {repairImages.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentRepairImageIndex(index)}
                              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                currentRepairImageIndex === index 
                                  ? 'border-green-500 ring-2 ring-green-200' 
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              <img
                                src={image}
                                alt={`Repair thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <p className="text-gray-500">ไม่มีรูปหลังการแก้ไข</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Production Details Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-6 bg-blue-500 rounded mr-3"></div>
                รายละเอียดการผลิต
              </h3>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Basic Production Info */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Production Line:</span>
                        <p className="text-base font-semibold text-gray-900">{defect.productionLine}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">สถานี:</span>
                        <p className="text-base font-semibold text-gray-900">{defect.station}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Product Code:</span>
                        <p className="text-base font-semibold text-gray-900">{defect.productCode}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          {defect.station === 'Roll' ? 'Roll Number:' : 'Bundle Number:'}
                        </span>
                        <p className="text-base font-semibold text-gray-900">
                          {defect.station === 'Roll' ? defect.rollNumber : defect.bundleNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Production Specifications */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Job Order Number:</span>
                        <p className="text-base font-semibold text-gray-900">{defect.jobOrderNumber}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Roll Width:</span>
                        <p className="text-base font-semibold text-gray-900">{defect.rollWidth} mm</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">ตรวจพบเมื่อ:</span>
                        <p className="text-base font-semibold text-gray-900">{formatDate(defect.timestamp)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Defect Status */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">ประเภท Defect:</span>
                        <p className="text-base font-semibold text-red-700">{defect.status}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">สถานะปัจจุบัน:</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          defect.state === 'approved' ? 'bg-green-100 text-green-800' :
                          defect.state === 'rejected' ? 'bg-red-100 text-red-800' :
                          defect.state === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {defect.state === 'acknowledged' ? 'แก้ไขแล้ว' : getStatusText(defect.state)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            {/* QC Action Buttons */}
            {showQCActions && (
              <>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  อนุมัติ
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  ปฏิเสธ
                </button>
              </>
            )}

            {/* Operator Action Buttons */}
            {showOperatorActions && (
              <button
                onClick={handleAcknowledge}
                disabled={!hasBeenInspectedLocally}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  hasBeenInspectedLocally
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                {defect.status === 'Scrap (ไม่พบฉลาก)' ? 'จำแนกประเภท Scrap' : 'ยืนยันการแก้ไข'}
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60">
          <div className="relative max-w-full max-h-full p-4">
            {/* Controls Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-medium">
                รูปขยาย - {getDefectTypeLabel(defect.status)}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition-colors"
                  title="ย่อ"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-white text-sm px-2">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={handleResetZoom}
                  className="p-2 bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition-colors"
                  title="รีเซ็ตการซูม"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition-colors"
                  title="ขยาย"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setEnlargedImage(null)}
                  className="p-2 bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition-colors ml-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Enlarged Image */}
            <div className="flex items-center justify-center overflow-hidden">
              <img
                src={enlargedImage}
                alt="Enlarged defect view"
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};