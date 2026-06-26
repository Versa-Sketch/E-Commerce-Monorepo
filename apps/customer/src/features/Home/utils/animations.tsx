import React from 'react';
import { View } from 'react-native';
import { StaggeredItemProps } from '../types';

export const StaggeredItem = ({ children }: StaggeredItemProps) => {
  return <View>{children}</View>;
};

export const StaggeredSearchResult = ({ children }: StaggeredItemProps) => {
  return <View>{children}</View>;
};
