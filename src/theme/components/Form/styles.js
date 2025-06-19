import styled, { css } from 'styled-components';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background};
  position: relative;
`;

export const FormWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  padding: ${({ theme }) => theme.spacing['3xl']};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};
`;

export const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-family: ${({ theme }) => theme.typography.fontFamilyHeading};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  color: ${({ theme }) => theme.colors.textMain};
  font-weight: 600;
`;

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: 500;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textMain};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: ${({ theme }) => theme.typography.fontFamilyBase};
  transition: all ${({ theme }) => theme.animations.fast};
  background-color: ${({ theme }) => theme.colors.white};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSub};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.state.focus};
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

export const VerificationCodeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const StyledFormButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-family: ${({ theme }) => theme.typography.fontFamilyBase};
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.fast};
  margin-top: ${({ theme }) => theme.spacing.xl};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.state.disabled};
    cursor: not-allowed;
  }
`;

export const SendCodeButton = styled.button`
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.fast};
  min-width: 120px;
  text-align: center;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.state.focus};
  }

  &:disabled {
    border-color: ${({ theme }) => theme.colors.neutral[300]};
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
`;

export const Divider = styled.div`
  text-align: center;
  margin: ${({ theme }) => theme.spacing.xl} 0;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.border};
  }
  
  &::before {
    left: 0;
  }
  
  &::after {
    right: 0;
  }
`;

export const SocialLoginWrapper = styled.div`
  text-align: center;
`;

export const WeChatButton = styled(StyledFormButton)`
  background-color: #07C160; /* WeChat Green */
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: #06AD56; /* Darker shade for hover */
  }

  /* 简单的微信图标 */
  &::before {
    content: '\\f1d7'; /* Font Awesome WeChat icon unicode */
    font-family: 'Font Awesome 5 Brands';
    margin-right: 8px;
    font-size: 1.2rem;
  }
`;

export const AlternateAction = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSub};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin-top: ${({ theme }) => theme.spacing.xs};
  text-align: left;
  min-height: 16px; /* 避免布局晃动 */
`;

export const HeaderBar = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const HeaderTitle = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin: 0;
`; 