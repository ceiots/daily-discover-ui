import React, { useState } from 'react';
import { useLoginPage } from '../../pages/account/useLoginPage';
import { 
  FormContainer, 
  InputGroup, 
  BorderlessInput, 
  FloatingLabel, 
  FocusBorder,
  CompactButton,
  ButtonsContainer
} from '../../theme/components/auth/AuthComponents';

function LoginForm() {
  const { isLoading, formData, handleChange, handleSubmit } = useLoginPage();
  const [focusedField, setFocusedField] = useState(null);
  
  const isFieldActive = (field) => focusedField === field || formData[field];

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputGroup>
        <FloatingLabel 
          htmlFor="email" 
          $isActive={isFieldActive('email')}
        >
          邮箱
        </FloatingLabel>
        <BorderlessInput 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email}
          onChange={handleChange}
          required 
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
        />
        <FocusBorder />
      </InputGroup>
      
      <InputGroup>
        <FloatingLabel 
          htmlFor="password" 
          $isActive={isFieldActive('password')}
        >
          密码
        </FloatingLabel>
        <BorderlessInput 
          type="password" 
          id="password" 
          name="password" 
          value={formData.password}
          onChange={handleChange}
          required 
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
        />
        <FocusBorder />
      </InputGroup>
      
      <ButtonsContainer>
        <CompactButton 
          type="submit" 
          disabled={isLoading}
          $pill
        >
          {isLoading ? '登录中...' : '登录'}
        </CompactButton>
      </ButtonsContainer>
    </FormContainer>
  );
}

export default LoginForm; 