import type { ReactNode } from 'react';
import { API_STATUS, type ApiStatus } from '@/stores/constants/apiStatus';
import { StatusOuter, Spinner, StatusMessage, ErrorMessage } from './styledComponents';

export interface LoadingWrapperProps {
  status: ApiStatus;
  error?: string | null;
  children: ReactNode;
}

export const LoadingWrapper = ({ status, error, children }: LoadingWrapperProps) => {
  if (status === API_STATUS.IDLE || status === API_STATUS.FETCHING) {
    return (
      <StatusOuter>
        <Spinner />
        <StatusMessage>Loading…</StatusMessage>
      </StatusOuter>
    );
  }

  if (status === API_STATUS.ERROR) {
    return (
      <StatusOuter>
        <ErrorMessage>{error ?? 'Something went wrong while loading this data.'}</ErrorMessage>
      </StatusOuter>
    );
  }

  return <>{children}</>;
};
