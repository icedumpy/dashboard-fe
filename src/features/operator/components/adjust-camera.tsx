'use client';

import { useGetCameraStreamUrl } from '@/shared/hooks/camera/use-get-camera-stream-url';
import { useGetCameras } from '@/shared/hooks/camera/use-get-cameras';
import { usePostFocusCameraStatus } from '@/shared/hooks/camera/use-post-focus-camera';
import { ICameraResponse } from '@/shared/services/camera-service';
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  Focus,
  Loader2,
  TriangleIcon,
} from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { HlsCameraPlayer } from './camera-player';
type FocusState = 'idle' | 'focusing' | 'success' | 'failed';

function AdjustCamera() {
  const { lineId = 0 } = useParams();
  const [selectedCameraId, setSelectedCameraId] = useState<number>();
  const [focusState, setFocusState] = useState<FocusState>('idle');

  const { data: cameraApis = [] } = useGetCameras({ line_id: Number(lineId) });

  const cameras = useMemo(() => {
    return [
      {
        camera_name: 'All',
        camera_url: '',
      } as ICameraResponse,
    ].concat(...cameraApis);
  }, [cameraApis]);

  const focusCamera = usePostFocusCameraStatus();

  const selectedCamera = useMemo(() => {
    return cameras.find(cam => cam.id === selectedCameraId);
  }, [selectedCameraId, cameras]);

  const {
    data: cameraUrlData,
    isLoading,
    isError,
  } = useGetCameraStreamUrl(selectedCamera?.id);

  useEffect(() => {
    if (isError) {
      toast.error(`เกิดปัญหาขณะโหลดกล้อง`);
    }
  }, [isError]);

  const handleFocusClick = async () => {
    if (!selectedCameraId || focusState === 'focusing') return;

    setFocusState('focusing');
    try {
      focusCamera.mutate(undefined, {
        onSuccess: () => {
          setFocusState('success');
        },
        onError: () => {
          setFocusState('failed');
        },
        onSettled: () => {
          setTimeout(() => setFocusState('idle'), 2500);
        },
      });
      setFocusState('success');
    } catch (error) {
      setFocusState('failed');
      return;
    } finally {
      setTimeout(() => setFocusState('idle'), 2500);
    }
  };

  const isButtonDisabled =
    !selectedCameraId || isLoading || focusState === 'focusing' || isError;

  return (
    <div className="min-h-screen w-full bg-[#0e192b] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl rounded-3xl bg-[#1f2b3b] border border-slate-800  px-8 py-8 text-slate-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            หน้าปรับ Focus กล้องอ่านฉลาก
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            ตั้งค่าความคมชัดสำหรับระบบตรวจจับ
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <Camera className="h-4 w-4 " />
            <span>เลือกกล้อง:</span>
          </div>

          <div className="mt-2 relative">
            <select
              className="block w-full appearance-none rounded-xl border border-slate-700 bg-[#334156] px-4 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              value={selectedCameraId}
              onChange={e => setSelectedCameraId(Number(e.target.value))}
            >
              {cameras.map(cam => (
                <option
                  key={`${cam.camera_url}-${cam.camera_name}`}
                  value={cam.id}
                >
                  {cam.camera_name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="relative rounded-2xl border border-slate-800 bg-black/90 overflow-hidden">
          {cameraUrlData?.url ? (
            <HlsCameraPlayer hlsUrl={cameraUrlData.url} isError={isError} />
          ) : (
            <div className="relative flex h-64 items-center justify-center text-xs font-medium">
              <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-[11px] tracking-wide text-slate-400">
                {isError ? 'เกิดปัญหาขณะโหลดกล้อง' : `ไม่มีสัญญาน`}
              </span>
            </div>
          )}

          {/* <div className="pointer-events-none absolute inset-5">
            <div className="absolute inset-0 border border-slate-800/80 rounded-xl" />
            <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-800/70" />
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-800/70" />
          </div> */}
        </div>

        {/* Focus button with 3 states */}
        <button
          type="button"
          onClick={handleFocusClick}
          disabled={isButtonDisabled}
          className={[
            'mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
            isButtonDisabled && focusState !== 'focusing'
              ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-200 cursor-not-allowed'
              : focusState === 'success'
              ? 'bg-emerald-500 hover:bg-emerald-500/90 text-white'
              : focusState === 'failed'
              ? 'bg-red-500 text-white'
              : 'bg-gradient-to-r from-sky-600 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white shadow-lg shadow-sky-500/25',
          ].join(' ')}
        >
          {(focusState === 'focusing' || isLoading) && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {focusState === 'success' && <CheckCircle2 className="h-4 w-4" />}
          {focusState === 'idle' && !isLoading && <Focus className="h-4 w-4" />}
          {focusState === 'failed' && <TriangleIcon className="h-4 w-4" />}

          <span>
            {focusState === 'idle' && 'ปรับโฟกัส'}
            {focusState === 'focusing' && 'กำลังปรับโฟกัส...'}
            {focusState === 'success' && 'ปรับโฟกัสเสร็จสิ้น'}
            {focusState === 'failed' && 'เกิดปัญหาขึ้น'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default memo(AdjustCamera);
