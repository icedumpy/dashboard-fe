import React, { useState } from 'react';
import { Layout } from './Layout';
import { useDefects } from '../hooks/useDefects';
import { useAuth } from '../contexts/AuthContext';
import { Eye, Check, X, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { ApprovalModal } from './ApprovalModal';
import { RejectionModal } from './RejectionModal';
import { InspectModal } from './InspectModal';

export const QCDashboard: React.FC = () => {
  const { defects, reviewDefect } = useDefects();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'overview'>('pending');
  const [selectedDefect, setSelectedDefect] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'approve' | 'reject' | 'inspect' | null>(null);
  const [productionLineFilter, setProductionLineFilter] = useState<string>('');
  const [defectTypeFilter, setDefectTypeFilter] = useState<string>('');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'approved' | 'rejected'>('all');

  const pendingDefects = defects.filter(d => d.state === 'acknowledged');
  const reviewedDefects = defects.filter(d => d.state === 'approved' || d.state === 'rejected');
  
  // Get today's date in the format used in the data
  const today = '29/05/2024';
  const approvedToday = defects.filter(d => 
    d.state === 'approved' && 
    d.reviewedAt && 
    d.reviewedAt.includes(today)
  ).length;
  const rejectedToday = defects.filter(d => 
    d.state === 'rejected' && 
    d.reviewedAt && 
    d.reviewedAt.includes(today)
  ).length;

  const filteredDefects = pendingDefects.filter(defect => {
    const matchesLine = !productionLineFilter || defect.productionLine.toString() === productionLineFilter;
    const matchesType = !defectTypeFilter || defect.status.includes(defectTypeFilter);
    return matchesLine && matchesType;
  });

  const filteredHistoryDefects = reviewedDefects.filter(defect => {
    const matchesLine = !productionLineFilter || defect.productionLine.toString() === productionLineFilter;
    const matchesType = !defectTypeFilter || defect.status.includes(defectTypeFilter);
    const matchesState = historyFilter === 'all' || defect.state === historyFilter;
    return matchesLine && matchesType && matchesState;
  });

  // Overview statistics
  const overviewStats = {
    totalReviewed: reviewedDefects.length,
    totalApproved: defects.filter(d => d.state === 'approved').length,
    totalRejected: defects.filter(d => d.state === 'rejected').length,
    approvalRate: reviewedDefects.length > 0 ? Math.round((defects.filter(d => d.state === 'approved').length / reviewedDefects.length) * 100) : 0,
    defectsByType: defects.reduce((acc, defect) => {
      if (defect.state === 'approved' || defect.state === 'rejected') {
        acc[defect.status] = (acc[defect.status] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    defectsByLine: defects.reduce((acc, defect) => {
      if (defect.state === 'approved' || defect.state === 'rejected') {
        const line = `Line ${defect.productionLine}`;
        acc[line] = (acc[line] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    rejectionReasons: defects.filter(d => d.state === 'rejected' && d.rejectionReason).reduce((acc, defect) => {
      const reason = defect.rejectionReason!;
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  const currentDefect = defects.find(d => d.id === selectedDefect);

  const handleApprove = (defectId: string, comments?: string) => {
    if (user) {
      reviewDefect(defectId, true, user.name, undefined, comments);
    }
    setSelectedDefect(null);
    setModalType(null);
  };

  const handleReject = (defectId: string, reason: string, comments?: string) => {
    if (user) {
      reviewDefect(defectId, false, user.name, reason, undefined);
    }
    setSelectedDefect(null);
    setModalType(null);
  };

  const handleOpenApproveModal = (defectId: string) => {
    setSelectedDefect(defectId);
    setModalType('approve');
  };

  const handleOpenRejectModal = (defectId: string) => {
    setSelectedDefect(defectId);
    setModalType('reject');
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Defect')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (status === 'Scrap') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <Layout title="QC Dashboard">
      <div className="space-y-6">
        {/* Header Tabs */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-1">
          <div className="flex space-x-1">
            {[
              { key: 'pending', label: 'รอการตรวจสอบ' },
              { key: 'history', label: 'ประวัติการตรวจสอบ' },
              { key: 'overview', label: 'ภาพรวมการตรวจสอบ' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 px-6 py-3 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-white hover:bg-blue-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">รอการตรวจสอบ</p>
                <p className="text-3xl font-bold text-gray-900">{pendingDefects.length}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +2 จากชั่วโมงที่แล้ว
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">อนุมัติวันนี้</p>
                <p className="text-3xl font-bold text-gray-900">{approvedToday}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5 จากเมื่อวาน
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ปฏิเสธวันนี้</p>
                <p className="text-3xl font-bold text-gray-900">{rejectedToday}</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  +1 จากเมื่อวาน
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          {activeTab === 'pending' && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">รายการที่รอตรวจสอบ</h3>
                <div className="flex space-x-4">
                  <select
                    value={productionLineFilter}
                    onChange={(e) => setProductionLineFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Production Line</option>
                    <option value="3">Line 3</option>
                    <option value="4">Line 4</option>
                  </select>
                  <select
                    value={defectTypeFilter}
                    onChange={(e) => setDefectTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">ประเภท Defect</option>
                    <option value="บาร์โค้ด">บาร์โค้ด/คิวอาร์โค้ด</option>
                    <option value="ฉลาก">ฉลาก</option>
                    <option value="ด้านบน">ด้านบน</option>
                    <option value="ด้านล่าง">ด้านล่าง</option>
                    <option value="Scrap">Scrap</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Production Line</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Code</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll/Bundle Number</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Order Number</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Width</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDefects.map((defect) => (
                      <tr key={defect.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{defect.productionLine}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{defect.station}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{defect.productCode}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{defect.station === 'Roll' ? defect.rollNumber : defect.bundleNumber}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{defect.jobOrderNumber}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{defect.rollWidth}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{defect.timestamp}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(defect.status)}`}>
                            {defect.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedDefect(defect.id);
                                setModalType('inspect');
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              title="ตรวจสอบ"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDefect(defect.id);
                                setModalType('approve');
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                              title="อนุมัติ"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDefect(defect.id);
                                setModalType('reject');
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              title="ปฏิเสธ"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">ประวัติการตรวจสอบ</h3>
                <div className="flex space-x-4">
                  <select
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value as 'all' | 'approved' | 'rejected')}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">การตรวจสอบทั้งหมด</option>
                    <option value="approved">อนุมัติเท่านั้น</option>
                    <option value="rejected">ปฏิเสธเท่านั้น</option>
                  </select>
                  <select
                    value={productionLineFilter}
                    onChange={(e) => setProductionLineFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Production Line</option>
                    <option value="3">Line 3</option>
                    <option value="4">Line 4</option>
                  </select>
                  <select
                    value={defectTypeFilter}
                    onChange={(e) => setDefectTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">ประเภท Defect</option>
                    <option value="บาร์โค้ด">บาร์โค้ด/คิวอาร์โค้ด</option>
                    <option value="ฉลาก">ฉลาก</option>
                    <option value="ด้านบน">ด้านบน</option>
                    <option value="ด้านล่าง">ด้านล่าง</option>
                    <option value="Scrap">Scrap</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Production Line</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Code</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll/Bundle Number</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Order Number</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Decision</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewed By</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredHistoryDefects.map((defect) => (
                      <tr key={defect.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{defect.productionLine}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{defect.station}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{defect.productCode}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{defect.station === 'Roll' ? defect.rollNumber : defect.bundleNumber}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{defect.jobOrderNumber}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(defect.status)}`}>
                            {defect.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            defect.state === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {defect.state === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{defect.reviewedBy}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{defect.reviewedAt}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              setSelectedDefect(defect.id);
                              setModalType('inspect');
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="ตรวจสอบ"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">QC Overview & Analytics</h3>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-900">{overviewStats.totalReviewed}</div>
                  <div className="text-sm text-blue-700 font-medium">ตรวจสอบทั้งหมด</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-2xl font-bold text-green-900">{overviewStats.totalApproved}</div>
                  <div className="text-sm text-green-700 font-medium">อนุมัติทั้งหมด</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="text-2xl font-bold text-red-900">{overviewStats.totalRejected}</div>
                  <div className="text-sm text-red-700 font-medium">ปฏิเสธทั้งหมด</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-2xl font-bold text-purple-900">{overviewStats.approvalRate}%</div>
                  <div className="text-sm text-purple-700 font-medium">อัตราการอนุมัติ</div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Defects by Type */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Reviewed Defects by Type</h4>
                  <div className="space-y-4">
                    {Object.entries(overviewStats.defectsByType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{type}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(count / overviewStats.totalReviewed) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Defects by Production Line */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Reviewed Defects by Line</h4>
                  <div className="space-y-4">
                    {Object.entries(overviewStats.defectsByLine).map(([line, count]) => (
                      <div key={line} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{line}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(count / overviewStats.totalReviewed) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rejection Reasons */}
              {Object.keys(overviewStats.rejectionReasons).length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">เหตุผลการปฏิเสธที่พบบ่อย</h4>
                  <div className="space-y-4">
                    {Object.entries(overviewStats.rejectionReasons)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([reason, count]) => (
                        <div key={reason} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{reason}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-red-600 h-2 rounded-full"
                                style={{ width: `${(count / overviewStats.totalRejected) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{count}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {currentDefect && modalType === 'approve' && (
        <ApprovalModal
          defect={currentDefect}
          onApprove={handleApprove}
          onClose={() => {
            setSelectedDefect(null);
            setModalType(null);
          }}
        />
      )}

      {currentDefect && modalType === 'reject' && (
        <RejectionModal
          defect={currentDefect}
          onReject={handleReject}
          onClose={() => {
            setSelectedDefect(null);
            setModalType(null);
          }}
        />
      )}

      {currentDefect && modalType === 'inspect' && (
        <InspectModal
          defect={currentDefect}
          onClose={() => {
            setSelectedDefect(null);
            setModalType(null);
          }}
          userRole={user?.role}
          onOpenApproveModal={handleOpenApproveModal}
        />
      )}
    </Layout>
  );
};