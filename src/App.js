import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStyles from './theme/GlobalStyles';
import AppRoutes from './routes'; // This will be created next
import { AuthProvider } from './hooks/useAuth';
import { useMemo } from 'react';
import { themeSettings } from './theme/theme'; // Assuming theme settings are here

function App() {
  const theme = useMemo(() => createTheme(themeSettings), []);

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        {/* The Toaster component is for showing notifications, as per Rule #5 */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 5000,
          }}
        />
        {/* AppRoutes will contain all the routing logic */}
        <Router>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;