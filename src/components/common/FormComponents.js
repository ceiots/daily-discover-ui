import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/tokens';

/**
 * 输入框组件
 */
export const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.error ? theme.colors.error : theme.colors.neutral[300]};
  background-color: ${theme.colors.neutral[50]};
  font-size: 15px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 2px rgba(91, 71, 232, 0.1);
  }
  
  &:disabled {
    background-color: ${theme.colors.neutral[100]};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${theme.colors.neutral[400]};
  }
`;

/**
 * 文本组件
 */
export const Typography = {
  H1: styled.h1`
    font-size: 24px;
    font-weight: 600;
    color: ${props => props.color || theme.colors.neutral[800]};
    margin-bottom: ${props => props.mb || '16px'};
  `,
  H2: styled.h2`
    font-size: 20px;
    font-weight: 600;
    color: ${props => props.color || theme.colors.neutral[800]};
    margin-bottom: ${props => props.mb || '12px'};
  `,
  H3: styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.color || theme.colors.neutral[800]};
    margin-bottom: ${props => props.mb || '8px'};
  `,
  Body: styled.p`
    font-size: 15px;
    color: ${props => props.color || theme.colors.neutral[700]};
    margin-bottom: ${props => props.mb || '8px'};
  `,
  Small: styled.p`
    font-size: 13px;
    color: ${props => props.color || theme.colors.neutral[500]};
    margin-bottom: ${props => props.mb || '4px'};
  `,
  Label: styled.label`
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: ${props => props.color || theme.colors.neutral[700]};
    margin-bottom: 6px;
  `
};

/**
 * 选择框组件
 */
export const Select = styled.select`
  width: 100%;
  height: 42px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.error ? theme.colors.error : theme.colors.neutral[300]};
  background-color: ${theme.colors.neutral[50]};
  font-size: 15px;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 2px rgba(91, 71, 232, 0.1);
  }
  
  &:disabled {
    background-color: ${theme.colors.neutral[100]};
    cursor: not-allowed;
  }
  
  option {
    font-size: 15px;
  }
`;

// 导出默认对象
export default {
  Input,
  Typography,
  Select
}; 