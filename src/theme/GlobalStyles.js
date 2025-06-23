import { createGlobalStyle } from 'styled-components';

/**
 * Global Styles
 * ---
 * Defines basic resets and base body styles for the entire application.
 * This component should be rendered once, directly inside the ThemeProvider.
 */
const GlobalStyles = createGlobalStyle`
  /* 1. Basic Reset */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* 2. Base Body Styles */
  body {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    background-color: ${({ theme }) => theme.colors.background.page};
    color: ${({ theme }) => theme.colors.text.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  }
  
  /* 3. Link Styles */
  a {
    color: ${({ theme }) => theme.colors.primary.main};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary.dark};
    }
  }

  /* 4. Remove list styles */
  ul, ol {
    list-style: none;
  }
`;

export default GlobalStyles; 