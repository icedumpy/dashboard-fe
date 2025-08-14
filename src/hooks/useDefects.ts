import { useState, useEffect } from 'react';
import { Defect } from '../types';

// Mock data with more comprehensive dataset including normal items
const mockDefects: Defect[] = [
  // Line 3 Roll - Defects
  {
    id: '1',
    productionLine: 3,
    station: 'Roll',
    productCode: '13W1AF2MB',
    rollNumber: '450413',
    jobOrderNumber: '3E3G256009',
    rollWidth: 330,
    timestamp: '29/05/2024 16:50',
    status: 'Defect: บาร์โค้ด/คิวอาร์โค้ด',
    state: 'pending',
    imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    productionLine: 3,
    station: 'Roll',
    productCode: '13W10C2MB',
    rollNumber: '451070',
    jobOrderNumber: '3D3G256045',
    rollWidth: 270,
    timestamp: '29/05/2024 16:35',
    status: 'Defect: ฉลาก',
    state: 'pending',
    imageUrl: 'https://images.pexels.com/photos/159740/library-la-trobe-study-students-159740.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    productionLine: 3,
    station: 'Roll',
    productCode: '13W10C2MB',
    rollNumber: '461182',
    jobOrderNumber: '3E3G256010',
    rollWidth: 340,
    timestamp: '29/05/2024 15:12',
    status: 'Scrap',
    state: 'acknowledged',
    acknowledgedBy: 'P. Charuchinda',
    acknowledgedAt: '29/05/2024 15:15',
    imageUrl: 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/5691660/pexels-photo-5691660.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  // Line 3 Roll - Normal items
  {
    id: '4',
    productionLine: 3,
    station: 'Roll',
    productCode: '13W10C2MB',
    rollNumber: '462263',
    jobOrderNumber: '3D3G256046',
    rollWidth: 193,
    timestamp: '29/05/2024 17:01',
    status: 'Scrap (ไม่พบฉลาก)',
    state: 'pending',
    imageUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108102/pexels-photo-1108102.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    productionLine: 3,
    station: 'Roll',
    productCode: '13W1AF2MB',
    rollNumber: '462264',
    jobOrderNumber: '3E3G256011',
    rollWidth: 330,
    timestamp: '29/05/2024 17:05',
    status: 'Normal',
    state: 'approved',
    imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108103/pexels-photo-1108103.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '6',
    productionLine: 3,
    station: 'Roll',
    productCode: '13W10C2MB',
    rollNumber: '462265',
    jobOrderNumber: '3D3G256047',
    rollWidth: 270,
    timestamp: '29/05/2024 17:10',
    status: 'Normal',
    state: 'approved',
    imageUrl: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108104/pexels-photo-1108104.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  // Line 3 Bundle - Defects
  {
    id: '7',
    productionLine: 3,
    station: 'Bundle',
    productCode: '13W1AF2MB',
    bundleNumber: '450413',
    jobOrderNumber: '3E3G256009',
    rollWidth: 330,
    timestamp: '29/05/2024 16:50',
    status: 'Defect: บาร์โค้ด',
    state: 'acknowledged',
    acknowledgedBy: 'P. Charuchinda',
    acknowledgedAt: '29/05/2024 16:52',
    imageUrl: 'https://images.pexels.com/photos/5691661/pexels-photo-5691661.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/5691662/pexels-photo-5691662.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '8',
    productionLine: 3,
    station: 'Bundle',
    productCode: '13W10C2MB',
    bundleNumber: '451070',
    jobOrderNumber: '3D3G256045',
    rollWidth: 270,
    timestamp: '29/05/2024 16:35',
    status: 'Defect: ด้านบน',
    state: 'acknowledged',
    acknowledgedBy: 'P. Charuchinda',
    acknowledgedAt: '29/05/2024 16:38',
    imageUrl: 'https://images.pexels.com/photos/5691663/pexels-photo-5691663.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/5691664/pexels-photo-5691664.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '9',
    productionLine: 3,
    station: 'Bundle',
    productCode: '13W10C2MB',
    bundleNumber: '461182',
    jobOrderNumber: '3E3G256010',
    rollWidth: 340,
    timestamp: '29/05/2024 15:12',
    status: 'Defect: ด้านล่าง',
    state: 'rejected',
    acknowledgedBy: 'P. Charuchinda',
    acknowledgedAt: '29/05/2024 15:15',
    reviewedBy: 'P. Charuchinda',
    reviewedAt: '29/05/2024 15:20',
    rejectionReason: 'ยังคงเห็น Defect อยู่',
    comments: 'Bottom defect still not properly addressed',
    imageUrl: 'https://images.pexels.com/photos/5691665/pexels-photo-5691665.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/5691666/pexels-photo-5691666.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  // Line 3 Bundle - Normal items
  {
    id: '10',
    productionLine: 3,
    station: 'Bundle',
    productCode: '13W10C2MB',
    bundleNumber: '462263',
    jobOrderNumber: '3D3G256046',
    rollWidth: 193,
    timestamp: '29/05/2024 17:01',
    status: 'Scrap',
    state: 'pending',
    imageUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108105/pexels-photo-1108105.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '11',
    productionLine: 3,
    station: 'Bundle',
    productCode: '13W1AF2MB',
    bundleNumber: '462264',
    jobOrderNumber: '3E3G256011',
    rollWidth: 330,
    timestamp: '29/05/2024 17:05',
    status: 'Normal',
    state: 'approved',
    imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108106/pexels-photo-1108106.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '12',
    productionLine: 3,
    station: 'Bundle',
    productCode: '13W10C2MB',
    bundleNumber: '462265',
    jobOrderNumber: '3D3G256047',
    rollWidth: 270,
    timestamp: '29/05/2024 17:10',
    status: 'Normal',
    state: 'approved',
    imageUrl: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108107/pexels-photo-1108107.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  // Line 4 Roll - Defects
  {
    id: '13',
    productionLine: 4,
    station: 'Roll',
    productCode: '14W1AF2MB',
    rollNumber: '550413',
    jobOrderNumber: '4E3G256012',
    rollWidth: 330,
    timestamp: '29/05/2024 16:45',
    status: 'Defect: บาร์โค้ด/คิวอาร์โค้ด',
    state: 'pending',
    imageUrl: 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/5691667/pexels-photo-5691667.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '14',
    productionLine: 4,
    station: 'Roll',
    productCode: '14W10C2MB',
    rollNumber: '551070',
    jobOrderNumber: '4D3G256048',
    rollWidth: 270,
    timestamp: '29/05/2024 16:30',
    status: 'Defect: ฉลาก',
    state: 'acknowledged',
    acknowledgedBy: 'P. Charuchinda',
    acknowledgedAt: '29/05/2024 16:32',
    imageUrl: 'https://images.pexels.com/photos/5691660/pexels-photo-5691660.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/5691668/pexels-photo-5691668.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  // Line 4 Roll - Normal items
  {
    id: '15',
    productionLine: 4,
    station: 'Roll',
    productCode: '14W10C2MB',
    rollNumber: '562263',
    jobOrderNumber: '4E3G256013',
    rollWidth: 193,
    timestamp: '29/05/2024 17:00',
    status: 'Normal',
    state: 'approved',
    imageUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108108/pexels-photo-1108108.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '16',
    productionLine: 4,
    station: 'Roll',
    productCode: '14W1AF2MB',
    rollNumber: '562264',
    jobOrderNumber: '4D3G256049',
    rollWidth: 330,
    timestamp: '29/05/2024 17:03',
    status: 'Normal',
    state: 'approved',
    imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108109/pexels-photo-1108109.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '17',
    productionLine: 4,
    station: 'Roll',
    productCode: '14W10C2MB',
    rollNumber: '562265',
    jobOrderNumber: '4E3G256014',
    rollWidth: 270,
    timestamp: '29/05/2024 17:08',
    status: 'Normal',
    state: 'approved',
    imageUrl: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108110/pexels-photo-1108110.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  // Line 4 Bundle - Defects
  {
    id: '18',
    productionLine: 4,
    station: 'Bundle',
    productCode: '14W1AF2MB',
    bundleNumber: '550413',
    jobOrderNumber: '4E3G256012',
    rollWidth: 330,
    timestamp: '29/05/2024 16:45',
    status: 'Defect: บาร์โค้ด, ด้านบน',
    state: 'acknowledged',
    acknowledgedBy: 'P. Charuchinda',
    acknowledgedAt: '29/05/2024 16:47',
    imageUrl: 'https://images.pexels.com/photos/5691661/pexels-photo-5691661.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/5691669/pexels-photo-5691669.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '19',
    productionLine: 4,
    station: 'Bundle',
    productCode: '14W10C2MB',
    bundleNumber: '561182',
    jobOrderNumber: '4D3G256048',
    rollWidth: 340,
    timestamp: '29/05/2024 15:10',
    status: 'Scrap',
    state: 'approved',
    acknowledgedBy: 'P. Charuchinda',
    acknowledgedAt: '29/05/2024 15:12',
    reviewedBy: 'P. Charuchinda',
    reviewedAt: '29/05/2024 15:25',
    imageUrl: 'https://images.pexels.com/photos/5691662/pexels-photo-5691662.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/5691670/pexels-photo-5691670.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  // Line 4 Bundle - Normal items
  {
    id: '20',
    productionLine: 4,
    station: 'Bundle',
    productCode: '14W10C2MB',
    bundleNumber: '562263',
    jobOrderNumber: '4E3G256013',
    rollWidth: 193,
    timestamp: '29/05/2024 17:00',
    status: 'Normal',
    state: 'approved',
    imageUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108111/pexels-photo-1108111.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '21',
    productionLine: 4,
    station: 'Bundle',
    productCode: '14W1AF2MB',
    bundleNumber: '562264',
    jobOrderNumber: '4D3G256049',
    rollWidth: 330,
    timestamp: '29/05/2024 17:03',
    status: 'Normal',
    state: 'approved',
    imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108112/pexels-photo-1108112.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '22',
    productionLine: 4,
    station: 'Bundle',
    productCode: '14W10C2MB',
    bundleNumber: '562265',
    jobOrderNumber: '4E3G256014',
    rollWidth: 270,
    timestamp: '29/05/2024 17:08',
    status: 'Normal',
    state: 'approved',
    imageUrl: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108113/pexels-photo-1108113.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  // QC Passed examples
  {
    id: '23',
    productionLine: 3,
    station: 'Roll',
    productCode: '13W1AF2MB',
    rollNumber: '470001',
    jobOrderNumber: 'JO-2024-101',
    rollWidth: 330,
    timestamp: '29/05/2024 18:15',
    status: 'QC Passed',
    state: 'approved',
    acknowledgedBy: 'P. Charuchinda',
    acknowledgedAt: '29/05/2024 18:10',
    reviewedBy: 'P. Charuchinda',
    reviewedAt: '29/05/2024 18:15',
    comments: 'Quality control inspection completed successfully',
    imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108103/pexels-photo-1108103.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '24',
    productionLine: 4,
    station: 'Bundle',
    productCode: '14W1AF2MB',
    bundleNumber: 'BDL-570001',
    jobOrderNumber: 'JO-2024-103',
    rollWidth: 330,
    timestamp: '29/05/2024 18:40',
    status: 'QC Passed',
    state: 'approved',
    acknowledgedBy: 'P. Charuchinda',
    acknowledgedAt: '29/05/2024 18:38',
    reviewedBy: 'P. Charuchinda',
    reviewedAt: '29/05/2024 18:40',
    comments: 'QC approval granted - ready for shipment preparation',
    imageUrl: 'https://images.pexels.com/photos/5691661/pexels-photo-5691661.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/5691669/pexels-photo-5691669.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  // QC Passed Roll examples
  {
    id: '25',
    productionLine: 3,
    station: 'Roll',
    productCode: '13W10C2MB',
    rollNumber: '470002',
    jobOrderNumber: 'JO-2024-102',
    rollWidth: 270,
    timestamp: '29/05/2024 18:20',
    status: 'QC Passed',
    state: 'approved',
    acknowledgedBy: 'P. Charuchinda',
    acknowledgedAt: '29/05/2024 18:18',
    reviewedBy: 'P. Charuchinda',
    reviewedAt: '29/05/2024 18:20',
    comments: 'All quality parameters within acceptable limits',
    imageUrl: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/1108104/pexels-photo-1108104.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '26',
    productionLine: 4,
    station: 'Roll',
    productCode: '14W1AF2MB',
    rollNumber: '570001',
    jobOrderNumber: 'JO-2024-103',
    rollWidth: 330,
    timestamp: '29/05/2024 18:25',
    status: 'QC Passed',
    state: 'approved',
    acknowledgedBy: 'P. Charuchinda',
    acknowledgedAt: '29/05/2024 18:22',
    reviewedBy: 'P. Charuchinda',
    reviewedAt: '29/05/2024 18:25',
    comments: 'QC inspection passed - ready for next stage',
    imageUrl: 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=400',
    repairImageUrl: 'https://images.pexels.com/photos/5691667/pexels-photo-5691667.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const useDefects = () => {
  const [defects, setDefects] = useState<Defect[]>(mockDefects);

  const acknowledgeDefect = (defectId: string, acknowledgedBy: string, repairImageUrl?: string) => {
    setDefects(prev => prev.map(defect => 
      defect.id === defectId 
        ? { 
            ...defect, 
            state: 'acknowledged', 
            acknowledgedBy,
            acknowledgedAt: new Date().toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).replace(',', ''),
            repairImageUrl: repairImageUrl || `https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400`
          }
        : defect
    ));
  };

  const reviewDefect = (defectId: string, approved: boolean, reviewedBy: string, rejectionReason?: string, comments?: string) => {
    setDefects(prev => prev.map(defect => 
      defect.id === defectId 
        ? { 
            ...defect, 
            state: approved ? 'approved' : 'rejected',
            reviewedBy,
            reviewedAt: new Date().toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).replace(',', ''),
            rejectionReason: approved ? undefined : rejectionReason,
            comments: approved ? comments : undefined
          }
        : defect
    ));
  };

  const getDefectsForLine = (lineId: number, station: 'Roll' | 'Bundle') => {
    return defects.filter(defect => 
      defect.productionLine === lineId && defect.station === station
    );
  };

  const getRemainingDefects = (lineId: number, station: 'Roll' | 'Bundle') => {
    return getDefectsForLine(lineId, station).filter(defect => 
      (defect.status.includes('Defect') || defect.status.includes('Scrap (No Label)')) && (defect.state === 'pending' || defect.state === 'rejected')
    ).length;
  };

  return {
    defects,
    acknowledgeDefect,
    reviewDefect,
    getDefectsForLine,
    getRemainingDefects
  };
};