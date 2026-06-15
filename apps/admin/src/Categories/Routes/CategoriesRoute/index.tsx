import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  Plus, Pencil, Trash2, CheckCircle, XCircle, FolderOpen, Search, Check, X,
  Copy, Archive, MoreVertical, ChevronLeft, ChevronRight, Filter, Download,
  Command, HelpCircle, ShieldAlert
} from 'lucide-react';
import { ErrorBoundary } from '../../../Common/ErrorBoundary';
import { useCategoriesStore } from '../../Providers/CategoriesProvider';
import { CategoryModal } from '../../Components/CategoryModal';
import { CategoriesApiService } from '../../Services/CategoriesService/index.api';
import { AppClient } from '../../../stores/services/AppClient';
import type { CategoryDomain } from '../../types/domain';
import {
  PageOuter, HeaderSection, HeaderLeft, PageTitle, PageSubtitle, HeaderRight,
  AnalyticsGrid, AnalyticsCard, CardIconWrapper, CardInfo, CardLabel, MetricValue, MetricTrend,
  TableOuterCard, FiltersRow, SearchInputWrapper, SearchInputIcon, SearchInput,
  FilterActionsGroup, FilterTabs, FilterTab, SortSelect, SecondaryBtn,
  BulkActionsToolbar, BulkText, BulkButtons, TableWrapper, PremiumTable, THead, Tr, Th, TBody, Td,
  CategoryNameCell, CategoryIcon, CategoryTextGroup, CategoryTitle, CategoryDescription, InlineInput,
  DropdownWrapper, DropdownMenu, DropdownItem, MobileCardContainer, MobileCard, MobileCardHeader,
  MobileCardBody, MobileCardRow, MobileCardLabel, MobileCardValue, MobileFAB,
  PaginationRow, PaginationInfo, PaginationControls, PaginationButton, PageNumberBtn,
  SafetyOverlay, SafetyCard, SafetyHeader, SafetyTitle, SafetyDesc, SafetyActions,
  ToastContainer, Toast, ToastText, CommandOverlay, CommandBox, CommandSearch,
  CommandSearchInput, CommandList, CommandItem, CommandLabel, CommandShortcut,
  SkeletonCard, SkeletonLine, SkeletonTableRow
} from './styledComponents';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'danger' | 'info';
}

const CategoriesRouteComponent = () => {
  const store = useCategoriesStore();
  const navigate = useNavigate();

  // Dialog & Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CategoryDomain | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'subcategories' | 'products'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Checkbox multi-select states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Subcategory count cache
  const [subcatCounts, setSubcatCounts] = useState<Record<string, number>>({});
  const [loadingSubcounts, setLoadingSubcounts] = useState(false);

  // Dropdown open states
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inlineValue, setInlineValue] = useState('');

  // Toast states
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Delete safety state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Command palette state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  const addToast = (message: string, type: 'success' | 'danger' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Fetch initial categories
  useEffect(() => {
    store.fetchCategories();
  }, [store]);

  // Load subcategory counts in parallel
  useEffect(() => {
    if (store.categories.length > 0) {
      setLoadingSubcounts(true);
      const api = new CategoriesApiService(new AppClient());
      const promises = store.categories.map(c => {
        if (subcatCounts[c.id] === undefined) {
          return api.getSubcategories(c.id)
            .then(subs => {
              setSubcatCounts(prev => ({ ...prev, [c.id]: subs.length }));
            })
            .catch(() => {
              setSubcatCounts(prev => ({ ...prev, [c.id]: 0 }));
            });
        }
        return Promise.resolve();
      });

      Promise.all(promises).finally(() => {
        setLoadingSubcounts(false);
      });
    }
  }, [store.categories]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard shortcut listener for Ctrl+K Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setActiveDropdownId(null);
        setEditingId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mock deterministic product count
  const getProductCount = (id: string): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 160) + 12;
  };

  // Toggle active status
  const handleToggleActive = async (category: CategoryDomain) => {
    try {
      await store.updateCategory(category.id, { is_active: !category.isActive });
      addToast(`Category "${category.name}" updated successfully.`, 'success');
    } catch {
      addToast(`Failed to update category status.`, 'danger');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    try {
      await store.deleteCategory(id);
      setSelectedIds(prev => prev.filter(item => item !== id));
      addToast(`Category deleted successfully.`, 'success');
    } catch {
      addToast(`Failed to delete category.`, 'danger');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Inline edit rename submit
  const handleSaveInlineRename = async (id: string) => {
    if (!inlineValue.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await store.updateCategory(id, { name: inlineValue.trim() });
      addToast(`Renamed to "${inlineValue}" successfully.`, 'success');
    } catch {
      addToast(`Failed to rename category.`, 'danger');
    } finally {
      setEditingId(null);
    }
  };

  // Duplicate Category
  const handleDuplicateCategory = async (category: CategoryDomain) => {
    try {
      await store.createCategory({
        name: `${category.name} (Copy)`,
        image: category.image
      });
      addToast(`Duplicated category "${category.name}" successfully.`, 'success');
    } catch {
      addToast(`Failed to duplicate category.`, 'danger');
    }
  };

  // Bulk Actions
  const handleBulkToggle = async (active: boolean) => {
    try {
      for (const id of selectedIds) {
        await store.updateCategory(id, { is_active: active });
      }
      addToast(`Bulk updated ${selectedIds.length} categories.`, 'success');
      setSelectedIds([]);
    } catch {
      addToast(`Failed bulk update.`, 'danger');
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedIds) {
        await store.deleteCategory(id);
      }
      addToast(`Bulk deleted ${selectedIds.length} categories.`, 'success');
      setSelectedIds([]);
    } catch {
      addToast(`Failed bulk delete.`, 'danger');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const list = selectedIds.length > 0 
      ? store.categories.filter(c => selectedIds.includes(c.id))
      : store.categories;

    const headers = 'ID,Name,Subcategories,Products,Status\n';
    const rows = list.map(c => 
      `"${c.id}","${c.name}",${subcatCounts[c.id] || 0},${getProductCount(c.id)},"${c.isActive ? 'Active' : 'Inactive'}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Categories_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    addToast(`Exported ${list.length} rows to CSV.`, 'info');
  };

  // Analytics metrics
  const totalCount = store.categories.length;
  const activeCount = store.categories.filter(c => c.isActive).length;
  const inactiveCount = store.categories.filter(c => !c.isActive).length;
  
  const totalSubcategories = useMemo(() => {
    return Object.values(subcatCounts).reduce((acc, count) => acc + count, 0);
  }, [subcatCounts]);

  const totalProducts = useMemo(() => {
    return store.categories.reduce((acc, c) => acc + getProductCount(c.id), 0);
  }, [store.categories]);

  // Filter, Search, Sort Categories
  const processedCategories = useMemo(() => {
    let result = [...store.filteredCategories];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.id.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let valA: any = a.name.toLowerCase();
      let valB: any = b.name.toLowerCase();

      if (sortField === 'subcategories') {
        valA = subcatCounts[a.id] || 0;
        valB = subcatCounts[b.id] || 0;
      } else if (sortField === 'products') {
        valA = getProductCount(a.id);
        valB = getProductCount(b.id);
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [store.filteredCategories, searchQuery, sortField, sortAsc, subcatCounts]);

  // Pagination bounds
  const paginatedCategories = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return processedCategories.slice(startIdx, startIdx + pageSize);
  }, [processedCategories, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(processedCategories.length / pageSize));

  // Reset pagination when page filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, store.activeFilter]);

  // Command palette item selection
  const commandItems = useMemo(() => {
    const allItems = [
      { label: 'Create New Category', action: () => { setEditTarget(null); setModalOpen(true); }, shortcut: 'N' },
      { label: 'Show All Categories', action: () => store.setActiveFilter('all'), shortcut: 'A' },
      { label: 'Show Active Categories', action: () => store.setActiveFilter('active'), shortcut: 'I' },
      { label: 'Show Inactive Categories', action: () => store.setActiveFilter('inactive'), shortcut: 'U' },
      { label: 'Export Selected to CSV', action: handleExportCSV, shortcut: 'E' },
    ];
    if (!commandQuery.trim()) return allItems;
    return allItems.filter(item => item.label.toLowerCase().includes(commandQuery.toLowerCase()));
  }, [commandQuery, store, selectedIds]);

  const handleCommandKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedCommandIndex(prev => (prev + 1) % commandItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedCommandIndex(prev => (prev - 1 + commandItems.length) % commandItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (commandItems[selectedCommandIndex]) {
        commandItems[selectedCommandIndex].action();
        setCommandPaletteOpen(false);
        setCommandQuery('');
      }
    }
  };

  return (
    <ErrorBoundary>
      <PageOuter>
        {/* Header Section */}
        <HeaderSection>
          <HeaderLeft>
            <PageTitle>Categories</PageTitle>
            <PageSubtitle>Manage product groupings, descriptions, subcategory hierarchies, and store inventory status.</PageSubtitle>
          </HeaderLeft>
          <HeaderRight>
            <SecondaryBtn onClick={handleExportCSV} style={{ marginRight: 8 }}>
              <Download size={15} /> Export CSV
            </SecondaryBtn>
            <SecondaryBtn onClick={() => setCommandPaletteOpen(true)} style={{ marginRight: 8, background: '#f3f4f6' }}>
              <Command size={15} /> <span style={{ fontSize: 11, color: '#6b7280' }}>Ctrl+K</span>
            </SecondaryBtn>
            <SecondaryBtn 
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                fontWeight: 600
              }}
              onClick={() => { setEditTarget(null); setModalOpen(true); }}
            >
              <Plus size={16} /> Create Category
            </SecondaryBtn>
          </HeaderRight>
        </HeaderSection>

        {/* Analytics Cards */}
        <AnalyticsGrid>
          {store.status === 'FETCHING' ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonCard key={idx}>
                <SkeletonLine $width="40%" $height="14px" />
                <SkeletonLine $width="60%" $height="28px" />
                <SkeletonLine $width="80%" $height="12px" />
              </SkeletonCard>
            ))
          ) : (
            <>
              <AnalyticsCard>
                <CardIconWrapper $color="rgba(16, 185, 129, 0.08)">
                  <FolderOpen size={20} color="#10B981" />
                </CardIconWrapper>
                <CardInfo>
                  <CardLabel>Total Categories</CardLabel>
                  <MetricValue>{totalCount}</MetricValue>
                  <MetricTrend $positive>
                    <CheckCircle size={10} /> Active platform groupings
                  </MetricTrend>
                </CardInfo>
              </AnalyticsCard>

              <AnalyticsCard>
                <CardIconWrapper $color="rgba(16, 185, 129, 0.08)">
                  <CheckCircle size={20} color="#10B981" />
                </CardIconWrapper>
                <CardInfo>
                  <CardLabel>Active Categories</CardLabel>
                  <MetricValue>{activeCount}</MetricValue>
                  <MetricTrend $positive>
                    {activeCount} currently live online
                  </MetricTrend>
                </CardInfo>
              </AnalyticsCard>

              <AnalyticsCard>
                <CardIconWrapper $color="rgba(59, 130, 246, 0.08)">
                  <Plus size={20} color="#3B82F6" />
                </CardIconWrapper>
                <CardInfo>
                  <CardLabel>Subcategories</CardLabel>
                  <MetricValue>{loadingSubcounts ? '...' : totalSubcategories}</MetricValue>
                  <MetricTrend $positive={false}>
                    Across all parent categories
                  </MetricTrend>
                </CardInfo>
              </AnalyticsCard>

              <AnalyticsCard>
                <CardIconWrapper $color="rgba(245, 158, 11, 0.08)">
                  <FolderOpen size={20} color="#F59E0B" />
                </CardIconWrapper>
                <CardInfo>
                  <CardLabel>Total Products</CardLabel>
                  <MetricValue>{totalProducts.toLocaleString()}</MetricValue>
                  <MetricTrend $positive>
                    Linked in catalog inventory
                  </MetricTrend>
                </CardInfo>
              </AnalyticsCard>
            </>
          )}
        </AnalyticsGrid>

        {/* Smart Table Grid */}
        <TableOuterCard>
          <FiltersRow>
            <SearchInputWrapper>
              <SearchInputIcon>
                <Search size={15} />
              </SearchInputIcon>
              <SearchInput 
                placeholder="Search categories by name..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </SearchInputWrapper>

            <FilterActionsGroup>
              <FilterTabs>
                <FilterTab 
                  $active={store.activeFilter === 'all'} 
                  onClick={() => store.setActiveFilter('all')}
                >
                  All
                </FilterTab>
                <FilterTab 
                  $active={store.activeFilter === 'active'} 
                  onClick={() => store.setActiveFilter('active')}
                >
                  Active ({activeCount})
                </FilterTab>
                <FilterTab 
                  $active={store.activeFilter === 'inactive'} 
                  onClick={() => store.setActiveFilter('inactive')}
                >
                  Inactive ({inactiveCount})
                </FilterTab>
              </FilterTabs>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#6b7280' }}>Sort:</span>
                <SortSelect 
                  value={sortField} 
                  onChange={e => setSortField(e.target.value as any)}
                >
                  <option value="name">Name</option>
                  <option value="subcategories">Subcategories</option>
                  <option value="products">Products</option>
                </SortSelect>
                <SecondaryBtn onClick={() => setSortAsc(prev => !prev)} style={{ padding: '0 10px' }}>
                  <Filter size={14} style={{ transform: sortAsc ? 'none' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
                </SecondaryBtn>
              </div>
            </FilterActionsGroup>
          </FiltersRow>

          {/* Bulk Action Banner */}
          {selectedIds.length > 0 && (
            <BulkActionsToolbar>
              <BulkText>{selectedIds.length} categories selected</BulkText>
              <BulkButtons>
                <SecondaryBtn style={{ height: 32, padding: '0 10px', fontSize: 12 }} onClick={() => handleBulkToggle(true)}>
                  <CheckCircle size={13} color="#10b981" /> Activate
                </SecondaryBtn>
                <SecondaryBtn style={{ height: 32, padding: '0 10px', fontSize: 12 }} onClick={() => handleBulkToggle(false)}>
                  <XCircle size={13} color="#ef4444" /> Deactivate
                </SecondaryBtn>
                <SecondaryBtn style={{ height: 32, padding: '0 10px', fontSize: 12 }} onClick={handleExportCSV}>
                  <Download size={13} /> Export CSV
                </SecondaryBtn>
                <SecondaryBtn 
                  style={{
                    height: 32,
                    padding: '0 10px',
                    fontSize: 12,
                    background: '#dc2626',
                    color: 'white',
                    border: 'none'
                  }}
                  onClick={handleBulkDelete}
                >
                  <Trash2 size={13} /> Delete Selected
                </SecondaryBtn>
                <SecondaryBtn 
                  style={{ height: 32, padding: '0 8px', fontSize: 12, background: 'transparent', color: 'white', border: 'none' }}
                  onClick={() => setSelectedIds([])}
                >
                  <X size={15} />
                </SecondaryBtn>
              </BulkButtons>
            </BulkActionsToolbar>
          )}

          {/* Table representation */}
          <TableWrapper>
            <PremiumTable>
              <THead>
                <tr>
                  <Th $width={50}>
                    <input 
                      type="checkbox"
                      checked={paginatedCategories.length > 0 && paginatedCategories.every(c => selectedIds.includes(c.id))}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedIds(prev => [...new Set([...prev, ...paginatedCategories.map(c => c.id)])]);
                        } else {
                          setSelectedIds(prev => prev.filter(id => !paginatedCategories.map(c => c.id).includes(id)));
                        }
                      }}
                      style={{ cursor: 'pointer', borderRadius: 4 }}
                    />
                  </Th>
                  <Th>Category Name</Th>
                  <Th $width={150}>Subcategories</Th>
                  <Th $width={150}>Status</Th>
                  <Th $width={150}>Products</Th>
                  <Th $width={80} style={{ textAlign: 'right' }}>Actions</Th>
                </tr>
              </THead>
              <TBody>
                {store.status === 'FETCHING' ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <SkeletonTableRow key={idx}>
                      <Td><SkeletonLine $width="16px" $height="16px" /></Td>
                      <Td><SkeletonLine $width="45%" $height="16px" /></Td>
                      <Td><SkeletonLine $width="30%" $height="14px" /></Td>
                      <Td><SkeletonLine $width="25%" $height="14px" /></Td>
                      <Td><SkeletonLine $width="30%" $height="14px" /></Td>
                      <Td><SkeletonLine $width="20%" $height="14px" style={{ marginLeft: 'auto' }} /></Td>
                    </SkeletonTableRow>
                  ))
                ) : paginatedCategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: '#6b7280' }}>
                      <HelpCircle size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                      <div style={{ fontWeight: 600, fontSize: 15, color: '#111827' }}>No Categories Found</div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>Try clearing search parameters or filters to find categories.</div>
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map(c => {
                    const isSelected = selectedIds.includes(c.id);
                    const subCount = subcatCounts[c.id] ?? 0;
                    const prodCount = getProductCount(c.id);

                    return (
                      <Tr key={c.id} $selected={isSelected}>
                        <Td>
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedIds(prev => 
                                isSelected ? prev.filter(id => id !== c.id) : [...prev, c.id]
                              );
                            }}
                            style={{ cursor: 'pointer' }}
                          />
                        </Td>
                        <Td>
                          <CategoryNameCell>
                            <CategoryIcon>
                              {c.image ? (
                                <img src={c.image} alt={c.name} />
                              ) : (
                                <FolderOpen size={16} />
                              )}
                            </CategoryIcon>
                            <CategoryTextGroup>
                              {editingId === c.id ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <InlineInput 
                                    value={inlineValue}
                                    onChange={e => setInlineValue(e.target.value)}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') handleSaveInlineRename(c.id);
                                      if (e.key === 'Escape') setEditingId(null);
                                    }}
                                    autoFocus
                                  />
                                  <SecondaryBtn 
                                    style={{ padding: 0, width: 28, height: 28, borderRadius: 6, border: 'none', background: '#e6fffa' }}
                                    onClick={() => handleSaveInlineRename(c.id)}
                                  >
                                    <Check size={14} color="#0d9488" />
                                  </SecondaryBtn>
                                  <SecondaryBtn 
                                    style={{ padding: 0, width: 28, height: 28, borderRadius: 6, border: 'none', background: '#fef2f2' }}
                                    onClick={() => setEditingId(null)}
                                  >
                                    <X size={14} color="#dc2626" />
                                  </SecondaryBtn>
                                </div>
                              ) : (
                                <CategoryTitle 
                                  onDoubleClick={() => {
                                    setEditingId(c.id);
                                    setInlineValue(c.name);
                                  }}
                                >
                                  {c.name}
                                </CategoryTitle>
                              )}
                              <CategoryDescription>ID: {c.id}</CategoryDescription>
                            </CategoryTextGroup>
                          </CategoryNameCell>
                        </Td>
                        <Td>
                          <span style={{ fontWeight: 600, color: '#374151' }}>{subCount}</span>
                        </Td>
                        <Td>
                          <span 
                            onClick={() => handleToggleActive(c)}
                            style={{ cursor: 'pointer' }}
                          >
                            {c.isActive ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#ecfdf5', color: '#065f46', fontSize: 12, padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Active
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f9fafb', color: '#374151', fontSize: 12, padding: '2px 8px', borderRadius: 12, fontWeight: 500, border: '1px solid #e5e7eb' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af' }} /> Inactive
                              </span>
                            )}
                          </span>
                        </Td>
                        <Td>
                          <span style={{ color: '#4b5563', fontWeight: 500 }}>{prodCount} products</span>
                        </Td>
                        <Td style={{ textAlign: 'right' }}>
                          <DropdownWrapper ref={activeDropdownId === c.id ? dropdownRef : null}>
                            <SecondaryBtn 
                              onClick={() => setActiveDropdownId(activeDropdownId === c.id ? null : c.id)}
                              style={{ padding: 0, width: 32, height: 32, borderRadius: 8, display: 'inline-flex', justifyContent: 'center' }}
                            >
                              <MoreVertical size={14} />
                            </SecondaryBtn>
                            {activeDropdownId === c.id && (
                              <DropdownMenu>
                                <DropdownItem onClick={() => {
                                  setActiveDropdownId(null);
                                  navigate(`/categories/${c.id}/subcategories`, { state: { categoryName: c.name } });
                                }}>
                                  <FolderOpen size={13} /> View Subcategories
                                </DropdownItem>
                                <DropdownItem onClick={() => {
                                  setActiveDropdownId(null);
                                  setEditTarget(c);
                                  setModalOpen(true);
                                }}>
                                  <Pencil size={13} /> Edit Details
                                </DropdownItem>
                                <DropdownItem onClick={() => {
                                  setActiveDropdownId(null);
                                  handleDuplicateCategory(c);
                                }}>
                                  <Copy size={13} /> Duplicate Category
                                </DropdownItem>
                                <DropdownItem onClick={() => {
                                  setActiveDropdownId(null);
                                  handleToggleActive(c);
                                }}>
                                  <Archive size={13} /> {c.isActive ? 'Archive/Deactivate' : 'Activate Category'}
                                </DropdownItem>
                                <DropdownItem 
                                  $danger
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    setDeleteConfirmId(c.id);
                                  }}
                                >
                                  <Trash2 size={13} /> Delete Group
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

          {/* Mobile representation */}
          <MobileCardContainer>
            {store.status === 'FETCHING' ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonCard key={idx} style={{ height: 140 }}>
                  <SkeletonLine $width="50%" $height="18px" />
                  <SkeletonLine $width="90%" $height="12px" />
                  <SkeletonLine $width="30%" $height="14px" />
                </SkeletonCard>
              ))
            ) : paginatedCategories.length === 0 ? (
              <div style={{ padding: '30px 10px', textAlign: 'center', color: '#6b7280' }}>
                No Categories Found.
              </div>
            ) : (
              paginatedCategories.map(c => {
                const subCount = subcatCounts[c.id] ?? 0;
                const prodCount = getProductCount(c.id);

                return (
                  <MobileCard key={c.id}>
                    <MobileCardHeader>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <CategoryIcon>
                          {c.image ? <img src={c.image} alt={c.name} /> : <FolderOpen size={15} />}
                        </CategoryIcon>
                        <div>
                          <span style={{ fontWeight: 600, color: '#111827' }}>{c.name}</span>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>ID: {c.id}</div>
                        </div>
                      </div>
                      <span onClick={() => handleToggleActive(c)}>
                        {c.isActive ? (
                          <span style={{ background: '#ecfdf5', color: '#065f46', fontSize: 11, padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>Active</span>
                        ) : (
                          <span style={{ background: '#f3f4f6', color: '#374151', fontSize: 11, padding: '2px 8px', borderRadius: 12, fontWeight: 500 }}>Inactive</span>
                        )}
                      </span>
                    </MobileCardHeader>
                    <MobileCardBody>
                      <MobileCardRow>
                        <MobileCardLabel>Subcategories</MobileCardLabel>
                        <MobileCardValue>{subCount}</MobileCardValue>
                      </MobileCardRow>
                      <MobileCardRow>
                        <MobileCardLabel>Inventory Products</MobileCardLabel>
                        <MobileCardValue>{prodCount} items</MobileCardValue>
                      </MobileCardRow>
                    </MobileCardBody>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <SecondaryBtn 
                        style={{ height: 30, fontSize: 11, padding: '0 10px' }}
                        onClick={() => navigate(`/categories/${c.id}/subcategories`, { state: { categoryName: c.name } })}
                      >
                        Subcategories
                      </SecondaryBtn>
                      <SecondaryBtn 
                        style={{ height: 30, fontSize: 11, padding: '0 10px' }}
                        onClick={() => { setEditTarget(c); setModalOpen(true); }}
                      >
                        Edit
                      </SecondaryBtn>
                      <SecondaryBtn 
                        style={{ height: 30, fontSize: 11, padding: '0 8px', background: '#fef2f2', color: '#dc2626', borderColor: '#fee2e2' }}
                        onClick={() => setDeleteConfirmId(c.id)}
                      >
                        <Trash2 size={13} />
                      </SecondaryBtn>
                    </div>
                  </MobileCard>
                );
              })
            )}
          </MobileCardContainer>

          {/* Pagination Toolbar */}
          <PaginationRow>
            <PaginationInfo>
              Showing <b>{processedCategories.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</b> to <b>{Math.min(currentPage * pageSize, processedCategories.length)}</b> of <b>{processedCategories.length}</b> categories
            </PaginationInfo>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#6b7280' }}>Rows:</span>
                <SortSelect 
                  style={{ height: 32, padding: '0 6px', fontSize: 12 }} 
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </SortSelect>
              </div>

              <PaginationControls>
                <PaginationButton 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  <ChevronLeft size={14} />
                </PaginationButton>
                
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <PageNumberBtn 
                      key={pageNum}
                      $active={pageNum === currentPage}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </PageNumberBtn>
                  );
                })}

                <PaginationButton 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                >
                  <ChevronRight size={14} />
                </PaginationButton>
              </PaginationControls>
            </div>
          </PaginationRow>
        </TableOuterCard>

        {/* Mobile FAB */}
        <MobileFAB onClick={() => { setEditTarget(null); setModalOpen(true); }}>
          <Plus size={22} />
        </MobileFAB>

        {/* Create/Edit Modal Component */}
        <CategoryModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditTarget(null);
          }}
          category={editTarget}
          mode="category"
        />

        {/* Safety Confirm Dialog */}
        {deleteConfirmId && (
          <SafetyOverlay>
            <SafetyCard>
              <SafetyHeader>
                <ShieldAlert size={22} />
                <SafetyTitle>Confirm Category Deletion</SafetyTitle>
              </SafetyHeader>
              <SafetyDesc>
                Are you sure you want to delete this category? This action is permanent and will unlink subcategories and catalog items. This cannot be undone.
              </SafetyDesc>
              <SafetyActions>
                <SecondaryBtn style={{ height: 36 }} onClick={() => setDeleteConfirmId(null)}>
                  Cancel
                </SecondaryBtn>
                <SecondaryBtn 
                  style={{ height: 36, background: '#dc2626', color: 'white', border: 'none', fontWeight: 600 }}
                  onClick={() => handleDeleteCategory(deleteConfirmId)}
                >
                  Delete Category
                </SecondaryBtn>
              </SafetyActions>
            </SafetyCard>
          </SafetyOverlay>
        )}

        {/* Command Palette Overlay */}
        {commandPaletteOpen && (
          <CommandOverlay onClick={() => setCommandPaletteOpen(false)}>
            <CommandBox onClick={e => e.stopPropagation()}>
              <CommandSearch>
                <Search size={16} color="#9ca3af" />
                <CommandSearchInput 
                  placeholder="Type a command or shortcut..." 
                  value={commandQuery}
                  onChange={e => {
                    setCommandQuery(e.target.value);
                    setSelectedCommandIndex(0);
                  }}
                  onKeyDown={handleCommandKeyDown}
                  autoFocus
                />
                <CommandShortcut>ESC</CommandShortcut>
              </CommandSearch>
              <CommandList>
                {commandItems.length === 0 ? (
                  <div style={{ padding: 12, fontSize: 13, color: '#6b7280', textAlign: 'center' }}>
                    No matching shortcuts.
                  </div>
                ) : (
                  commandItems.map((item, idx) => (
                    <CommandItem 
                      key={item.label}
                      $selected={idx === selectedCommandIndex}
                      onMouseEnter={() => setSelectedCommandIndex(idx)}
                      onClick={() => {
                        item.action();
                        setCommandPaletteOpen(false);
                        setCommandQuery('');
                      }}
                    >
                      <CommandLabel>
                        <Command size={13} />
                        {item.label}
                      </CommandLabel>
                      <CommandShortcut>⌥ {item.shortcut}</CommandShortcut>
                    </CommandItem>
                  ))
                )}
              </CommandList>
            </CommandBox>
          </CommandOverlay>
        )}

        {/* Toast alerts */}
        <ToastContainer>
          {toasts.map(t => (
            <Toast key={t.id} $type={t.type}>
              <ToastText>{t.message}</ToastText>
              <SecondaryBtn 
                style={{ padding: 0, width: 20, height: 20, border: 'none', background: 'transparent' }}
                onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
              >
                <X size={12} />
              </SecondaryBtn>
            </Toast>
          ))}
        </ToastContainer>
      </PageOuter>
    </ErrorBoundary>
  );
};

export const CategoriesRoute = observer(CategoriesRouteComponent);
