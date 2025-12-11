'use client';

import {
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Focus,
  Loader2,
} from 'lucide-react';
import { memo, useMemo, useRef, useState } from 'react';

type FocusState = 'idle' | 'focusing' | 'success';

function AdjustCamera() {
  const [selectedCamera, setSelectedCamera] = useState('');
  const [focusState, setFocusState] = useState<FocusState>('idle');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const cameras = useMemo(
    () => [
      { value: '', label: '-- เลือกกล้อง --' },
      { value: 4, label: 'Roll Station' },
      { value: 3, label: 'Bundle Station' },
    ],
    [],
  );

  const streamUrl = useMemo(() => {
    if (!selectedCamera) return;

    const username = '';
    const password = '';
    const baseURL = ``;
    const channel = selectedCamera;
    const pathTemplate = `/cam/realmonitor?channel=${channel}&subtype=0`;
    const rtspLink = `rtsp://${username}:${password}@$${baseURL}${pathTemplate}`;
    return rtspLink;
  }, [selectedCamera]);

  const handleFocusClick = () => {
    if (!selectedCamera || focusState === 'focusing') return;

    setFocusState('focusing');

    setTimeout(() => {
      setFocusState('success');

      setTimeout(() => setFocusState('idle'), 2500);
    }, 2000);
  };

  const isButtonDisabled = !selectedCamera || focusState === 'focusing';

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-950/80 border border-slate-800  px-8 py-8 text-slate-100">
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
              className="block w-full appearance-none rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              value={selectedCamera}
              onChange={e => setSelectedCamera(e.target.value)}
            >
              {cameras.map(cam => (
                <option key={cam.value} value={cam.value}>
                  {cam.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="relative rounded-2xl border border-slate-800 bg-black/90 overflow-hidden">
          {streamUrl ? (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-contain"
              src={streamUrl}
              autoPlay
              muted
              playsInline
            />
          ) : (
            <div className="absolute inset-0 bg-black" />
          )}

          <div className="pointer-events-none absolute inset-5">
            <div className="absolute inset-0 border border-slate-800/80 rounded-xl" />
            <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-800/70" />
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-800/70" />
          </div>

          <div className="relative flex h-64 items-center justify-center text-xs font-medium">
            {focusState === 'idle' && (
              <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-[11px] tracking-wide text-slate-400">
                No Signal
              </span>
            )}

            {focusState === 'focusing' && (
              <div className="flex flex-col items-center gap-3 text-[11px] text-sky-300">
                <div className="h-10 w-10 rounded-full border-2 border-sky-400/60 border-l-transparent animate-spin" />
                <span>กำลังปรับโฟกัส...</span>
              </div>
            )}

            {focusState === 'success' && (
              <div className="flex flex-col items-center gap-3 text-[11px] text-emerald-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-400 bg-emerald-500/10">
                  <Check className="h-6 w-6 text-emerald-400" />
                </div>
                <span>Focus Locked</span>
              </div>
            )}
          </div>
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
              : 'bg-gradient-to-r from-sky-600 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white shadow-lg shadow-sky-500/25',
          ].join(' ')}
        >
          {focusState === 'focusing' && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {focusState === 'success' && <CheckCircle2 className="h-4 w-4" />}
          {focusState === 'idle' && <Focus className="h-4 w-4" />}

          <span>
            {focusState === 'idle' && 'ปรับโฟกัส'}
            {focusState === 'focusing' && 'กำลังปรับโฟกัส...'}
            {focusState === 'success' && 'ปรับโฟกัสเสร็จสิ้น'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default memo(AdjustCamera);
