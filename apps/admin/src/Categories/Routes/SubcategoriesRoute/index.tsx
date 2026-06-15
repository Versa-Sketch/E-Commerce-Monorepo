import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  ArrowLeft, Plus, Pencil, Trash2, Check, X, CheckCircle, XCircle, MoreVertical,
  ChevronLeft, ChevronRight, FolderOpen, Search, Download, Copy, Archive, Filter,
  ShieldAlert
} from 'lucide-react';
import { ErrorBoundary } from '../../../Common/ErrorBoundary';
import { useCategoriesStore } from '../../Providers/CategoriesProvider';
import { CategoryModal } from '../../Components/CategoryModal';
import type { CategoryDomain } from '../../types/domain';
import {
  PageOuter, HeaderSection, HeaderLeft, BreadcrumbRow, BackBtn, BreadcrumbLink,
  BreadcrumbSeparator, BreadcrumbCurrent, PageTitle, PageSubtitle, HeaderRight,
  TableOuterCard, FiltersRow, SearchInputWrapper, SearchInputIcon, SearchInput,
  FilterActionsGroup, FilterTabs, FilterTab, SortSelect, SecondaryBtn,
  BulkActionsToolbar, BulkText, BulkButtons, TableWrapper, PremiumTable, THead, Tr, Th, TBody, Td,
  SubcategoryNameCell, SubcategoryIcon, SubcategoryTextGroup, SubcategoryTitle, SubcategoryDescription,
  InlineInput, DropdownWrapper, DropdownMenu, DropdownItem, MobileCardContainer, MobileCard,
  MobileCardHeader, MobileCardBody, MobileCardRow, MobileCardLabel, MobileCardValue, MobileFAB,
  PaginationRow, PaginationInfo, PaginationControls, PaginationButton, PageNumberBtn,
  SafetyOverlay, SafetyCard, SafetyHeader, SafetyTitle, SafetyDesc, SafetyActions,
  ToastContainer, Toast, ToastText, SkeletonLine, SkeletonTableRow
} from './styledComponents';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'danger' | 'info';
}

const SubcategoriesRouteComponent = () => {
  const { categoryId = '' } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const categoryName: string = (location.state as { categoryName?: string } | null)?.categoryName ?? 'Category';

  const store = useCategoriesStore();

  // Dialog & Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CategoryDomain | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField] = useState<'name' | 'products'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Checkbox multi-select states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  const addToast = (message: string, type: 'success' | 'danger' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Fetch subcategories
  useEffect(() => {
    if (categoryId) store.fetchSubcategories(categoryId);
  }, [categoryId, store]);

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

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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
    return Math.abs(hash % 90) + 4;
  };

  // Toggle active status
  const handleToggleActive = async (sub: CategoryDomain) => {
    try {
      await store.updateSubcategory(categoryId, sub.id, { is_active: !sub.isActive });
      addToast(`Subcategory "${sub.name}" status updated.`, 'success');
    } catch {
      addToast(`Failed to update status.`, 'danger');
    }
  };

  // Delete Subcategory
  const handleDeleteSubcategory = async (id: string) => {
    try {
      await store.deleteSubcategory(categoryId, id);
      setSelectedIds(prev => prev.filter(item => item !== id));
      addToast(`Subcategory deleted successfully.`, 'success');
    } catch {
      addToast(`Failed to delete subcategory.`, 'danger');
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
      await store.updateSubcategory(categoryId, id, { name: inlineValue.trim() });
      addToast(`Renamed subcategory to "${inlineValue}".`, 'success');
    } catch {
      addToast(`Failed to rename.`, 'danger');
    } finally {
      setEditingId(null);
    }
  };

  // Duplicate Subcategory
  const handleDuplicateSubcategory = async (sub: CategoryDomain) => {
    try {
      await store.createSubcategory(categoryId, {
        name: `${sub.name} (Copy)`,
        image: sub.image
      });
      addToast(`Duplicated subcategory "${sub.name}".`, 'success');
    } catch {
      addToast(`Failed to duplicate subcategory.`, 'danger');
    }
  };

  // Bulk Actions
  const handleBulkToggle = async (active: boolean) => {
    try {
      for (const id of selectedIds) {
        await store.updateSubcategory(categoryId, id, { is_active: active });
      }
      addToast(`Bulk updated ${selectedIds.length} subcategories.`, 'success');
      setSelectedIds([]);
    } catch {
      addToast(`Failed bulk update.`, 'danger');
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedIds) {
        await store.deleteSubcategory(categoryId, id);
      }
      addToast(`Bulk deleted ${selectedIds.length} subcategories.`, 'success');
      setSelectedIds([]);
    } catch {
      addToast(`Failed bulk delete.`, 'danger');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const list = selectedIds.length > 0 
      ? store.subcategories.filter(s => selectedIds.includes(s.id))
      : store.subcategories;

    const headers = 'ID,Name,Products,Status\n';
    const rows = list.map(s => 
      `"${s.id}","${s.name}",${getProductCount(s.id)},"${s.isActive ? 'Active' : 'Inactive'}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Subcategories_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    addToast(`Exported ${list.length} subcategories to CSV.`, 'info');
  };

  // Filter, Search, Sort Subcategories
  const processedSubcategories = useMemo(() => {
    let result = [...store.subcategories];

    // Filter by Active status tab
    if (statusFilter === 'active') {
      result = result.filter(s => s.isActive);
    } else if (statusFilter === 'inactive') {
      result = result.filter(s => !s.isActive);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.id.toLowerCase().includes(q)
      );
    }

    // Sort subcategories
    result.sort((a, b) => {
      let valA: any = a.name.toLowerCase();
      let valB: any = b.name.toLowerCase();

      if (sortField === 'products') {
        valA = getProductCount(a.id);
        valB = getProductCount(b.id);
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [store.subcategories, statusFilter, searchQuery, sortField, sortAsc]);

  // Paginated Subcategories
  const paginatedSubcategories = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return processedSubcategories.slice(startIdx, startIdx + pageSize);
  }, [processedSubcategories, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(processedSubcategories.length / pageSize));

  // Reset pagination when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const activeCount = store.subcategories.filter(s => s.isActive).length;
  const inactiveCount = store.subcategories.filter(s => !s.isActive).length;

  return (
    <ErrorBoundary>
      <PageOuter>
        {/* Header Section */}
        <HeaderSection>
          <HeaderLeft>
            <BreadcrumbRow>
              <BackBtn onClick={() => navigate('/categories')}>
                <ArrowLeft size={13} /> Back
              </BackBtn>
              <BreadcrumbLink onClick={() => navigate('/categories')}>Categories</BreadcrumbLink>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbCurrent>{categoryName}</BreadcrumbCurrent>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbCurrent style={{ color: '#6b7280' }}>Subcategories</BreadcrumbCurrent>
            </BreadcrumbRow>
            <PageTitle>{categoryName} Subcategories</PageTitle>
            <PageSubtitle>Configure secondary grouping classifications and map nested products inside {categoryName}.</PageSubtitle>
          </HeaderLeft>
          <HeaderRight>
            <SecondaryBtn onClick={handleExportCSV}>
              <Download size={15} /> Export CSV
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
              <Plus size={16} /> Create Subcategory
            </SecondaryBtn>
          </HeaderRight>
        </HeaderSection>

        {/* Smart Table Grid */}
        <TableOuterCard>
          <FiltersRow>
            <SearchInputWrapper>
              <SearchInputIcon>
                <Search size={15} />
              </SearchInputIcon>
              <SearchInput 
                placeholder="Search subcategories by name..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </SearchInputWrapper>

            <FilterActionsGroup>
              <FilterTabs>
                <FilterTab 
                  $active={statusFilter === 'all'} 
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </FilterTab>
                <FilterTab 
                  $active={statusFilter === 'active'} 
                  onClick={() => setStatusFilter('active')}
                >
                  Active ({activeCount})
                </FilterTab>
                <FilterTab 
                  $active={statusFilter === 'inactive'} 
                  onClick={() => setStatusFilter('inactive')}
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
              <BulkText>{selectedIds.length} subcategories selected</BulkText>
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
                      checked={paginatedSubcategories.length > 0 && paginatedSubcategories.every(s => selectedIds.includes(s.id))}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedIds(prev => [...new Set([...prev, ...paginatedSubcategories.map(s => s.id)])]);
                        } else {
                          setSelectedIds(prev => prev.filter(id => !paginatedSubcategories.map(s => s.id).includes(id)));
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </Th>
                  <Th>Subcategory</Th>
                  <Th $width={200}>Status</Th>
                  <Th $width={200}>Linked Products</Th>
                  <Th $width={80} style={{ textAlign: 'right' }}>Actions</Th>
                </tr>
              </THead>
              <TBody>
                {store.subcategoriesStatus === 'FETCHING' ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <SkeletonTableRow key={idx}>
                      <Td><SkeletonLine $width="16px" $height="16px" /></Td>
                      <Td><SkeletonLine $width="40%" $height="16px" /></Td>
                      <Td><SkeletonLine $width="20%" $height="14px" /></Td>
                      <Td><SkeletonLine $width="30%" $height="14px" /></Td>
                      <Td><SkeletonLine $width="20%" $height="14px" style={{ marginLeft: 'auto' }} /></Td>
                    </SkeletonTableRow>
                  ))
                ) : paginatedSubcategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center', color: '#6b7280' }}>
                      <FolderOpen size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>No Subcategories Found</div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>Add a subcategory to get started with nesting product tags.</div>
                    </td>
                  </tr>
                ) : (
                  paginatedSubcategories.map(s => {
                    const isSelected = selectedIds.includes(s.id);
                    const prodCount = getProductCount(s.id);

                    return (
                      <Tr key={s.id} $selected={isSelected}>
                        <Td>
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedIds(prev => 
                                isSelected ? prev.filter(id => id !== s.id) : [...prev, s.id]
                              );
                            }}
                            style={{ cursor: 'pointer' }}
                          />
                        </Td>
                        <Td>
                          <SubcategoryNameCell>
                            <SubcategoryIcon>
                              {s.image ? <img src={s.image} alt={s.name} /> : <FolderOpen size={15} />}
                            </SubcategoryIcon>
                            <SubcategoryTextGroup>
                              {editingId === s.id ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <InlineInput 
                                    value={inlineValue}
                                    onChange={e => setInlineValue(e.target.value)}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') handleSaveInlineRename(s.id);
                                      if (e.key === 'Escape') setEditingId(null);
                                    }}
                                    autoFocus
                                  />
                                  <SecondaryBtn 
                                    style={{ padding: 0, width: 28, height: 28, borderRadius: 6, border: 'none', background: '#e6fffa' }}
                                    onClick={() => handleSaveInlineRename(s.id)}
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
                                <SubcategoryTitle 
                                  onDoubleClick={() => {
                                    setEditingId(s.id);
                                    setInlineValue(s.name);
                                  }}
                                >
                                  {s.name}
                                </SubcategoryTitle>
                              )}
                              <SubcategoryDescription>ID: {s.id}</SubcategoryDescription>
                            </SubcategoryTextGroup>
                          </SubcategoryNameCell>
                        </Td>
                        <Td>
                          <span onClick={() => handleToggleActive(s)} style={{ cursor: 'pointer' }}>
                            {s.isActive ? (
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
                          <span style={{ color: '#4b5563', fontWeight: 600 }}>{prodCount} products</span>
                        </Td>
                        <Td style={{ textAlign: 'right' }}>
                          <DropdownWrapper ref={activeDropdownId === s.id ? dropdownRef : null}>
                            <SecondaryBtn 
                              onClick={() => setActiveDropdownId(activeDropdownId === s.id ? null : s.id)}
                              style={{ padding: 0, width: 32, height: 32, borderRadius: 8, display: 'inline-flex', justifyContent: 'center' }}
                            >
                              <MoreVertical size={14} />
                            </SecondaryBtn>
                            {activeDropdownId === s.id && (
                              <DropdownMenu>
                                <DropdownItem onClick={() => {
                                  setActiveDropdownId(null);
                                  setEditTarget(s);
                                  setModalOpen(true);
                                }}>
                                  <Pencil size={13} /> Edit Subcategory
                                </DropdownItem>
                                <DropdownItem onClick={() => {
                                  setActiveDropdownId(null);
                                  handleDuplicateSubcategory(s);
                                }}>
                                  <Copy size={13} /> Duplicate Item
                                </DropdownItem>
                                <DropdownItem onClick={() => {
                                  setActiveDropdownId(null);
                                  handleToggleActive(s);
                                }}>
                                  <Archive size={13} /> {s.isActive ? 'Deactivate' : 'Activate'}
                                </DropdownItem>
                                <DropdownItem 
                                  $danger
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    setDeleteConfirmId(s.id);
                                  }}
                                >
                                  <Trash2 size={13} /> Delete Item
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
            {store.subcategoriesStatus === 'FETCHING' ? (
              Array.from({ length: 2 }).map((_, idx) => (
                <MobileCard key={idx}>
                  <SkeletonLine $width="50%" $height="16px" />
                  <SkeletonLine $width="30%" $height="14px" />
                </MobileCard>
              ))
            ) : paginatedSubcategories.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                No subcategories found.
              </div>
            ) : (
              paginatedSubcategories.map(s => {
                const prodCount = getProductCount(s.id);

                return (
                  <MobileCard key={s.id}>
                    <MobileCardHeader>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <SubcategoryIcon>
                          {s.image ? <img src={s.image} alt={s.name} /> : <FolderOpen size={14} />}
                        </SubcategoryIcon>
                        <div>
                          <span style={{ fontWeight: 600, color: '#111827' }}>{s.name}</span>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>ID: {s.id}</div>
                        </div>
                      </div>
                      <span onClick={() => handleToggleActive(s)}>
                        {s.isActive ? (
                          <span style={{ background: '#ecfdf5', color: '#065f46', fontSize: 11, padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>Active</span>
                        ) : (
                          <span style={{ background: '#f3f4f6', color: '#374151', fontSize: 11, padding: '2px 8px', borderRadius: 12, fontWeight: 500 }}>Inactive</span>
                        )}
                      </span>
                    </MobileCardHeader>
                    <MobileCardBody>
                      <MobileCardRow>
                        <MobileCardLabel>Linked Products</MobileCardLabel>
                        <MobileCardValue>{prodCount} items</MobileCardValue>
                      </MobileCardRow>
                    </MobileCardBody>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <SecondaryBtn 
                        style={{ height: 30, fontSize: 11, padding: '0 10px' }}
                        onClick={() => { setEditTarget(s); setModalOpen(true); }}
                      >
                        Edit
                      </SecondaryBtn>
                      <SecondaryBtn 
                        style={{ height: 30, fontSize: 11, padding: '0 8px', background: '#fef2f2', color: '#dc2626', borderColor: '#fee2e2' }}
                        onClick={() => setDeleteConfirmId(s.id)}
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
              Showing <b>{processedSubcategories.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</b> to <b>{Math.min(currentPage * pageSize, processedSubcategories.length)}</b> of <b>{processedSubcategories.length}</b> subcategories
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
          categoryId={categoryId}
          mode="subcategory"
        />

        {/* Safety Confirm Dialog */}
        {deleteConfirmId && (
          <SafetyOverlay>
            <SafetyCard>
              <SafetyHeader>
                <ShieldAlert size={22} />
                <SafetyTitle>Confirm Subcategory Deletion</SafetyTitle>
              </SafetyHeader>
              <SafetyDesc>
                Are you sure you want to delete this subcategory? This action will permanently remove this record from catalog structures. This action is irreversible.
              </SafetyDesc>
              <SafetyActions>
                <SecondaryBtn style={{ height: 36 }} onClick={() => setDeleteConfirmId(null)}>
                  Cancel
                </SecondaryBtn>
                <SecondaryBtn 
                  style={{ height: 36, background: '#dc2626', color: 'white', border: 'none', fontWeight: 600 }}
                  onClick={() => handleDeleteSubcategory(deleteConfirmId)}
                >
                  Delete Item
                </SecondaryBtn>
              </SafetyActions>
            </SafetyCard>
          </SafetyOverlay>
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

export const SubcategoriesRoute = observer(SubcategoriesRouteComponent);
