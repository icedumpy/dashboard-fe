// src/components/HlsCameraPlayer.tsx
import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

type HlsCameraPlayerProps = {
  hlsUrl?: string | null;
  isError?: boolean;
  className?: string;
};

export function HlsCameraPlayer({
  hlsUrl,
  isError,
  className,
}: HlsCameraPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    // clean up any previous instance before re-init
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (!hlsUrl || !video) return;

    console.log('[HLS] init player with url:', hlsUrl);

    // Safari / iOS: native HLS
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      video
        .play()
        .catch(err => console.warn('[HLS] native autoplay blocked', err));
      return;
    }

    // Other browsers: use hls.js
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
      });
      hlsRef.current = hls;

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('[HLS] manifest parsed, starting playback');
        video
          .play()
          .catch(err =>
            console.warn('[HLS] autoplay blocked after manifest parsed', err),
          );
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('[HLS] error', event, data);
      });
    } else {
      console.error('[HLS] not supported in this browser');
    }

    return () => {
      if (hlsRef.current) {
        console.log('[HLS] destroy instance');
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [hlsUrl]);

  if (isError || !hlsUrl) {
    return (
      <div className="relative flex min-h-[500px] w-full items-center justify-center rounded-2xl border border-slate-800 bg-black text-xs text-slate-500">
        <span>ไม่มีสัญญาน</span>
      </div>
    );
  }

  return (
    <div
      className={
        className ??
        'relative h-full w-full sm:min-h-[500px] overflow-hidden rounded-2xl border border-slate-800 bg-black'
      }
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        controls={true}
        className="absolute inset-0 block h-full w-full object-contain"
      />

      {/* <div className="pointer-events-none absolute inset-5">
        <div className="absolute inset-0 rounded-xl border border-slate-800/80" />
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-800/70" />
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-800/70" />
      </div> */}
    </div>
  );
}
