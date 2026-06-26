import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, Pressable, Text, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../theme/ThemeContext';
import { categoriesBottomSheetStyles } from './styledcomponents';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  image?: string;
}

interface CategoriesBottomSheetProps {
  sheetRef: React.RefObject<BottomSheetModal>;
  snapPoints: (string | number)[];
  categories: Category[];
  selectedCategory: string;
  isCloseBtnVisible: boolean;
  onCategorySelect: (categoryId: string) => void;
  onClose: () => void;
  renderBackdrop: (props: any) => React.ReactNode;
  onSheetChange?: (index: number) => void;
  onSheetAnimate?: (fromIndex: number, toIndex: number) => void;
}

export const CategoriesBottomSheet: React.FC<CategoriesBottomSheetProps> = ({
  sheetRef,
  snapPoints,
  categories,
  selectedCategory,
  isCloseBtnVisible,
  onCategorySelect,
  onClose,
  renderBackdrop,
  onSheetChange,
  onSheetAnimate,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // Calculate card width for 4 columns layout
  const cardWidth = (SCREEN_WIDTH - 40) / 4;

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop as any}
      enablePanDownToClose
      onChange={onSheetChange}
      onAnimate={onSheetAnimate}
      enableContentPanningGesture={false}
      enableOverDrag={false}
      backgroundStyle={{
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
      }}
      handleComponent={() => (
        <View style={categoriesBottomSheetStyles.customHandleContainer}>
          {isCloseBtnVisible && (
            <Pressable
              onPress={() => {
                onClose();
                sheetRef.current?.dismiss();
              }}
              style={categoriesBottomSheetStyles.floatingCloseBtn}
            >
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </Pressable>
          )}
          <View style={categoriesBottomSheetStyles.grabHandle} />
        </View>
      )}
    >
      {/* Header */}
      <View
        style={[
          categoriesBottomSheetStyles.sheetHeaderWrapper,
          { borderBottomColor: '#F3F4F6' },
        ]}
      >
        <Text
          style={[
            categoriesBottomSheetStyles.sheetTitle,
            {
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fonts.bold,
            },
          ]}
        >
          More Categories
        </Text>
      </View>

      {/* Grid Content */}
      <BottomSheetScrollView
        style={categoriesBottomSheetStyles.bottomSheetScrollView}
        contentContainerStyle={[
          categoriesBottomSheetStyles.bottomSheetScrollContent,
          { paddingBottom: 40 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={categoriesBottomSheetStyles.bottomSheetGrid}>
          {categories.map((item) => {
            const isSelected = selectedCategory === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  onCategorySelect(item.id);
                  onClose();
                  sheetRef.current?.dismiss();
                }}
                style={{
                  width: cardWidth,
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                {/* Category Image Container */}
                <View
                  style={[
                    categoriesBottomSheetStyles.bottomSheetImageContainer,
                    isSelected &&
                      categoriesBottomSheetStyles.categoryImageSelected,
                  ]}
                >
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={categoriesBottomSheetStyles.bottomSheetImage}
                    />
                  ) : (
                    <View
                      style={
                        categoriesBottomSheetStyles.fallbackIconContainer
                      }
                    >
                      <Ionicons
                        name="grid-outline"
                        size={24}
                        color={
                          isSelected
                            ? '#E11D48'
                            : theme.colors.textSecondary
                        }
                      />
                    </View>
                  )}
                </View>

                {/* Category Name */}
                <Text
                  numberOfLines={2}
                  style={[
                    categoriesBottomSheetStyles.bottomSheetText,
                    {
                      color: isSelected ? '#E11D48' : theme.colors.textPrimary,
                      fontFamily: isSelected
                        ? theme.typography.fonts.bold
                        : theme.typography.fonts.medium,
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default CategoriesBottomSheet;
