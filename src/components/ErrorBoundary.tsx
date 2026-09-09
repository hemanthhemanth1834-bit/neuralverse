import { Component, type ReactNode } from 'react';

export default class ErrorBoundary extends Component<{ children: ReactNode; label?: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() {}
  render() {
    if (this.state.failed) {
      return (
        <div className="glass relative z-10 mx-auto max-w-xl rounded-2xl p-8 text-center">
          <p className="mono-font text-[11px] tracking-[0.35em] text-amber-300">VISUAL MODULE OFFLINE</p>
          <p className="mt-3 text-sm text-slate-400">
            {this.props.label || '3D scene'} could not start on this device. The story continues below — content remains fully accessible.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
