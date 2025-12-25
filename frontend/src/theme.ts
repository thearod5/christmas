import { createTheme } from '@mantine/core';

// Font constant - change this to easily update the font throughout the app
export const APP_FONT = 'Roboto, sans-serif';

// Beige color scheme
const beigeColors = [
  '#f9f6f2',  // Lightest beige
  '#f4ede4',  // Very light beige
  '#ebe2d6',  // Light beige
  '#e0d4c4',  // Soft beige
  '#d5c5b0',  // Medium beige
  '#c9b69c',  // Warm beige
  '#bda688',  // Rich beige
  '#a88f6f',  // Deep beige
  '#8e7559',  // Dark beige
  '#6e5b45',  // Darkest beige
] as const;

export const theme = createTheme({
  fontFamily: APP_FONT,
  headings: {
    fontFamily: APP_FONT,
  },
  primaryColor: 'beige',
  colors: {
    beige: beigeColors,
  },
  defaultRadius: 'md',
  components: {
    Card: {
      defaultProps: {
        shadow: 'sm',
        padding: 'lg',
        radius: 'md',
      },
    },
  },
});
