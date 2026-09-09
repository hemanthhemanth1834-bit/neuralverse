import { AlertTriangle } from 'lucide-react';

export default function WebGLFallback({ label = '3D scene' }: { label?: string }) {
  return (
    <div className="glass relative z-10 mx-auto flex max-w-xl flex-col items-center rounded-2xl p-8 text-center" role="status">
      <AlertTriangle className="h-4 w-4 text-amber-300" aria-hidden="true" />
      <p className="mono-font mt-3 text-[11px] tracking-[0.35em] text-amber-200">WEBGL UNAVAILABLE</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        {label} needs WebGL, which this browser or device has disabled. All information below is still available as text and images.
      </p>
    </div>
  );
}
