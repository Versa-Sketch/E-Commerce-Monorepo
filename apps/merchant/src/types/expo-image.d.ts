declare module 'expo-image' {
  import { ImageProps } from 'react-native';
  import { Component } from 'react';

  export class Image extends Component<ImageProps & {
    source?: any;
    placeholder?: any;
    transition?: any;
    priority?: any;
    cachePolicy?: any;
    contentFit?: any;
    contentPosition?: any;
    autoplay?: boolean;
  }> {}
}
