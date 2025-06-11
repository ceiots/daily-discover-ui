import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme';
import SimpleThemeTest from './pages/SimpleThemeTest';
import ThemeShowcasePage from './pages/ThemeShowcasePage';

function SimpleApp() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<ThemeShowcasePage />} />
        <Route path="/simple-theme-test" element={<SimpleThemeTest />} />
        <Route path="/theme-showcase" element={<ThemeShowcasePage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default SimpleApp; 