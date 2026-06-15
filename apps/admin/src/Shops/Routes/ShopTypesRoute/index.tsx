import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  Plus, Tags, Pencil, Trash2, CheckCircle, XCircle, FolderOpen, Search, Check, X,
  Copy, Archive, MoreVertical, ChevronLeft, ChevronRight, Filter, Download,
  Command, HelpCircle, ShieldAlert
} from 'lucide-react';
import { ErrorBoundary } from '../../../Common/ErrorBoundary';
import { useShopTypesStore } from '../../Providers/ShopTypesProvider';
import { CreateShopTypeModal } from '../../Components/CreateShopTypeModal';
import { EditShopTypeModal } from '../../Components/EditShopTypeModal';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { CategoriesApiService } from '../../../Categories/Services/CategoriesService/index.api';
import { ShopTypeCategoriesApiService } from '../../Services/ShopTypeCategoriesService/index.api';
import { AppClient } from '../../../stores/services/AppClient';
import type { ShopTypeDomain } from '../../types/domain';

import {
  PageOuter, HeaderSection, HeaderLeft, MainTitle, Subtitle, HeaderRight,
  AnalyticsGrid, AnalyticsCard, CardTop, CardTitle, CardIconWrapper, CardValue, CardDesc,
  TableOuterCard, FiltersRow, FiltersLeft, SearchWrapper, SearchInput, TabsList, TabItem,
  FiltersRight, BulkActionsContainer, SelectedCount, BulkButtons, TableWrapper, PremiumTable,
  THead, Th, TBody, Tr, Td, CheckboxInput, StatusIndicator, StatusDot, DropdownWrapper,
  DropdownTrigger, DropdownMenu, DropdownItem, InlineWrapper, InlineInput, PaginationRow,
  PaginationInfo, PaginationActions, MobileCardContainer, MobileCard, MobileCardHeader,
  MobileCardBody, MobileLabel, MobileValue, FloatingActionButton, EmptyStateContainer,
  EmptyIcon, EmptyTitle, EmptySubtitle, SkeletonCard, SkeletonLine, SkeletonTableRow,
  CmdPaletteOverlay, CmdPaletteModal, CmdPaletteSearch, CmdInput, CmdBadge, CmdList,
  CmdGroupTitle, CmdItem, CmdItemLeft, ToastWrapper, ToastAlert, ToastText, ToastClose,
  ConfirmBox, ConfirmHeading, ConfirmText, DangerWarning
} from './styledComponents';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ShopTypesRouteComponent = () => {
  const store = useShopTypesStore();
  const navigate = useNavigate();

  // Modals state
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ShopTypeDomain | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ShopTypeDomain | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Sorting State
  const [sortField, setSortField] = useState<'name' | 'slug' | 'categoriesCount'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Row Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Inline Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Dropdown Active row
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Command Palette
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [commandSelectedIndex, setCommandSelectedIndex] = useState(0);

  // Category counts & Global metrics
  const [totalCategoriesCount, setTotalCategoriesCount] = useState<number>(0);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loadingCounts, setLoadingCounts] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  // Add Toast helper
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch shop types on load
  useEffect(() => {
    store.fetchShopTypes();
  }, [store]);

  // Fetch categories count for summary and individual shop types
  useEffect(() => {
    const fetchCounts = async () => {
      setLoadingCounts(true);
      try {
        const client = new AppClient();
        const categoriesService = new CategoriesApiService(client);
        const shopTypeCatService = new ShopTypeCategoriesApiService(client);

        // Fetch total categories
        const allCats = await categoriesService.getCategories();
        setTotalCategoriesCount(allCats.length);

        // Fetch counts for all shop types in parallel
        const counts: Record<string, number> = {};
        await Promise.all(
          store.shopTypes.map(async st => {
            try {
              const cats = await shopTypeCatService.getCategories(st.id);
              counts[st.id] = cats.length;
            } catch {
              counts[st.id] = 0;
            }
          })
        );
        setCategoryCounts(counts);
      } catch (err) {
        console.error('Error fetching analytics counts', err);
      } finally {
        setLoadingCounts(false);
      }
    };

    if (store.shopTypes.length > 0) {
      fetchCounts();
    }
  }, [store.shopTypes]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
        setCommandSearch('');
        setCommandSelectedIndex(0);
      } else if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setEditingId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus command input when palette opens
  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => {
        commandInputRef.current?.focus();
      }, 50);
    }
  }, [commandPaletteOpen]);

  // Filtered Shop Types
  const filteredShopTypes = useMemo(() => {
    return store.shopTypes.filter(st => {
      const matchesSearch =
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.slug.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter =
        activeFilterTab === 'all' ||
        (activeFilterTab === 'active' && st.isActive) ||
        (activeFilterTab === 'inactive' && !st.isActive);

      return matchesSearch && matchesFilter;
    });
  }, [store.shopTypes, searchQuery, activeFilterTab]);

  // Sorted Shop Types
  const sortedShopTypes = useMemo(() => {
    return [...filteredShopTypes].sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      if (sortField === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortField === 'slug') {
        valA = a.slug.toLowerCase();
        valB = b.slug.toLowerCase();
      } else if (sortField === 'categoriesCount') {
        valA = categoryCounts[a.id] || 0;
        valB = categoryCounts[b.id] || 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredShopTypes, sortField, sortOrder, categoryCounts]);

  // Paginated Shop Types
  const paginatedShopTypes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedShopTypes.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedShopTypes, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedShopTypes.length / itemsPerPage) || 1;

  // Handle page resets when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilterTab, itemsPerPage]);

  // Checkbox selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const visibleIds = paginatedShopTypes.map(st => st.id);
      setSelectedIds(new Set(visibleIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Toggle active status (Archive/Activate)
  const handleToggleStatus = async (st: ShopTypeDomain) => {
    try {
      await store.updateShopType(st.id, { is_active: !st.isActive });
      addToast(
        `Shop type "${st.name}" is now ${!st.isActive ? 'Active' : 'Inactive'}`,
        'success'
      );
    } catch {
      addToast('Failed to update shop type status.', 'error');
    }
    setActiveMenuId(null);
  };

  // Duplicate Shop Type
  const handleDuplicate = async (st: ShopTypeDomain) => {
    try {
      await store.createShopTypes([{
        name: `${st.name} (Copy)`,
        description: `Duplicate of ${st.name}`
      }]);
      addToast(`Duplicated "${st.name}" successfully.`, 'success');
    } catch {
      addToast('Failed to duplicate shop type.', 'error');
    }
    setActiveMenuId(null);
  };

  // Delete Shop Type (after confirmation)
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await store.deleteShopType(deleteTarget.id);
      addToast(`Deleted "${deleteTarget.name}" successfully.`, 'success');
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(deleteTarget.id);
        return next;
      });
    } catch {
      addToast('Failed to delete shop type.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  // Inline editing save
  const handleInlineSave = async (id: string) => {
    if (!editingName.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await store.updateShopType(id, { name: editingName.trim() });
      addToast('Renamed shop type successfully.', 'success');
    } catch {
      addToast('Failed to update name.', 'error');
    } finally {
      setEditingId(null);
    }
  };

  // Bulk status updates
  const handleBulkStatusChange = async (targetActive: boolean) => {
    const idsToUpdate = Array.from(selectedIds);
    let successCount = 0;
    
    addToast(`Updating status of ${idsToUpdate.length} items...`, 'info');
    
    await Promise.all(
      idsToUpdate.map(async id => {
        try {
          await store.updateShopType(id, { is_active: targetActive });
          successCount++;
        } catch {
          // ignore individual failures for bulk
        }
      })
    );
    
    addToast(
      `Successfully set ${successCount} shop types to ${targetActive ? 'Active' : 'Inactive'}.`,
      'success'
    );
    setSelectedIds(new Set());
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    const idsToDelete = Array.from(selectedIds);
    let successCount = 0;

    if (!window.confirm(`Are you sure you want to delete ${idsToDelete.length} shop types?`)) {
      return;
    }

    addToast(`Deleting ${idsToDelete.length} items...`, 'info');

    await Promise.all(
      idsToDelete.map(async id => {
        try {
          await store.deleteShopType(id);
          successCount++;
        } catch {
          // ignore individual failures for bulk
        }
      })
    );

    addToast(`Successfully deleted ${successCount} shop types.`, 'success');
    setSelectedIds(new Set());
  };

  // Export selected to CSV
  const handleExportCSV = (targetIds?: Set<string>) => {
    const idsToExport = targetIds ? Array.from(targetIds) : store.shopTypes.map(st => st.id);
    const exportItems = store.shopTypes.filter(st => idsToExport.includes(st.id));

    if (exportItems.length === 0) {
      addToast('No items to export.', 'info');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,ID,Name,Slug,Status,Categories Count\n';
    exportItems.forEach(st => {
      const catCount = categoryCounts[st.id] || 0;
      csvContent += `"${st.id}","${st.name}","${st.slug}","${st.isActive ? 'Active' : 'Inactive'}",${catCount}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hyperadmin_shop_types_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`Exported ${exportItems.length} items to CSV.`, 'success');
  };

  // Command Palette Actions
  const commands = useMemo(() => {
    const list = [
      {
        id: 'cmd-create',
        title: 'Create Shop Type',
        subtitle: 'Add a new business type',
        icon: <Plus size={16} />,
        action: () => setCreateOpen(true)
      },
      {
        id: 'cmd-filter-active',
        title: 'Filter: Active Shop Types',
        subtitle: 'Show only active categories',
        icon: <CheckCircle size={16} />,
        action: () => setActiveFilterTab('active')
      },
      {
        id: 'cmd-filter-inactive',
        title: 'Filter: Inactive Shop Types',
        subtitle: 'Show archived categories',
        icon: <XCircle size={16} />,
        action: () => setActiveFilterTab('inactive')
      },
      {
        id: 'cmd-filter-all',
        title: 'Filter: All Shop Types',
        subtitle: 'Reset filter parameters',
        icon: <Tags size={16} />,
        action: () => setActiveFilterTab('all')
      },
      {
        id: 'cmd-export',
        title: 'Export all to CSV',
        subtitle: 'Download sheet data',
        icon: <Download size={16} />,
        action: () => handleExportCSV()
      },
      {
        id: 'cmd-clear-selection',
        title: 'Clear selection checkboxes',
        subtitle: 'Reset table selected markers',
        icon: <X size={16} />,
        action: () => setSelectedIds(new Set())
      },
    ];

    if (commandSearch) {
      return list.filter(c =>
        c.title.toLowerCase().includes(commandSearch.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(commandSearch.toLowerCase())
      );
    }
    return list;
  }, [commandSearch, selectedIds]);

  const handleCommandPaletteKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCommandSelectedIndex(prev => (prev + 1) % commands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCommandSelectedIndex(prev => (prev - 1 + commands.length) % commands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (commands[commandSelectedIndex]) {
        commands[commandSelectedIndex].action();
        setCommandPaletteOpen(false);
      }
    }
  };

  const isAllSelected = paginatedShopTypes.length > 0 && 
    paginatedShopTypes.every(st => selectedIds.has(st.id));

  const isSomeSelected = paginatedShopTypes.length > 0 && 
    paginatedShopTypes.some(st => selectedIds.has(st.id)) && !isAllSelected;

  return (
    <ErrorBoundary>
      <PageOuter>
        {/* Page Header */}
        <HeaderSection>
          <HeaderLeft>
            <MainTitle>Shop Types</MainTitle>
            <Subtitle>Manage and organize all store business categories across the platform.</Subtitle>
          </HeaderLeft>
          <HeaderRight>
            <Button
              variant="outline"
              size="md"
              icon={<Download size={15} />}
              onClick={() => handleExportCSV()}
            >
              Export All
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<Plus size={16} />}
              onClick={() => setCreateOpen(true)}
            >
              Create Shop Type
            </Button>
          </HeaderRight>
        </HeaderSection>

        {/* Analytics Summary Cards */}
        <AnalyticsGrid>
          {store.status === 'FETCHING' || loadingCounts ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonCard key={idx}>
                <SkeletonLine $width="40%" $height="14px" />
                <SkeletonLine $width="60%" $height="28px" />
                <SkeletonLine $width="80%" $height="12px" />
              </SkeletonCard>
            ))
          ) : (
            <>
              <AnalyticsCard $gradient="linear-gradient(90deg, #10B981, #059669)">
                <CardTop>
                  <CardTitle>Total Shop Types</CardTitle>
                  <CardIconWrapper $bg="rgba(16, 185, 129, 0.08)" $color="#10B981">
                    <Tags size={18} />
                  </CardIconWrapper>
                </CardTop>
                <CardValue>{store.shopTypes.length}</CardValue>
                <CardDesc>Standard business modes</CardDesc>
              </AnalyticsCard>

              <AnalyticsCard $gradient="linear-gradient(90deg, #3B82F6, #1D4ED8)">
                <CardTop>
                  <CardTitle>Active Types</CardTitle>
                  <CardIconWrapper $bg="rgba(59, 130, 246, 0.08)" $color="#3B82F6">
                    <CheckCircle size={18} />
                  </CardIconWrapper>
                </CardTop>
                <CardValue>{store.shopTypes.filter(s => s.isActive).length}</CardValue>
                <CardDesc>Live on the shopping app</CardDesc>
              </AnalyticsCard>

              <AnalyticsCard $gradient="linear-gradient(90deg, #EF4444, #B91C1C)">
                <CardTop>
                  <CardTitle>Inactive Types</CardTitle>
                  <CardIconWrapper $bg="rgba(239, 68, 68, 0.08)" $color="#EF4444">
                    <XCircle size={18} />
                  </CardIconWrapper>
                </CardTop>
                <CardValue>{store.shopTypes.filter(s => !s.isActive).length}</CardValue>
                <CardDesc>Archived or disabled categories</CardDesc>
              </AnalyticsCard>

              <AnalyticsCard $gradient="linear-gradient(90deg, #F59E0B, #D97706)">
                <CardTop>
                  <CardTitle>Total Categories</CardTitle>
                  <CardIconWrapper $bg="rgba(245, 158, 11, 0.08)" $color="#F59E0B">
                    <FolderOpen size={18} />
                  </CardIconWrapper>
                </CardTop>
                <CardValue>{totalCategoriesCount}</CardValue>
                <CardDesc>Sub-menus mapped in categories</CardDesc>
              </AnalyticsCard>
            </>
          )}
        </AnalyticsGrid>

        {/* Table & Filtering */}
        <TableOuterCard>
          {/* Smart filters row */}
          <FiltersRow>
            <FiltersLeft>
              <SearchWrapper>
                <Search size={15} color="#9CA3AF" />
                <SearchInput
                  placeholder="Quick search... (Press ⌘K for commands)"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </SearchWrapper>
              
              <TabsList>
                <TabItem $active={activeFilterTab === 'all'} onClick={() => setActiveFilterTab('all')}>
                  All
                </TabItem>
                <TabItem $active={activeFilterTab === 'active'} onClick={() => setActiveFilterTab('active')}>
                  Active
                </TabItem>
                <TabItem $active={activeFilterTab === 'inactive'} onClick={() => setActiveFilterTab('inactive')}>
                  Inactive
                </TabItem>
              </TabsList>
            </FiltersLeft>

            <FiltersRight>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <Filter size={13} color="#6B7280" />
                <span style={{ color: '#6B7280', fontWeight: 500 }}>Sort by:</span>
                <select
                  value={sortField}
                  onChange={e => setSortField(e.target.value as any)}
                  style={{
                    border: '1px solid rgba(229, 231, 235, 0.8)',
                    borderRadius: 8,
                    padding: '4px 8px',
                    fontSize: 12.5,
                    fontWeight: 600,
                    outline: 'none',
                    background: '#fff',
                    color: '#374151',
                    cursor: 'pointer'
                  }}
                >
                  <option value="name">Name</option>
                  <option value="slug">Slug</option>
                  <option value="categoriesCount">Categories Count</option>
                </select>
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  style={{
                    border: '1px solid rgba(229, 231, 235, 0.8)',
                    background: '#fff',
                    borderRadius: 8,
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600
                  }}
                >
                  {sortOrder.toUpperCase()}
                </button>
              </div>
            </FiltersRight>
          </FiltersRow>

          {/* Bulk actions banner */}
          {selectedIds.size > 0 && (
            <BulkActionsContainer>
              <SelectedCount>✓ {selectedIds.size} row(s) selected</SelectedCount>
              <BulkButtons>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange(true)}
                  icon={<CheckCircle size={13} />}
                >
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange(false)}
                  icon={<XCircle size={13} />}
                >
                  Deactivate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportCSV(selectedIds)}
                  icon={<Download size={13} />}
                >
                  Export CSV
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                  icon={<Trash2 size={13} />}
                >
                  Delete Selected
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds(new Set())}
                  icon={<X size={13} />}
                />
              </BulkButtons>
            </BulkActionsContainer>
          )}

          {/* Table Container */}
          <TableWrapper>
            <PremiumTable>
              <THead>
                <tr>
                  <Th $width={50}>
                    <CheckboxInput
                      type="checkbox"
                      checked={isAllSelected}
                      ref={el => {
                        if (el) {
                          el.indeterminate = isSomeSelected;
                        }
                      }}
                      onChange={handleSelectAll}
                    />
                  </Th>
                  <Th $sortable onClick={() => { setSortField('name'); setSortOrder(o => o === 'asc' ? 'desc' : 'asc'); }}>Shop Type</Th>
                  <Th $sortable onClick={() => { setSortField('slug'); setSortOrder(o => o === 'asc' ? 'desc' : 'asc'); }}>Slug</Th>
                  <Th $sortable onClick={() => { setSortField('categoriesCount'); setSortOrder(o => o === 'asc' ? 'desc' : 'asc'); }} style={{ textAlign: 'center' }}>Categories Count</Th>
                  <Th>Status</Th>
                  <Th $width={100} style={{ textAlign: 'right' }}>Actions</Th>
                </tr>
              </THead>
              <TBody>
                {store.status === 'FETCHING' ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <SkeletonTableRow key={idx}>
                      <Td><SkeletonLine $width="16px" $height="16px" /></Td>
                      <Td><SkeletonLine $width="40%" $height="16px" /></Td>
                      <Td><SkeletonLine $width="30%" $height="14px" /></Td>
                      <Td><SkeletonLine $width="20%" $height="14px" style={{ margin: '0 auto' }} /></Td>
                      <Td><SkeletonLine $width="60px" $height="20px" /></Td>
                      <Td style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <SkeletonLine $width="30px" $height="30px" />
                      </Td>
                    </SkeletonTableRow>
                  ))
                ) : paginatedShopTypes.length === 0 ? (
                  <tr>
                    <Td colSpan={6}>
                      <EmptyStateContainer>
                        <EmptyIcon><Tags size={24} /></EmptyIcon>
                        <EmptyTitle>No Shop Types Found</EmptyTitle>
                        <EmptySubtitle>Try adjusting your search query or filter tags to see matches.</EmptySubtitle>
                      </EmptyStateContainer>
                    </Td>
                  </tr>
                ) : (
                  paginatedShopTypes.map(st => {
                    const isSelected = selectedIds.has(st.id);
                    const isEditing = editingId === st.id;
                    const cCount = categoryCounts[st.id] ?? 0;

                    return (
                      <Tr key={st.id} $selected={isSelected}>
                        <Td>
                          <CheckboxInput
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(st.id)}
                          />
                        </Td>
                        <Td onDoubleClick={() => { setEditingId(st.id); setEditingName(st.name); }}>
                          {isEditing ? (
                            <InlineWrapper>
                              <InlineInput
                                value={editingName}
                                onChange={e => setEditingName(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleInlineSave(st.id);
                                  else if (e.key === 'Escape') setEditingId(null);
                                }}
                                autoFocus
                              />
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleInlineSave(st.id)}
                                style={{ padding: '4px 6px', height: 26 }}
                              >
                                <Check size={13} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingId(null)}
                                style={{ padding: '4px 6px', height: 26 }}
                              >
                                <X size={13} />
                              </Button>
                            </InlineWrapper>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 8,
                                  background: st.isActive ? 'rgba(16, 185, 129, 0.06)' : 'rgba(156, 163, 175, 0.1)',
                                  color: st.isActive ? '#10B981' : '#9CA3AF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 600,
                                  fontSize: 12
                                }}
                              >
                                {st.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: '#111827' }}>{st.name}</div>
                                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>Double-click to rename</div>
                              </div>
                            </div>
                          )}
                        </Td>
                        <Td style={{ fontFamily: 'monospace', fontSize: 12, color: '#4B5563' }}>
                          {st.slug}
                        </Td>
                        <Td style={{ textAlign: 'center', fontWeight: 600, color: '#374151' }}>
                          {cCount}
                        </Td>
                        <Td>
                          <StatusIndicator $active={st.isActive}>
                            <StatusDot $active={st.isActive} />
                            {st.isActive ? 'Active' : 'Inactive'}
                          </StatusIndicator>
                        </Td>
                        <Td style={{ textAlign: 'right' }}>
                          <DropdownWrapper ref={activeMenuId === st.id ? menuRef : null}>
                            <DropdownTrigger onClick={() => setActiveMenuId(prev => prev === st.id ? null : st.id)}>
                              <MoreVertical size={16} />
                            </DropdownTrigger>
                            {activeMenuId === st.id && (
                              <DropdownMenu>
                                <DropdownItem onClick={() => { navigate(`/shop-types/${st.id}/categories`); setActiveMenuId(null); }}>
                                  <FolderOpen size={13} />
                                  View Categories
                                </DropdownItem>
                                <DropdownItem onClick={() => { setEditTarget(st); setActiveMenuId(null); }}>
                                  <Pencil size={13} />
                                  Edit Details
                                </DropdownItem>
                                <DropdownItem onClick={() => handleDuplicate(st)}>
                                  <Copy size={13} />
                                  Duplicate
                                </DropdownItem>
                                <DropdownItem onClick={() => handleToggleStatus(st)}>
                                  <Archive size={13} />
                                  {st.isActive ? 'Archive/Deactivate' : 'Restore/Activate'}
                                </DropdownItem>
                                <div style={{ height: 1, background: '#E5E7EB', margin: '4px 0' }} />
                                <DropdownItem $danger onClick={() => { setDeleteTarget(st); setActiveMenuId(null); }}>
                                  <Trash2 size={13} />
                                  Delete
                                </DropdownItem>
                              </DropdownMenu>
                            )}
                          </DropdownWrapper>
                        </Td>
                      </Tr>
                    );
                  })
                )}
              </TBody>
            </PremiumTable>
          </TableWrapper>

          {/* Mobile Grid/Cards representation */}
          <MobileCardContainer>
            {store.status === 'FETCHING' ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonCard key={idx} style={{ height: 140 }}>
                  <SkeletonLine $width="50%" $height="18px" />
                  <SkeletonLine $width="90%" $height="12px" />
                  <SkeletonLine $width="30%" $height="14px" />
                </SkeletonCard>
              ))
            ) : paginatedShopTypes.length === 0 ? (
              <EmptyStateContainer style={{ background: '#fff', borderRadius: 12 }}>
                <EmptyIcon><Tags size={24} /></EmptyIcon>
                <EmptyTitle>No Shop Types Found</EmptyTitle>
                <EmptySubtitle>Try adjusting your search criteria.</EmptySubtitle>
              </EmptyStateContainer>
            ) : (
              paginatedShopTypes.map(st => {
                const cCount = categoryCounts[st.id] ?? 0;
                return (
                  <MobileCard key={st.id}>
                    <MobileCardHeader>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: st.isActive ? 'rgba(16, 185, 129, 0.06)' : 'rgba(156, 163, 175, 0.1)',
                            color: st.isActive ? '#10B981' : '#9CA3AF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700
                          }}
                        >
                          {st.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#111827', fontSize: 14 }}>{st.name}</div>
                          <div style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>{st.slug}</div>
                        </div>
                      </div>
                      <StatusIndicator $active={st.isActive}>
                        <StatusDot $active={st.isActive} />
                        {st.isActive ? 'Active' : 'Inactive'}
                      </StatusIndicator>
                    </MobileCardHeader>
                    
                    <MobileCardBody>
                      <div>
                        <MobileLabel>Mapped Categories</MobileLabel>
                        <MobileValue style={{ display: 'block', marginTop: 2 }}>{cCount} items</MobileValue>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={<FolderOpen size={12} />}
                          onClick={() => navigate(`/shop-types/${st.id}/categories`)}
                        >
                          Cats
                        </Button>
                      </div>
                    </MobileCardBody>

                    <div style={{ display: 'flex', gap: 6, width: '100%', marginTop: 4 }}>
                      <Button
                        size="sm"
                        variant="outline"
                        style={{ flex: 1 }}
                        icon={<Pencil size={12} />}
                        onClick={() => setEditTarget(st)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        style={{ flex: 1 }}
                        icon={<Archive size={12} />}
                        onClick={() => handleToggleStatus(st)}
                      >
                        Toggle Status
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        icon={<Trash2 size={12} />}
                        onClick={() => setDeleteTarget(st)}
                      />
                    </div>
                  </MobileCard>
                );
              })
            )}
          </MobileCardContainer>

          {/* Table Pagination */}
          <PaginationRow>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <PaginationInfo>
                Showing {sortedShopTypes.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, sortedShopTypes.length)} of{' '}
                {sortedShopTypes.length} records
              </PaginationInfo>
              <select
                value={itemsPerPage}
                onChange={e => setItemsPerPage(Number(e.target.value))}
                style={{
                  border: '1px solid rgba(229, 231, 235, 0.8)',
                  borderRadius: 6,
                  padding: '2px 6px',
                  fontSize: 12,
                  outline: 'none',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
              </select>
            </div>
            <PaginationActions>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                icon={<ChevronLeft size={14} />}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', padding: '0 8px' }}>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                icon={<ChevronRight size={14} />}
              />
            </PaginationActions>
          </PaginationRow>
        </TableOuterCard>

        {/* Floating Action Button for Mobile */}
        <FloatingActionButton onClick={() => setCreateOpen(true)} title="Create Shop Type">
          <Plus size={24} />
        </FloatingActionButton>

        {/* Create Shop Type Modal */}
        <CreateShopTypeModal open={createOpen} onClose={() => setCreateOpen(false)} />

        {/* Edit Shop Type Modal */}
        <EditShopTypeModal shopType={editTarget} onClose={() => setEditTarget(null)} />

        {/* Custom Confirmation modal for Delete */}
        <Modal
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Confirm Deletion"
          width={400}
        >
          {deleteTarget && (
            <ConfirmBox>
              <ConfirmHeading>Are you absolutely sure?</ConfirmHeading>
              <ConfirmText>
                You are about to permanently delete the shop type <strong>"{deleteTarget.name}"</strong>.
                This action cannot be undone. Stores configured with this type might need realignment.
              </ConfirmText>
              
              <DangerWarning>
                <ShieldAlert size={16} style={{ flexShrink: 0 }} />
                <span>Deleting this business structure will remove all corresponding category mappings.</span>
              </DangerWarning>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  onClick={handleDeleteConfirm}
                >
                  Confirm Delete
                </Button>
              </div>
            </ConfirmBox>
          )}
        </Modal>

        {/* Toast Notifications */}
        <ToastWrapper>
          {toasts.map(t => (
            <ToastAlert key={t.id} $type={t.type}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {t.type === 'success' ? (
                  <CheckCircle size={16} color="#10B981" />
                ) : t.type === 'error' ? (
                  <XCircle size={16} color="#EF4444" />
                ) : (
                  <HelpCircle size={16} color="#3B82F6" />
                )}
                <ToastText>{t.message}</ToastText>
              </div>
              <ToastClose onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>
                <X size={12} />
              </ToastClose>
            </ToastAlert>
          ))}
        </ToastWrapper>

        {/* Command Palette Modal overlay */}
        {commandPaletteOpen && (
          <CmdPaletteOverlay onClick={() => setCommandPaletteOpen(false)}>
            <CmdPaletteModal onClick={e => e.stopPropagation()}>
              <CmdPaletteSearch>
                <Command size={18} color="#10B981" />
                <CmdInput
                  ref={commandInputRef}
                  placeholder="Type a command or filter..."
                  value={commandSearch}
                  onChange={e => { setCommandSearch(e.target.value); setCommandSelectedIndex(0); }}
                  onKeyDown={handleCommandPaletteKey}
                />
                <CmdBadge>ESC</CmdBadge>
              </CmdPaletteSearch>
              <CmdList>
                <CmdGroupTitle>Quick Actions</CmdGroupTitle>
                {commands.length === 0 ? (
                  <div style={{ padding: '12px 16px', fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>
                    No matching commands
                  </div>
                ) : (
                  commands.map((cmd, idx) => (
                    <CmdItem
                      key={cmd.id}
                      $selected={idx === commandSelectedIndex}
                      onMouseEnter={() => setCommandSelectedIndex(idx)}
                      onClick={() => { cmd.action(); setCommandPaletteOpen(false); }}
                    >
                      <CmdItemLeft>
                        <div style={{ color: idx === commandSelectedIndex ? '#10B981' : '#6B7280' }}>
                          {cmd.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{cmd.title}</div>
                          <div style={{ fontSize: 11, color: '#9CA3AF' }}>{cmd.subtitle}</div>
                        </div>
                      </CmdItemLeft>
                      <span style={{ fontSize: 10, opacity: idx === commandSelectedIndex ? 1 : 0 }}>↵ ENTER</span>
                    </CmdItem>
                  ))
                )}
              </CmdList>
              <div
                style={{
                  background: '#F9FAFB',
                  padding: '8px 16px',
                  borderTop: '1px solid #E5E7EB',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 11,
                  color: '#9CA3AF'
                }}
              >
                <span>Use Arrow keys to navigate, Enter to select</span>
                <span>Press Ctrl+K to toggle</span>
              </div>
            </CmdPaletteModal>
          </CmdPaletteOverlay>
        )}
      </PageOuter>
    </ErrorBoundary>
  );
};

export default observer(ShopTypesRouteComponent);
