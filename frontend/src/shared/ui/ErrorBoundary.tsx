import React, { type ReactNode, Component } from 'react';
import { logErrorToService } from '../utils/errorLogger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;

  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Error caught by ErrorBoundary:', error, errorInfo);
    logErrorToService(error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-[400px] flex-col items-center justify-center bg-[#09090b] text-white text-center p-8 rounded-2xl border border-zinc-800">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
               <span className="text-red-500 text-2xl font-bold">!</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-zinc-400 mb-8 max-w-md">
              {this.state.error?.message || 'An unexpected error occurred. Please try again later.'}
            </p>
            <button
              onClick={this.handleReset}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all duration-200"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
