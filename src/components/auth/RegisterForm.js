import React, { useState } from 'react';
import { useRegisterPage } from '../../pages/account/useRegisterPage';
import { 
  FormContainer, 
  InputGroup, 
  BorderlessInput, 
  FloatingLabel, 
  FocusBorder,
  CompactButton,
  ButtonsContainer,
  VerificationCodeWrapper,
  CompactCodeButton
} from '../../theme/components/auth/AuthComponents';

function RegisterForm() {
  const { 
    isLoading, 
    isSendingCode, 
    countdown, 
    formData, 
    handleChange, 
    handleSubmit, 
    handleSendCode 
  } = useRegisterPage();
  
  const [focusedField, setFocusedField] = useState(null);
  
  const isFieldActive = (field) => focusedField === field || formData[field];

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputGroup>
        <FloatingLabel 
          htmlFor="username" 
          $isActive={isFieldActive('username')}
        >
          用户名
        </FloatingLabel>
        <BorderlessInput 
          type="text" 
          id="username" 
          name="username"
          value={formData.username}
          onChange={handleChange}
          required 
          onFocus={() => setFocusedField('username')}
          onBlur={() => setFocusedField(null)}
          autoComplete="username"
        />
        <FocusBorder />
      </InputGroup>
      
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
          autoComplete="email"
        />
        <FocusBorder />
      </InputGroup>
      
      <InputGroup>
        <FloatingLabel 
          htmlFor="code" 
          $isActive={isFieldActive('code')}
        >
          验证码
        </FloatingLabel>
        <VerificationCodeWrapper>
          <BorderlessInput 
            type="text" 
            id="code" 
            name="code" 
            value={formData.code}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
            onFocus={() => setFocusedField('code')}
            onBlur={() => setFocusedField(null)}
            autoComplete="off"
          />
          <CompactCodeButton 
            type="button" 
            onClick={handleSendCode} 
            disabled={isSendingCode || countdown > 0}
          >
            {isSendingCode ? '发送中...' : (countdown > 0 ? `${countdown}s` : '发送验证码')}
          </CompactCodeButton>
        </VerificationCodeWrapper>
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
          autoComplete="new-password"
        />
        <FocusBorder />
      </InputGroup>
      
      <InputGroup>
        <FloatingLabel 
          htmlFor="confirmPassword" 
          $isActive={isFieldActive('confirmPassword')}
        >
          确认密码
        </FloatingLabel>
        <BorderlessInput 
          type="password" 
          id="confirmPassword" 
          name="confirmPassword" 
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          onFocus={() => setFocusedField('confirmPassword')}
          onBlur={() => setFocusedField(null)}
          autoComplete="new-password"
        />
        <FocusBorder />
      </InputGroup>
      
      <ButtonsContainer>
        <CompactButton 
          type="submit" 
          disabled={isLoading}
          $pill
        >
          {isLoading ? '创建中...' : '创建账户'}
        </CompactButton>
      </ButtonsContainer>
    </FormContainer>
  );
}

export default RegisterForm; 