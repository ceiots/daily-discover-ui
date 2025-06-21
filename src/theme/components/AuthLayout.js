import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import {
  PageWrapper,
  MicroNavBar,
  Logo,
  NavLinks,
  AuthCard,
  FormTitle,
} from './AuthLayoutComponents';

/**
 * 认证页面统一布局组件
 * 
 * @param {Object} props 组件属性
 * @param {string} props.title 页面标题
 * @param {string} props.description 页面描述(SEO)
 * @param {string} props.formTitle 表单标题
 * @param {React.ReactNode} props.children 子组件内容
 * @returns {React.ReactElement} 认证页面布局
 */
const AuthLayout = ({
  title,
  description,
  formTitle,
  children
}) => {
  const location = useLocation();
  
  return (
    <>
      <Helmet>
        <title>{title} - Daily Discover</title>
        <meta name="description" content={description} />
      </Helmet>
      <PageWrapper key={location.pathname}>
        <MicroNavBar>
          <Logo>Daily <span>Discover</span></Logo>
          <NavLinks>
            <Link to="/daily" className={location.pathname === '/daily' ? 'active' : ''}>每日</Link>
            <Link to="/discover" className={location.pathname === '/discover' ? 'active' : ''}>发现</Link>
          </NavLinks>
        </MicroNavBar>
        
        <AuthCard>
          <FormTitle>{formTitle}</FormTitle>
          {children}
        </AuthCard>
      </PageWrapper>
    </>
  );
};

AuthLayout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  formTitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default AuthLayout;