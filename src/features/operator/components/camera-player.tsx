// src/components/HlsCameraPlayer.tsx
import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

type HlsCameraPlayerProps = {
  hlsUrl: string;
  isError?: boolean;
  className?: string;
};

export function HlsCameraPlayer({
  hlsUrl,
  isError,
  className,
}: HlsCameraPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!hlsUrl || !videoRef.current) return;

    const video = videoRef.current;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      return;
    }

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error', event, data);
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [hlsUrl]);

  if (isError || !hlsUrl) {
    return (
      <div className="relative flex h-64 w-full items-center justify-center rounded-2xl border border-slate-800 bg-black text-xs text-slate-500">
        <span>ไม่มีสัญญาน</span>
      </div>
    );
  }

  return (
    <div
      className={
        className ??
        'relative h-64 w-full overflow-hidden rounded-2xl border border-slate-800 bg-black'
      }
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        controls={false}
        className="h-full w-full object-contain"
      />

      <div className="pointer-events-none absolute inset-5">
        <div className="absolute inset-0 rounded-xl border border-slate-800/80" />
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-800/70" />
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-800/70" />
      </div>
    </div>
  );
}
