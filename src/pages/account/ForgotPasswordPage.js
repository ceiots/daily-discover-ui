import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../services/http/instance";
import { BasePage } from "../../theme";
import styled from "styled-components";
import { UI_COLORS, UI_SIZES, UI_SHADOWS } from "../../theme/styles/uiConstants";
import validators from '../../utils/validators';
import {
  FormContainer,
  FormFrame,
  FormGroup,
  FormLabel,
  FormInput,
  FormSubmitButton,
  FormErrorMessage,
  FormInputGroup,
  FormCodeButton,
  FormBottomLink,
  FormFooterText,
  FormEyeIcon,
  FormTitle,
  FormBrandLogo,
  showToast
} from "../../theme/components";

// 定制样式组件
const ForgotPasswordContainer = styled.div`
  background-color: ${UI_COLORS.BG_LIGHT};
  min-height: calc(100vh - 54px);
  overflow-y: auto;
  max-height: calc(100vh - 54px);
`;

const ForgotPasswordFormContainer = styled(FormContainer)`
  padding-top: 12px;
  background-color: transparent;
  min-height: auto;
`;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [animateCard, setAnimateCard] = useState(false);
  
  const [formData, setFormData] = useState({
    mobile: "",
    newPassword: "",
    confirmPassword: "",
    code: "",
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: 手机验证, 2: 设置新密码

  useEffect(() => {
    setAnimateCard(true);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGetVerificationCode = async () => {
    if (!formData.mobile) {
      setErrors({ ...errors, mobile: "请输入手机号" });
      return;
    }
    
    if (!validators.isValidPhoneNumber(formData.mobile)) {
      setErrors({ ...errors, mobile: "请输入正确的手机号格式" });
      return;
    }
    
    try {
      const response = await instance.post("/users/password/reset", {
        mobile: formData.mobile
      });
      
      if (response.data.code === 200) {
        showToast("验证码已发送，请查收短信");
        setCountdown(60);
      } else {
        showToast(response.data.message || "获取验证码失败");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "获取验证码失败，请稍后重试");
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.mobile) {
      newErrors.mobile = "请输入手机号";
    } else if (!validators.isValidPhoneNumber(formData.mobile)) {
      newErrors.mobile = "请输入正确的手机号格式";
    }
    
    if (!formData.code) {
      newErrors.code = "请输入验证码";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!validators.isNotEmpty(formData.newPassword)) {
      newErrors.newPassword = "请输入新密码";
    } else if (!validators.isValidPassword(formData.newPassword)) {
      newErrors.newPassword = "密码长度至少为8位，且需包含数字和字母";
    }
    
    if (!validators.isNotEmpty(formData.confirmPassword)) {
      newErrors.confirmPassword = "请确认密码";
    } else if (!validators.isEqual(formData.newPassword, formData.confirmPassword)) {
      newErrors.confirmPassword = "两次输入的密码不一致";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await instance.post("/users/password/reset", {
        mobile: formData.mobile,
        code: formData.code,
        password: formData.newPassword
      });
      
      if (response.data.code === 200) {
        showToast("密码重置成功，请使用新密码登录");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        showToast(response.data.message || "重置密码失败");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "重置密码失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasePage padding={false} showHeader={false}>
      <ForgotPasswordContainer>
        <FormFrame style={{ 
          opacity: animateCard ? 1 : 0,
          transform: animateCard ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.4s ease-out",
          borderRadius: UI_SIZES.BORDER_RADIUS_LARGE,
          boxShadow: UI_SHADOWS.CARD
        }}>
          <ForgotPasswordFormContainer>
            <FormBrandLogo />
            <FormTitle>{step === 1 ? "找回密码" : "设置新密码"}</FormTitle>
            
            {step === 1 ? (
              <form onSubmit={handleVerifyCode}>
                <FormGroup style={{ marginBottom: UI_SIZES.FORM_GROUP_SPACING }}>
                  <FormLabel style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_SMALL }}>手机号</FormLabel>
                  <FormInput
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="请输入手机号"
                    $error={!!errors.mobile}
                  />
                  {errors.mobile && <FormErrorMessage>{errors.mobile}</FormErrorMessage>}
                </FormGroup>
                
                <FormGroup style={{ marginBottom: UI_SIZES.FORM_GROUP_SPACING }}>
                  <FormLabel style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_SMALL }}>验证码</FormLabel>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <FormInput
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="请输入验证码"
                      style={{ flex: 1 }}
                      $error={!!errors.code}
                    />
                    <FormCodeButton onClick={handleGetVerificationCode} disabled={countdown > 0}>
                      {countdown > 0 ? `${countdown}秒` : "获取验证码"}
                    </FormCodeButton>
                  </div>
                  {errors.code && <FormErrorMessage>{errors.code}</FormErrorMessage>}
                </FormGroup>
                
                <FormSubmitButton type="submit">
                  下一步
                </FormSubmitButton>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <FormGroup style={{ marginBottom: UI_SIZES.FORM_GROUP_SPACING }}>
                  <FormLabel style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_SMALL }}>设置新密码</FormLabel>
                  <FormInputGroup>
                    <FormInput
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="请设置新密码"
                      $error={!!errors.newPassword}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label={showNewPassword ? "隐藏密码" : "显示密码"}
                    >
                      <FormEyeIcon closed={!showNewPassword} />
                    </button>
                  </FormInputGroup>
                  {errors.newPassword && <FormErrorMessage>{errors.newPassword}</FormErrorMessage>}
                </FormGroup>
                
                <FormGroup style={{ marginBottom: UI_SIZES.FORM_GROUP_SPACING }}>
                  <FormLabel style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_SMALL }}>确认新密码</FormLabel>
                  <FormInputGroup>
                    <FormInput
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="请再次输入新密码"
                      $error={!!errors.confirmPassword}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "隐藏密码" : "显示密码"}
                    >
                      <FormEyeIcon closed={!showConfirmPassword} />
                    </button>
                  </FormInputGroup>
                  {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>}
                </FormGroup>
                
                <FormSubmitButton type="submit" disabled={loading}>
                  {loading ? "处理中..." : "重置密码"}
                </FormSubmitButton>
              </form>
            )}
            
            <FormBottomLink>
              <Link to="/login">返回登录</Link>
            </FormBottomLink>
            
            <FormFooterText>
              Copyright © {new Date().getFullYear()} All Rights Reserved
            </FormFooterText>
          </ForgotPasswordFormContainer>
        </FormFrame>
      </ForgotPasswordContainer>
    </BasePage>
  );
};

export default ForgotPasswordPage;
