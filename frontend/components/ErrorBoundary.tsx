'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a user-friendly error (should be shown as message, not boundary)
    const errorMessage = error?.message || '';
    const isUserFriendlyError = 
      errorMessage.includes('Unable to process') ||
      errorMessage.includes('Please try again') ||
      errorMessage.includes('Insufficient balance') ||
      errorMessage.includes('Unable to connect');

    // User-friendly errors should be handled by try/catch and shown as messages
    // Only show error boundary for unexpected errors (actual bugs)
    if (isUserFriendlyError) {
      // Reset state - error will be caught by try/catch and shown as message.error()
      return { hasError: false, error: null };
    }

    // Unexpected error - show error boundary
    // In development, Next.js overlay will also show (good for debugging)
    // In production, this error boundary will show
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Only show error UI for actual bugs, not user-friendly errors
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle="An unexpected error occurred. Please refresh the page and try again."
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

