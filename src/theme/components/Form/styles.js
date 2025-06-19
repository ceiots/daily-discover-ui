import styled, { css } from 'styled-components';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background};
  background-image: url('https://images.unsplash.com/photo-1549887552-cb107269b520');
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(3px);
    z-index: 0;
  }
`;

export const FormWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

export const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-family: ${({ theme }) => theme.typography.fontFamilyHeading};
  font-size: ${({ theme }) => theme.typography.h2};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 400;
`;

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: 500;
  font-size: ${({ theme }) => theme.typography.fontSizeBase};
  color: ${({ theme }) => theme.colors.textMain};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => {
    console.log('Theme in Input component:', theme);
    return theme.components.input.padding;
  }};
  border: 1px solid #ccc;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.fontSizeBase};
  font-family: ${({ theme }) => theme.typography.fontFamilyBase};
  transition: all ${({ theme }) => theme.animations.fast};
  background-color: rgba(255, 255, 255, 0.8);

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.1);
  }
`;

export const VerificationCodeWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const StyledFormButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.components.button.padding};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme, $primary }) => ($primary ? theme.colors.primary : theme.colors.secondary)};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSizeLarge};
  font-family: ${({ theme }) => theme.typography.fontFamilyBase};
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.fast};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }

  ${({ secondary }) =>
    secondary &&
    css`
      background-color: ${({ theme }) => theme.colors.accent};
    `}
`;

export const Divider = styled.div`
  text-align: center;
  margin: ${({ theme }) => theme.spacing.lg} 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.fontSizeSmall};
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background-color: #e0e0e0;
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

export const SocialButton = styled(StyledFormButton)`
  background-color: #27ae60;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const AlternateAction = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSizeBase};

  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSizeSmall};
  margin-top: ${({ theme }) => theme.spacing.xs};
  text-align: left;
  min-height: 16px; /* 避免布局晃动 */
`; 