import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ApiStatus, API_FETCHING, API_ERROR } from '../../../../Common/Constants';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
interface LoadingWrapperProps {
  apiStatus?: ApiStatus;
  isLoading?: boolean;
  error?: Error | string | null;
  retry?: () => void | Promise<void>;
  renderSuccessUI?: () => React.ReactNode;
  renderLoadingUI?: () => React.ReactNode;
  children?: React.ReactNode;
  loadingText?: string;
  errorText?: string;
  style?: ViewStyle;
}
export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  apiStatus,
  isLoading,
  error,
  retry,
  renderSuccessUI,
  renderLoadingUI,
  children,
  loadingText,
  errorText,
  style,
}) => {
  const showLoading = apiStatus === API_FETCHING || isLoading === true;
  const showError   = !showLoading && (apiStatus === API_ERROR || (error != null && error !== ''));
  const errorMessage =
    errorText ??
    (typeof error === 'string' ? error : error instanceof Error ? error.message : undefined);
  if (showLoading) {
    return (
      <View style={[styles.fill, style]}>
        {renderLoadingUI ? renderLoadingUI() : <LoadingState text={loadingText} />}
      </View>
    );
  }
  if (showError) {
    return (
      <View style={[styles.fill, style]}>
        <ErrorState message={errorMessage} retry={retry} />
      </View>
    );
  }
  return (
    <View style={[styles.fill, style]}>
      {renderSuccessUI ? renderSuccessUI() : children}
    </View>
  );
};
export const AsyncSection: React.FC<
  Omit<LoadingWrapperProps, 'apiStatus'> & { status?: ApiStatus }
> = ({ status, ...rest }) => (
  <LoadingWrapper {...rest} apiStatus={status} />
);
const styles = StyleSheet.create({
  fill: { flex: 1 },
});
export default LoadingWrapper;
