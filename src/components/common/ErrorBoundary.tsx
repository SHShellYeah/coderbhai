import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ByteSized ErrorBoundary caught:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('bytesized_user_v1');
    localStorage.removeItem('coderbhai_user_v1');
    localStorage.removeItem('codelingo_user_v1');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#131F24] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#1A282F] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
              Oops, something tripped Byte!
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Don't worry, your progress is backed up. Click below to reload your learning session.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-3d btn-3d-green w-full py-3.5 rounded-2xl text-base font-black uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reload Application
            </button>
            <button
              type="button"
              onClick={this.handleReset}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 underline"
            >
              Reset saved state & start fresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
