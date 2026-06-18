import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  AlertCircle,
  BarChart2,
  Box,
  Layers,
  Package,
  Pencil,
  Plus,
  PowerOff,
  Search,
  X,
} from 'lucide-react-native';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ViewToken,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedScreen } from '../../Common/components/AnimatedScreen';
import { BottomSheet } from '../../Common/components/BottomSheet';
import { useStores } from '../../Common/hooks/useStores';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../theme/colors';
import { ProductFormModal } from '../Components/ProductFormModal';
import type { ProductSummary } from '../types/domain';
import styles from './styles';

type StatusFilter = 'all' | 'active' | 'inactive';

const SEARCH_DEBOUNCE_MS = 400;

const TAB_BAR_CLEARANCE = (insetsBottom: number) =>
  Math.max(insetsBottom, 8) + 88;

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View style={[styles.skeletonCard, { opacity: pulse }]}>
      <View style={styles.skeletonImgCol}>
        <View style={[styles.skeletonBlock, { width: 76, height: 76, borderRadius: 16 }]} />
      </View>
      <View style={{ flex: 1, gap: 8, justifyContent: 'center' }}>
        <View style={[styles.skeletonBlock, { height: 15, width: '75%' }]} />
        <View style={[styles.skeletonBlock, { height: 11, width: '50%' }]} />
        <View style={[styles.skeletonBlock, { height: 11, width: '40%' }]} />
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
          <View style={[styles.skeletonBlock, { height: 22, width: 80, borderRadius: 99 }]} />
          <View style={[styles.skeletonBlock, { height: 22, width: 60, borderRadius: 99 }]} />
        </View>
      </View>
      <View style={{ gap: 8, justifyContent: 'center', paddingRight: 4 }}>
        <View style={[styles.skeletonBlock, { width: 30, height: 30, borderRadius: 10 }]} />
        <View style={[styles.skeletonBlock, { width: 30, height: 30, borderRadius: 10 }]} />
      </View>
    </Animated.View>
  );
}

// ── Status pill ───────────────────────────────────────────────────────────────
function StatusPill({ label, color, bg, dot }: { label: string; color: string; bg: string; dot?: boolean }) {
  return (
    <View style={[styles.statusPill, { backgroundColor: bg }]}>
      {dot && <View style={[styles.statusDot, { backgroundColor: color }]} />}
      <Text style={[styles.statusPillText, { color }]}>{label}</Text>
    </View>
  );
}

// ── Metric pill ───────────────────────────────────────────────────────────────
function MetricPill({ icon, label, color, bg }: { icon: React.ReactNode; label: string; color: string; bg: string }) {
  return (
    <View style={[styles.metricPill, { backgroundColor: bg }]}>
      {icon}
      <Text style={[styles.metricPillText, { color }]}>{label}</Text>
    </View>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
const ProductCard = observer(function ProductCard({
  product,
  onOpenActions,
  onQuickDeactivate,
}: {
  product: ProductSummary;
  onOpenActions: (p: ProductSummary) => void;
  onQuickDeactivate: (p: ProductSummary) => void;
}) {
  const swipeRef = useRef<Swipeable>(null);

  const isNew = product.variant_count === 1 && product.is_active;

  const accentColor = !product.is_active
    ? Colors.error
    : product.is_perishable
    ? Colors.warning
    : Colors.success;

  function renderRightActions() {
    return (
      <TouchableOpacity
        style={styles.swipeRight}
        onPress={() => {
          swipeRef.current?.close();
          onOpenActions(product);
        }}
        activeOpacity={0.85}
      >
        <Layers size={18} color="#fff" />
        <Text style={styles.swipeLabel}>More</Text>
      </TouchableOpacity>
    );
  }

  function renderLeftActions() {
    if (!product.is_active) return null;
    return (
      <TouchableOpacity
        style={styles.swipeLeft}
        onPress={() => {
          swipeRef.current?.close();
          onQuickDeactivate(product);
        }}
        activeOpacity={0.85}
      >
        <PowerOff size={18} color="#fff" />
        <Text style={styles.swipeLabel}>Deactivate</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      overshootFriction={8}
      friction={2}
    >
      <TouchableOpacity
        style={[
          styles.productCard,
          { borderLeftColor: accentColor },
          !product.is_active && styles.productCardInactive,
        ]}
        activeOpacity={0.78}
        onPress={() =>
          router.push({ pathname: '/products/[id]', params: { id: product.id } })
        }
      >
        {/* ── Left: image column ─────────────────────────────────────────── */}
        <View style={styles.productImgCol}>
          {product.image ? (
            <Image
              source={{ uri: product.image }}
              style={styles.productImg}
              contentFit="cover"
              transition={180}
            />
          ) : (
            <View style={[styles.productImg, styles.productImgPlaceholder]}>
              <Box size={28} color={Colors.border} />
            </View>
          )}
          {!product.is_active && (
            <View style={styles.inactiveChip}>
              <Text style={styles.inactiveChipText}>OFF</Text>
            </View>
          )}
        </View>

        {/* ── Center: info ───────────────────────────────────────────────── */}
        <View style={styles.productInfo}>
          {/* Name row */}
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>

          {/* Category path */}
          <Text style={styles.productCat} numberOfLines={1}>
            {product.category?.name}
            {product.subcategory ? ` › ${product.subcategory.name}` : ''}
          </Text>

          {/* Brand */}
          {product.brand ? (
            <Text style={styles.productBrand}>by {product.brand.name}</Text>
          ) : null}

          {/* Pills */}
          <View style={styles.pillsRow}>
            <MetricPill
              icon={<Package size={10} color={Colors.info} />}
              label={`${product.variant_count} ${product.variant_count === 1 ? 'Variant' : 'Variants'}`}
              color={Colors.info}
              bg={Colors.infoBg}
            />
            {product.is_active ? (
              <StatusPill label="Active" color={Colors.success} bg={Colors.successBg} dot />
            ) : (
              <StatusPill label="Inactive" color={Colors.error} bg={Colors.errorBg} dot />
            )}
            {isNew && (
              <StatusPill label="⚡ New" color={Colors.info} bg={Colors.infoBg} />
            )}
            {product.is_perishable && (
              <StatusPill label="🌿 Fresh" color={Colors.warning} bg={Colors.warningBg} />
            )}
          </View>
        </View>

        {/* ── Right: actions ─────────────────────────────────────────────── */}
        <View style={styles.cardActionsCol}>
          <TouchableOpacity
            style={styles.cardActionEdit}
            onPress={() => router.push({ pathname: '/products/[id]', params: { id: product.id } })}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Pencil size={13} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardActionMore}
            onPress={() => onOpenActions(product)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <BarChart2 size={13} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardActionMore}
            onPress={() => onOpenActions(product)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Layers size={13} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
});

// ── Main screen ───────────────────────────────────────────────────────────────
export default observer(function ProductsScreen() {
  const { productsStore } = useStores();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const [editProduct, setEditProduct] = useState<ProductSummary | null>(null);
  const [actionsFor, setActionsFor] = useState<ProductSummary | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState<ProductSummary | null>(null);

  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    void productsStore.fetchCategories();
  }, [productsStore]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void productsStore.fetchProducts({
        search: searchQuery.trim() || undefined,
        category_id: categoryFilter ?? undefined,
        is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [productsStore, searchQuery, statusFilter, categoryFilter]);

  function showToast(message: string, error = false) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, error });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const last = viewableItems[viewableItems.length - 1];
      if (last?.index != null && last.index >= productsStore.products.length - 2) {
        void productsStore.loadMoreProducts();
      }
    },
  ).current;

  async function handleDeactivate() {
    const target = confirmDeactivate;
    setConfirmDeactivate(null);
    if (!target) return;
    const result = await productsStore.deactivateProduct(target.id);
    showToast(result.message, !result.ok);
  }

  const isLoading = productsStore.listState === 'loading' && !productsStore.listFetched;
  const isError = productsStore.listState === 'error';
  const hasFilters = !!searchQuery.trim() || statusFilter !== 'all' || !!categoryFilter;

  const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All Products' },
    { key: 'active', label: '🟢 Active' },
    { key: 'inactive', label: '🔴 Inactive' },
  ];

  return (
    <AnimatedScreen style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Catalog</Text>
            <Text style={styles.headerSubtitle}>
              {productsStore.productsTotalCount} products · {productsStore.activeCount} active
            </Text>
          </View>
          <TouchableOpacity
            style={styles.headerAddButton}
            onPress={() => router.push('/products/create')}
            activeOpacity={0.85}
          >
            <Plus size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* ── Search ────────────────────────────────────────────────────── */}
        <View style={styles.searchBox}>
          <Search size={15} color={Colors.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products, brands, categories…"
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {toast ? (
        <View style={[styles.toastBanner, toast.error && styles.toastError]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      ) : null}

      {/* ── Filter chips ─────────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsRail}
        contentContainerStyle={styles.chipsScroll}
      >
        {STATUS_FILTERS.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.chip, statusFilter === key && styles.chipActive]}
            onPress={() => setStatusFilter(key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.chipText, statusFilter === key && styles.chipTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={styles.chipDivider} />
        {productsStore.categories
          .filter(cat => cat.is_active)
          .map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, categoryFilter === cat.id && styles.chipActive]}
              onPress={() => setCategoryFilter(categoryFilter === cat.id ? null : cat.id)}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipText, categoryFilter === cat.id && styles.chipTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      {/* ── List ─────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <View style={[styles.list, { paddingBottom: TAB_BAR_CLEARANCE(insets.bottom) + 70 }]}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : isError ? (
        <View style={[styles.list, { paddingBottom: TAB_BAR_CLEARANCE(insets.bottom) + 70 }]}>
          <View style={styles.stateWrap}>
            <View style={[styles.stateIcon, styles.stateIconError]}>
              <AlertCircle size={26} color={Colors.error} strokeWidth={1.8} />
            </View>
            <Text style={styles.stateTitle}>Couldn't load products</Text>
            <Text style={styles.stateSub}>{productsStore.listError}</Text>
            <Button label="Retry" onPress={() => void productsStore.fetchProducts()} />
          </View>
        </View>
      ) : (
        <FlatList
          data={productsStore.products}
          keyExtractor={p => p.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onOpenActions={setActionsFor}
              onQuickDeactivate={setConfirmDeactivate}
            />
          )}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: TAB_BAR_CLEARANCE(insets.bottom) + 70 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={productsStore.listState === 'loading' && productsStore.listFetched}
              onRefresh={() => void productsStore.fetchProducts()}
              tintColor={Colors.primary}
            />
          }
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          ListEmptyComponent={
            <View style={styles.stateWrap}>
              <View style={styles.stateIcon}>
                <Package size={26} color={Colors.primary} strokeWidth={1.5} />
              </View>
              <Text style={styles.stateTitle}>
                {hasFilters ? 'No products found' : 'Build your catalog'}
              </Text>
              <Text style={styles.stateSub}>
                {hasFilters
                  ? 'Try a different search or filter.'
                  : 'Add your first product to start selling.'}
              </Text>
              {!hasFilters ? (
                <Button label="Add your first product" onPress={() => router.push('/products/create')} />
              ) : null}
            </View>
          }
          ListFooterComponent={
            productsStore.loadingMore ? (
              <View style={styles.loadMoreRow}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : null
          }
        />
      )}

      {/* ── FAB ──────────────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={[styles.fab, { bottom: TAB_BAR_CLEARANCE(insets.bottom) }]}
        onPress={() => router.push('/products/create')}
        activeOpacity={0.85}
      >
        <Plus size={24} color={Colors.white} />
      </TouchableOpacity>

      {/* ── Actions bottom sheet ─────────────────────────────────────────── */}
      <BottomSheet
        isVisible={actionsFor !== null}
        onClose={() => setActionsFor(null)}
        title={actionsFor?.name ?? 'Product actions'}
        height={0.44}
      >
        <View style={styles.sheetContent}>
          {[
            {
              icon: <Pencil size={18} color={Colors.textPrimary} />,
              label: 'Edit product',
              sub: 'Update name, description, images',
              onPress: () => { setEditProduct(actionsFor); setActionsFor(null); },
            },
            {
              icon: <Package size={18} color={Colors.textPrimary} />,
              label: 'Manage variants',
              sub: 'Prices, stock, SKUs',
              onPress: () => {
                const id = actionsFor?.id;
                setActionsFor(null);
                if (id) router.push({ pathname: '/products/[id]', params: { id } });
              },
            },
            {
              icon: <BarChart2 size={18} color={Colors.textPrimary} />,
              label: 'View analytics',
              sub: 'Sales, views, conversion',
              onPress: () => { setActionsFor(null); router.push('/analytics' as any); },
            },
          ].map(({ icon, label, sub, onPress }) => (
            <TouchableOpacity key={label} style={styles.actionRow} onPress={onPress}>
              <View style={styles.actionRowIcon}>{icon}</View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionRowText}>{label}</Text>
                <Text style={styles.actionRowSub}>{sub}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {actionsFor?.is_active ? (
            <TouchableOpacity
              style={[styles.actionRow, { borderBottomWidth: 0 }]}
              onPress={() => { setConfirmDeactivate(actionsFor); setActionsFor(null); }}
            >
              <View style={[styles.actionRowIcon, { backgroundColor: Colors.errorBg }]}>
                <PowerOff size={18} color={Colors.error} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionRowText, styles.actionRowDanger]}>Deactivate</Text>
                <Text style={styles.actionRowSub}>Hide from catalog</Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </BottomSheet>

      {/* ── Deactivation confirm ─────────────────────────────────────────── */}
      <BottomSheet
        isVisible={confirmDeactivate !== null}
        onClose={() => setConfirmDeactivate(null)}
        title="Deactivate product?"
        height={0.32}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.confirmText}>
            "{confirmDeactivate?.name}" will be hidden from your catalog and customers. You can reactivate it later.
          </Text>
          <View style={styles.confirmActions}>
            <Button label="Cancel" variant="outline" onPress={() => setConfirmDeactivate(null)} style={{ flex: 1 }} />
            <Button label="Deactivate" variant="danger" loading={productsStore.saving} onPress={() => void handleDeactivate()} style={{ flex: 1 }} />
          </View>
        </View>
      </BottomSheet>

      <ProductFormModal
        visible={editProduct !== null}
        mode="edit"
        product={editProduct}
        onClose={() => setEditProduct(null)}
        onSuccess={msg => showToast(msg)}
      />
    </AnimatedScreen>
  );
});
