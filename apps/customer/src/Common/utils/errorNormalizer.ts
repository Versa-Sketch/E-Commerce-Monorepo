export function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  return 'An unexpected error occurred.';
}
export function extractErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: unknown; status?: number } };
    const data = axiosError.response?.data;
    if (data && typeof data === 'object' && 'message' in data) {
      return (data as { message: string }).message;
    }
    if (typeof data === 'string' && data.length > 0) return data;
    const status = axiosError.response?.status;
    if (status === 404) return 'User not found.';
    if (status === 403) return 'Account not verified.';
    if (status === 409) return 'An account with this number already exists.';
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred. Please try again.';
}
