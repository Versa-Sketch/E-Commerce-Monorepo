import type { ReactNode } from 'react';

export type Column<T = Record<string, unknown>> = {
  id?: string;
  key: string;
  header: string;
  width?: number;
  sortable?: boolean;
  render?: (value: unknown, row: T) => ReactNode;
};
