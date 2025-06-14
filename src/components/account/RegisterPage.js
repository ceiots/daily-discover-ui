import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import instance from "../../utils/axios";
import { BasePage, PageTitle } from "../../theme";
import styled from "styled-components";
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
  FormCheckboxContainer,
  FormCheckbox,
  FormCheckboxLabel,
  FormBottomLink,
  FormFooterText,
  validators,
  SimpleToast,
  showToast
} from "../../theme/components";
import { UI_COLORS, UI_SIZES, UI_BORDERS, UI_SHADOWS } from "../../theme/styles/uiConstants";

// 定制样式组件
const RegisterContainer = styled.div`
  background-color: ${UI_COLORS.BG_LIGHT};
  min-height: calc(100vh - 54px); // 54px是TopBar的高度
  overflow-y: auto; // 添加垂直滚动条
  max-height: calc(100vh - 54px); // 设置最大高度，防止溢出
`;

const RegisterFormContainer = styled(FormContainer)`
  padding-top: 12px;
  background-color: transparent;
  min-height: auto;
`;

const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    nickname: "",
    email: "",
    deviceId: "web",
    deviceType: 5,
    deviceModel: "browser",
    osVersion: navigator.userAgent,
    appVersion: "1.0.0",
    code: "",
    codeType: 1
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.mobile) {
      newErrors.phoneNumber = "请输入手机号";
    } else if (!validators.isValidPhoneNumber(formData.mobile)) {
      newErrors.phoneNumber = "请输入正确的手机号格式";
    }

    if (!formData.password) {
      newErrors.password = "请输入密码";
    } else if (!validators.isValidPassword(formData.password)) {
      newErrors.password = "密码长度至少为8个字符，且必须包含数字和字母";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "请确认密码";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致";
    }

    if (!agreeToTerms) {
      newErrors.terms = "请阅读并同意用户协议和隐私政策";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await instance.post("/users/register", formData);
      if (response.data.code === 200) {
        showToast("注册成功");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        showToast(response.data.message || "注册失败");
      }
    } catch (error) {
      console.error("注册错误:", error);
      showToast(error.response?.data?.message || "注册失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleGetCode = () => {
    if (!formData.mobile) {
      setErrors({...errors, phoneNumber: "请先输入手机号"});
      return;
    }
    
    if (!validators.isValidPhoneNumber(formData.mobile)) {
      setErrors({...errors, phoneNumber: "请输入正确的手机号格式"});
      return;
    }
    
    // 这里添加获取验证码逻辑
    showToast("验证码已发送");
    setCountdown(60);
  };

  return (
    <BasePage padding={false} showHeader={false}>
      <PageTitle title="注册账号" />
      <RegisterContainer>
        <RegisterFormContainer>
          <FormFrame>
            <form onSubmit={handleSubmit}>
              <FormGroup style={{ marginBottom: UI_SIZES.FORM_GROUP_SPACING }}>
                <FormLabel style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_SMALL }}>请输入手机号码</FormLabel>
                <FormInput
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="请输入手机号码"
                  $error={!!errors.phoneNumber}
                  style={{
                    fontSize: UI_SIZES.FONT_MEDIUM,
                    padding: UI_SIZES.INPUT_SPACING,
                    borderColor: errors.phoneNumber ? UI_COLORS.ERROR : UI_COLORS.BORDER_LIGHT,
                    '&:focus': {
                      borderColor: UI_COLORS.PRIMARY,
                      outline: 'none'
                    }
                  }}
                  className="input-focus-effect"
                />
                {errors.phoneNumber && <FormErrorMessage style={{ color: UI_COLORS.ERROR }}>{errors.phoneNumber}</FormErrorMessage>}
              </FormGroup>
              
              <FormGroup style={{ marginBottom: UI_SIZES.FORM_GROUP_SPACING }}>
                <FormLabel style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_SMALL }}>请输入验证码</FormLabel>
                <FormInputGroup>
                  <FormInput
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="请输入验证码"
                    style={{
                      fontSize: UI_SIZES.FONT_MEDIUM,
                      padding: UI_SIZES.INPUT_SPACING,
                      borderColor: UI_COLORS.BORDER_LIGHT,
                      '&:focus': {
                        borderColor: UI_COLORS.PRIMARY,
                        outline: 'none'
                      }
                    }}
                    className="input-focus-effect"
                  />
                  <FormCodeButton 
                    type="button"
                    onClick={handleGetCode} 
                    disabled={countdown > 0}
                    className={countdown > 0 ? "" : "code-button-active"}
                  >
                    {countdown > 0 ? `${countdown}秒` : "获取验证码"}
                  </FormCodeButton>
                </FormInputGroup>
              </FormGroup>
              
              <FormGroup style={{ marginBottom: UI_SIZES.FORM_GROUP_SPACING }}>
                <FormLabel style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_SMALL }}>请设置登录密码</FormLabel>
                <FormInput
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="请设置登录密码"
                  $error={!!errors.password}
                  style={{
                    fontSize: UI_SIZES.FONT_MEDIUM,
                    padding: UI_SIZES.INPUT_SPACING,
                    borderColor: errors.password ? UI_COLORS.ERROR : UI_COLORS.BORDER_LIGHT,
                    '&:focus': {
                      borderColor: UI_COLORS.PRIMARY,
                      outline: 'none'
                    }
                  }}
                  className="input-focus-effect"
                />
                {errors.password && <FormErrorMessage style={{ color: UI_COLORS.ERROR }}>{errors.password}</FormErrorMessage>}
              </FormGroup>
              
              <FormGroup style={{ marginBottom: UI_SIZES.FORM_GROUP_SPACING }}>
                <FormLabel style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_SMALL }}>确认密码</FormLabel>
                <FormInput
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="请再次输入密码"
                  $error={!!errors.confirmPassword}
                  style={{
                    fontSize: UI_SIZES.FONT_MEDIUM,
                    padding: UI_SIZES.INPUT_SPACING,
                    borderColor: errors.confirmPassword ? UI_COLORS.ERROR : UI_COLORS.BORDER_LIGHT,
                    '&:focus': {
                      borderColor: UI_COLORS.PRIMARY,
                      outline: 'none'
                    }
                  }}
                  className="input-focus-effect"
                />
                {errors.confirmPassword && <FormErrorMessage style={{ color: UI_COLORS.ERROR }}>{errors.confirmPassword}</FormErrorMessage>}
              </FormGroup>
              
              <FormCheckboxContainer style={{ marginBottom: UI_SIZES.FORM_GROUP_SPACING }}>
                <FormCheckbox
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={() => setAgreeToTerms(!agreeToTerms)}
                  className="custom-checkbox"
                />
                <FormCheckboxLabel 
                  htmlFor="agreeToTerms" 
                  style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_SMALL }}
                >
                  我已阅读并同意 
                  <Link to="/terms" style={{ color: UI_COLORS.PRIMARY }}>《用户协议》</Link> 
                  和 
                  <Link to="/privacy" style={{ color: UI_COLORS.PRIMARY }}>《隐私政策》</Link>
                </FormCheckboxLabel>
              </FormCheckboxContainer>
              {errors.terms && <FormErrorMessage style={{ color: UI_COLORS.ERROR }}>{errors.terms}</FormErrorMessage>}
              
              <FormSubmitButton
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? "注册中..." : "注册"}
              </FormSubmitButton>

              <FormBottomLink style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_SMALL }}>
                已有账号？<Link to="/login" style={{ color: UI_COLORS.PRIMARY }}>立即登录</Link>
              </FormBottomLink>
            </form>
          </FormFrame>
          
          <FormFooterText style={{ color: UI_COLORS.TEXT_MEDIUM, fontSize: UI_SIZES.FONT_TINY }}>
            Daily Discover &copy; {new Date().getFullYear()} All Rights Reserved
          </FormFooterText>
        </RegisterFormContainer>
      </RegisterContainer>
      
      {/* 使用通用Toast组件 */}
      <SimpleToast id="toast" />
    </BasePage>
  );
};

export default RegisterPage;
