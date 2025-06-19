import React from 'react';
import { Link } from 'react-router-dom';
import * as S from './styles';

// --- Reusable Form Components ---

/**
 * A styled input field for forms.
 * @param {object} props - Component props.
 * @param {string} props.label - The label for the input.
 * @param {string} props.id - The id for the input and label association.
 * @param {string} props.error - The error message to display.
 * @param {object} props.rest - Any other props to pass to the input element.
 */
export const FormInput = ({ label, id, error, ...rest }) => (
  <S.FormGroup>
    {label && <S.Label htmlFor={id}>{label}</S.Label>}
    <S.Input id={id} {...rest} />
    {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
  </S.FormGroup>
);

/**
 * A styled primary button for form submission.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The content of the button.
 * @param {boolean} props.disabled - Whether the button is disabled.
 * @param {object} props.rest - Any other props to pass to the button element.
 */
export const SubmitButton = ({ children, disabled, ...rest }) => (
  <S.StyledFormButton $primary disabled={disabled} {...rest}>
    {children}
  </S.StyledFormButton>
);

/**
 * A component for forms that require a verification code input alongside a "send code" button.
 * @param {object} props - Component props.
 * @param {string} props.label - The label for the input.
 * @param {string} props.id - The id for the input.
 * @param {string} props.error - The error message to display.
 * @param {function} props.onSendCode - The function to call when the send code button is clicked.
 * @param {boolean} props.isSending - Whether the code is currently being sent.
 * @param {number} props.countdown - The countdown time for the send code button.
 * @param {object} props.inputProps - Props to pass to the input element.
 */
export const VerificationCodeInput = ({ label, id, error, onSendCode, isSending, countdown, inputProps }) => (
    <S.FormGroup>
        {label && <S.Label htmlFor={id}>{label}</S.Label>}
        <S.VerificationCodeWrapper>
            <S.Input id={id} {...inputProps} />
            <S.StyledFormButton onClick={onSendCode} disabled={isSending} type="button">
                {isSending ? (countdown > 0 ? `${countdown}s 后重发` : '发送中...') : '发送验证码'}
            </S.StyledFormButton>
        </S.VerificationCodeWrapper>
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
    </S.FormGroup>
);


/**
 * A styled container for social login buttons.
 */
export const SocialLogin = ({ onWeChatLogin }) => (
    <>
        <S.Divider>或</S.Divider>
        <S.SocialLoginWrapper>
            <S.WeChatButton onClick={onWeChatLogin} type="button">
                使用微信登陆
            </S.WeChatButton>
        </S.SocialLoginWrapper>
    </>
);

/**
 * A link for alternate actions, like navigating to the login page from the register page.
 * @param {object} props - Component props.
 * @param {string} props.text - The introductory text.
 * @param {string} props.linkText - The text for the link.
 * @param {string} props.to - The path for the link.
 */
export const AlternateAuthAction = ({ text, linkText, to }) => (
  <S.AlternateAction>
    {text} <Link to={to}>{linkText}</Link>
  </S.AlternateAction>
); 