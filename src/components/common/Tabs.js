import React, { useState, createContext, useContext, useCallback } from 'react';
import styled from 'styled-components';

const TabsContext = createContext();

const StyledTabs = styled.div``;

const TabListWrapper = styled.div`
  border-bottom: 2px solid #E0E0E0;
  display: flex;
  margin-bottom: 24px;
`;

const TabButton = styled.button`
  padding: 12px 20px;
  font-size: 18px;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => (props.active ? '#5B47E8' : '#666666')};
  border-bottom: 2px solid ${props => (props.active ? '#5B47E8' : 'transparent')};
  margin-bottom: -2px; /* Align with the wrapper's border */
  transition: all 0.3s;

  &:hover {
    color: #5B47E8;
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
    <TabButton active={active} onClick={() => changeTab(value)}>
      {children}
    </TabButton>
  );
};

export const TabPanel = ({ value, children }) => {
  const { activeTab } = useContext(TabsContext);
  return activeTab === value ? <TabPanelWrapper>{children}</TabPanelWrapper> : null;
}; 