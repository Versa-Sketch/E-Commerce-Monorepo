import { useMemo, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { theme } from '@/UI/theme';
import type { Column } from './types';
import {
  TableOuter, StyledTable, HeaderRow, HeaderCell, HeaderLabel,
  BodyRow, BodyCell, EmptyCell,
} from './styledComponents';

export interface TableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export const Table = <T extends Record<string, unknown>>({
  columns, data, emptyMessage,
}: TableProps<T>) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const cmp = av! < bv! ? -1 : 1;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  return (
    <TableOuter>
      <StyledTable>
        <thead>
          <HeaderRow>
            {columns.map((col) => (
              <HeaderCell
                key={col.id ?? col.key}
                $sortable={col.sortable}
                $width={col.width}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <HeaderLabel>
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    sortDir === 'asc'
                      ? <ChevronUp size={12} color={theme.colors.primary} />
                      : <ChevronDown size={12} color={theme.colors.primary} />
                  )}
                </HeaderLabel>
              </HeaderCell>
            ))}
          </HeaderRow>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <EmptyCell colSpan={columns.length}>{emptyMessage ?? 'No records found.'}</EmptyCell>
            </tr>
          ) : sorted.map((row, i) => (
            <BodyRow key={i} $isLast={i === sorted.length - 1}>
              {columns.map((col) => (
                <BodyCell key={col.id ?? col.key}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </BodyCell>
              ))}
            </BodyRow>
          ))}
        </tbody>
      </StyledTable>
    </TableOuter>
  );
};
