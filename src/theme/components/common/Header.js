import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  background-color: ${props => props.variant === 'primary' 
    ? props.theme.colors.primary.main 
    : props.theme.colors.background.container};
  color: ${props => props.variant === 'primary' 
    ? props.theme.colors.text.onPrimary 
    : props.theme.colors.text.primary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 10;
  box-sizing: border-box;
  padding-top: env(safe-area-inset-top);
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const LeftActions = styled(ActionsWrapper)`
  justify-content: flex-start;
`;

const RightActions = styled(ActionsWrapper)`
  justify-content: flex-end;
`;

const TitleWrapper = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const Header = ({ title, onBack, rightActions, variant = 'default' }) => {
  const navigate = useNavigate();

  const handleBack = onBack ? onBack : () => navigate(-1);

  return (
    <HeaderContainer variant={variant}>
      <LeftActions>
        {onBack !== null && (
          <BackButton onClick={handleBack}>
            <IoChevronBack />
          </BackButton>
        )}
      </LeftActions>
      <TitleWrapper>{title}</TitleWrapper>
      <RightActions>{rightActions}</RightActions>
    </HeaderContainer>
  );
};

export default Header; 