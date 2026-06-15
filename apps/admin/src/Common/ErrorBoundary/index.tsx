import { Component, type ErrorInfo, type ReactNode } from 'react';
import { FallbackOuter, FallbackTitle, FallbackMessage } from './styledComponents';

export interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled error in route:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <FallbackOuter>
          <FallbackTitle>Something went wrong</FallbackTitle>
          <FallbackMessage>This section couldn&apos;t be displayed. Try refreshing the page.</FallbackMessage>
        </FallbackOuter>
      );
    }

    return this.props.children;
  }
}
