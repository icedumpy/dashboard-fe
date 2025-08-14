import React, { useState } from 'react';
import { X, Download, Calendar, Filter, FileText, FileSpreadsheet } from 'lucide-react';
import { Defect, ReportFilter } from '../types';

interface ReportModalProps {
  defects: Defect[];
  selectedStationType?: 'Roll' | 'Bundle' | null;
  selectedLineId?: number;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ defects, selectedStationType, selectedLineId, onClose }) => {
  const [filter, setFilter] = useState<ReportFilter>({
    startDate: '2024-05-01',
    endDate: '2024-05-31',
    productionLine: selectedLineId,
    defectType: undefined
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter defects based on selected station type if provided
  const filteredDefects = defects.filter(defect => {
    const defectDate = new Date(defect.timestamp.split(' ')[0].split('/').reverse().join('-'));
    const startDate = new Date(filter.startDate);
    const endDate = new Date(filter.endDate);
    
    const matchesDate = defectDate >= startDate && defectDate <= endDate;
    const matchesLine = !filter.productionLine || defect.productionLine === filter.productionLine;
    const matchesType = !filter.defectType || defect.status.includes(filter.defectType);
    const matchesStation = !selectedStationType || defect.station === selectedStationType;
    
    return matchesDate && matchesLine && matchesType && matchesStation;
  });

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create detailed data sheet
    const detailedData = [
      ['Date', 'Production Line', 'Station', 'Product Code', 'Roll/Bundle Number', 'Job Order Number', 'Roll Width', 'Status', 'State', 'Acknowledged By', 'Reviewed By', 'Comments'].join(','),
      ...filteredDefects.map(defect => [
        defect.timestamp,
        defect.productionLine,
        defect.station,
        defect.productCode,
        defect.station === 'Roll' ? defect.rollNumber : defect.bundleNumber,
        defect.jobOrderNumber,
        defect.rollWidth,
        defect.status,
        defect.state,
        defect.acknowledgedBy || '',
        defect.reviewedBy || '',
        defect.comments || ''
      ].join(','))
    ].join('\n');
    
    // Create summary data
    const summaryData = [
      ['Metric', 'Line 3 Roll', 'Line 3 Bundle', 'Line 4 Roll', 'Line 4 Bundle', 'Total'].join(','),
      ['Total Items', 
        filteredDefects.filter(d => d.productionLine === 3 && d.station === 'Roll').length,
        filteredDefects.filter(d => d.productionLine === 3 && d.station === 'Bundle').length,
        filteredDefects.filter(d => d.productionLine === 4 && d.station === 'Roll').length,
        filteredDefects.filter(d => d.productionLine === 4 && d.station === 'Bundle').length,
        filteredDefects.length
      ].join(','),
      ['Normal Items',
        filteredDefects.filter(d => d.productionLine === 3 && d.station === 'Roll' && d.status === 'Normal').length,
        filteredDefects.filter(d => d.productionLine === 3 && d.station === 'Bundle' && d.status === 'Normal').length,
        filteredDefects.filter(d => d.productionLine === 4 && d.station === 'Roll' && d.status === 'Normal').length,
        filteredDefects.filter(d => d.productionLine === 4 && d.station === 'Bundle' && d.status === 'Normal').length,
        filteredDefects.filter(d => d.status === 'Normal').length
      ].join(','),
      ['Defect Items',
        filteredDefects.filter(d => d.productionLine === 3 && d.station === 'Roll' && d.status.includes('Defect')).length,
        filteredDefects.filter(d => d.productionLine === 3 && d.station === 'Bundle' && d.status.includes('Defect')).length,
        filteredDefects.filter(d => d.productionLine === 4 && d.station === 'Roll' && d.status.includes('Defect')).length,
        filteredDefects.filter(d => d.productionLine === 4 && d.station === 'Bundle' && d.status.includes('Defect')).length,
        filteredDefects.filter(d => d.status.includes('Defect')).length
      ].join(','),
      ['Scrap Items',
        filteredDefects.filter(d => d.productionLine === 3 && d.station === 'Roll' && d.status === 'Scrap').length,
        filteredDefects.filter(d => d.productionLine === 3 && d.station === 'Bundle' && d.status === 'Scrap').length,
        filteredDefects.filter(d => d.productionLine === 4 && d.station === 'Roll' && d.status === 'Scrap').length,
        filteredDefects.filter(d => d.productionLine === 4 && d.station === 'Bundle' && d.status === 'Scrap').length,
        filteredDefects.filter(d => d.status === 'Scrap').length
      ].join(','),
      ['Approved Items',
        filteredDefects.filter(d => d.productionLine === 3 && d.station === 'Roll' && d.state === 'approved').length,
        filteredDefects.filter(d => d.productionLine === 3 && d.station === 'Bundle' && d.state === 'approved').length,
        filteredDefects.filter(d => d.productionLine === 4 && d.station === 'Roll' && d.state === 'approved').length,
        filteredDefects.filter(d => d.productionLine === 4 && d.station === 'Bundle' && d.state === 'approved').length,
        filteredDefects.filter(d => d.state === 'approved').length
      ].join(','),
      ['Rejected Items',
        filteredDefects.filter(d => d.productionLine === 3 && d.station === 'Roll' && d.state === 'rejected').length,
        filteredDefects.filter(d => d.productionLine === 3 && d.station === 'Bundle' && d.state === 'rejected').length,
        filteredDefects.filter(d => d.productionLine === 4 && d.station === 'Roll' && d.state === 'rejected').length,
        filteredDefects.filter(d => d.productionLine === 4 && d.station === 'Bundle' && d.state === 'rejected').length,
        filteredDefects.filter(d => d.state === 'rejected').length
      ].join(',')
    ].join('\n');
    
    // Combine both sheets (simulated Excel with 2 sheets)
    const excelContent = `SHEET 1: Detailed Data\n${detailedData}\n\n\nSHEET 2: Summary Report\n${summaryData}`;
    
    // Download as CSV (simulating Excel format)
    const blob = new Blob([excelContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const stationSuffix = selectedStationType ? `-${selectedStationType.toLowerCase()}` : '';
    const lineSuffix = selectedLineId ? `-line${selectedLineId}` : '';
    a.download = `quality-report${stationSuffix}${lineSuffix}-${filter.startDate}-to-${filter.endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setIsGenerating(false);
    onClose();
  };

  const reportStats = {
    total: filteredDefects.length,
    pending: filteredDefects.filter(d => d.state === 'pending').length,
    acknowledged: filteredDefects.filter(d => d.state === 'acknowledged').length,
    approved: filteredDefects.filter(d => d.state === 'approved').length,
    rejected: filteredDefects.filter(d => d.state === 'rejected').length,
    rollPassed: filteredDefects.filter(d => d.station === 'Roll' && d.status === 'Normal').length,
    bundlePassed: filteredDefects.filter(d => d.station === 'Bundle' && d.status === 'Normal').length,
    totalRollDefects: filteredDefects.filter(d => d.station === 'Roll' && d.status !== 'Normal').length,
    totalBundleDefects: filteredDefects.filter(d => d.station === 'Bundle' && d.status !== 'Normal').length
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">
              สร้างรายงาน{selectedStationType ? ` - ${selectedStationType} Station` : ''}
              {selectedLineId ? ` (Line ${selectedLineId})` : ''}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                วันที่เริ่มต้น
              </label>
              <input
                type="date"
                id="startDate"
                value={filter.startDate}
                onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                วันที่สิ้นสุด
              </label>
              <input
                type="date"
                id="endDate"
                value={filter.endDate}
                onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="productionLine" className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Production Line
              </label>
              <select
                id="productionLine"
                value={filter.productionLine || ''}
                disabled={!!selectedLineId}
                onChange={(e) => setFilter({ ...filter, productionLine: e.target.value ? Number(e.target.value) : undefined })}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  selectedLineId ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">ทุก Production Line</option>
                <option value="3">Line 3</option>
                <option value="4">Line 4</option>
              </select>
            </div>
            <div>
              <label htmlFor="defectType" className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Defect Type
              </label>
              <select
                id="defectType"
                value={filter.defectType || ''}
                onChange={(e) => setFilter({ ...filter, defectType: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">ทุกประเภท</option>
                <option value="บาร์โค้ด">บาร์โค้ด/คิวอาร์โค้ด</option>
                <option value="Label">ฉลาก</option>
                <option value="Top">ด้านบน</option>
                <option value="Bottom">ด้านล่าง</option>
                <option value="Scrap">Scrap</option>
              </select>
            </div>
          </div>

          {/* Report Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              ตัวอย่างรายงาน{selectedStationType ? ` (${selectedStationType} Station)` : ''}
            </h4>
            
            {/* Production Stats */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">ภาพรวมการผลิต</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="bg-white rounded p-3 border">
                  <div className="text-xl font-bold text-blue-600">{reportStats.rollPassed}</div>
                  <div className="text-xs text-gray-600">จำนวน Roll ที่ผ่าน</div>
                </div>
                <div className="bg-white rounded p-3 border">
                  <div className="text-xl font-bold text-green-600">{reportStats.bundlePassed}</div>
                  <div className="text-xs text-gray-600">จำนวน Bundle ที่ผ่าน</div>
                </div>
                <div className="bg-white rounded p-3 border">
                  <div className="text-xl font-bold text-orange-600">{reportStats.totalRollDefects}</div>
                  <div className="text-xs text-gray-600">จำนวน Roll ที่เป็น Defect</div>
                </div>
                <div className="bg-white rounded p-3 border">
                  <div className="text-xl font-bold text-red-600">{reportStats.totalBundleDefects}</div>
                  <div className="text-xs text-gray-600">จำนวน Bundle ที่เป็น Defect</div>
                </div>
              </div>
            </div>

            {/* Defect Status */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">สรุป Defect</h5>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              <div className="bg-white rounded p-3 border">
                <div className="text-2xl font-bold text-gray-900">{reportStats.total}</div>
                <div className="text-xs text-gray-600">ข้อ Defect ทั้งหมด</div>
              </div>
              <div className="bg-white rounded p-3 border">
                <div className="text-2xl font-bold text-yellow-600">{reportStats.pending}</div>
                <div className="text-xs text-gray-600">รอดำเนินการ</div>
              </div>
              <div className="bg-white rounded p-3 border">
                <div className="text-2xl font-bold text-blue-600">{reportStats.acknowledged}</div>
                <div className="text-xs text-gray-600">รับทราบแล้ว</div>
              </div>
              <div className="bg-white rounded p-3 border">
                <div className="text-2xl font-bold text-green-600">{reportStats.approved}</div>
                <div className="text-xs text-gray-600">อนุมัติแล้ว</div>
              </div>
              <div className="bg-white rounded p-3 border">
                <div className="text-2xl font-bold text-red-600">{reportStats.rejected}</div>
                <div className="text-xs text-gray-600">ถูกปฏิเสธ</div>
              </div>
              </div>
            </div>
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
            onClick={generateReport}
            disabled={isGenerating}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                กำลังสร้าง...
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                สร้างรายงาน Excel
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};