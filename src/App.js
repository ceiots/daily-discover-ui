import React from 'react';
import { ThemeProvider } from 'styled-components';  
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';
import { AuthProvider } from './hooks/useAuth';     
import tokens from './theme/tokens';
import GlobalStyles from './theme/GlobalStyles';    

function App() {
  return (
    <ThemeProvider theme={tokens}>
      <GlobalStyles />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
        }}
      />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;