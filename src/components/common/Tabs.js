import React, { useState, createContext, useContext, useCallback } from 'react';
import styled from 'styled-components';

const TabsContext = createContext();

const StyledTabs = styled.div``;

const TabListWrapper = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.main};
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TabButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary.main : theme.colors.text.secondary)};
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.colors.primary.main : 'transparent')};
  margin-bottom: -1px; /* Align with the wrapper's border */
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const TabPanelWrapper = styled.div``;

// --- Components ---

export const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const changeTab = useCallback(newTab => {
    setActiveTab(newTab);
  }, []);

  return (
    <TabsContext.Provider value={{ activeTab, changeTab }}>
      <StyledTabs>{children}</StyledTabs>
    </TabsContext.Provider>
  );
};

export const TabList = ({ children }) => {
  return <TabListWrapper>{children}</TabListWrapper>;
};

export const Tab = ({ value, children }) => {
  const { activeTab, changeTab } = useContext(TabsContext);
  const active = activeTab === value;
  return (
    <TabButton $active={active} onClick={() => changeTab(value)}>
      {children}
    </TabButton>
  );
};

export const TabPanel = ({ value, children }) => {
  const { activeTab } = useContext(TabsContext);
  return activeTab === value ? <TabPanelWrapper>{children}</TabPanelWrapper> : null;
}; 