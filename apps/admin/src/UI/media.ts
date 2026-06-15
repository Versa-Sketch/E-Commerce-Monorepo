import { css } from 'styled-components';
import { theme } from './theme';

// Usage: ${media.tablet`grid-template-columns: 1fr;`}
const make = (breakpoint: string) => (...args: Parameters<typeof css>) => css`
  @media (max-width: ${breakpoint}) {
    ${css(...args)}
  }
`;

export const media = {
  mobile: make(theme.breakpoints.mobile),
  tablet: make(theme.breakpoints.tablet),
  laptop: make(theme.breakpoints.laptop),
  desktop: make(theme.breakpoints.desktop),
};
