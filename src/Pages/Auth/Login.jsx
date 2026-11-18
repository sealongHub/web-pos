import React, { useState } from "react";
import { Form, Input, Checkbox, Button, Typography } from "antd";
import { UserOutlined, LockOutlined, SafetyOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import profileStore from "../../Store/profileStore";
import { request } from "../../util/request_fixed";

const { Text } = Typography;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500&display=swap');

  .sl-login-root {
    --bg: #0b0b0e;
    --surface: #111117;
    --border: #2a2a35;
    --border-hover: #4a4a60;
    --accent: #c8a96e;
    --accent-dim: rgba(200,169,110,0.15);
    --accent-glow: rgba(200,169,110,0.3);
    --text: #e8e8f0;
    --text-muted: #7a7a90;
    --error: #e06060;
    --input-bg: #0f0f14;
    --radius: 4px;
    min-height: 100vh; width: 100%;
    background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Jost', sans-serif;
    position: relative; overflow: hidden;
    padding: 24px; box-sizing: border-box;
  }

  .sl-login-root::before {
    content: ''; position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 15% 25%, rgba(200,169,110,0.05) 0%, transparent 70%),
      radial-gradient(ellipse 50% 60% at 85% 75%, rgba(100,80,180,0.04) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .sl-login-root::after {
    content: ''; position: fixed; inset: 0;
    background-image: repeating-linear-gradient(
      -45deg, transparent, transparent 40px,
      rgba(255,255,255,0.011) 40px, rgba(255,255,255,0.011) 41px
    );
    pointer-events: none; z-index: 0;
  }

  .sl-login-wrapper {
    display: flex; width: 100%; max-width: 800px;
    border: 1px solid var(--border);
    position: relative; z-index: 1;
    animation: slFade 0.7s ease both;
  }

  @keyframes slFade {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Brand Panel ── */
  .sl-brand {
    width: 260px; flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 28px; position: relative; overflow: hidden;
  }
  .sl-brand::before {
    content: ''; position: absolute; bottom: -80px; left: -80px;
    width: 230px; height: 230px; border-radius: 50%;
    background: radial-gradient(circle, rgba(200,169,110,0.11) 0%, transparent 70%);
    pointer-events: none;
  }
  .sl-brand::after {
    content: ''; position: absolute; top: 36px; right: -30px;
    width: 110px; height: 110px;
    border: 1px solid rgba(200,169,110,0.15); border-radius: 50%;
    pointer-events: none;
  }
  .sl-logo-mark {
    width: 60px; height: 60px; border: 1.5px solid var(--accent);
    display: flex; align-items: center; justify-content: center;
    transform: rotate(45deg); margin-bottom: 22px;
  }
  .sl-logo-mark span {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 600; color: var(--accent);
    transform: rotate(-45deg); letter-spacing: 0.05em;
  }
  .sl-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 25px; font-weight: 300; color: var(--text);
    letter-spacing: 0.22em; text-transform: uppercase; text-align: center;
  }
  .sl-brand-sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: 12px; font-weight: 600; color: var(--accent);
    letter-spacing: 0.35em; text-transform: uppercase; text-align: center; margin-top: 4px;
  }
  .sl-brand-divider { width: 36px; height: 1px; background: var(--accent); opacity: 0.5; margin: 16px auto; }
  .sl-brand-tagline {
    font-size: 10px; color: var(--text-muted); letter-spacing: 0.15em;
    text-transform: uppercase; text-align: center; line-height: 1.9;
  }

  /* ── Form Panel ── */
  .sl-form-panel {
    flex: 1; background: var(--bg); padding: 52px 44px;
    display: flex; flex-direction: column; justify-content: center;
  }

  .sl-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px; font-weight: 300; color: var(--text);
    letter-spacing: 0.05em; margin: 0 0 4px 0; line-height: 1.2;
  }
  .sl-subheading {
    font-size: 10px; color: var(--text-muted); letter-spacing: 0.18em;
    text-transform: uppercase; margin-bottom: 36px; display: block;
  }

  /* ── Ant label ── */
  .sl-form .ant-form-item { margin-bottom: 20px; }
  .sl-form .ant-form-item-label { padding-bottom: 6px !important; line-height: 1 !important; }
  .sl-form .ant-form-item-label > label {
    font-family: 'Jost', sans-serif !important; font-size: 10px !important;
    letter-spacing: 0.18em !important; text-transform: uppercase !important;
    color: #7a7a90 !important; font-weight: 500 !important; height: auto !important;
    line-height: 1 !important; display: flex !important; align-items: center !important;
  }
  .sl-form .ant-form-item-label > label.ant-form-item-required::before { display: none !important; content: '' !important; }

  /* ── Input ── */
  .sl-form .ant-input-affix-wrapper {
    background: var(--input-bg) !important; border: 1px solid #2a2a35 !important;
    border-radius: 4px !important; padding: 10px 14px !important;
    box-shadow: none !important; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s !important;
  }
  .sl-form .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover { border-color: #4a4a60 !important; box-shadow: none !important; }
  .sl-form .ant-input-affix-wrapper-focused, .sl-form .ant-input-affix-wrapper:focus-within {
    border-color: #c8a96e !important; background: #131318 !important;
    box-shadow: 0 0 0 3px rgba(200,169,110,0.15), 0 0 14px rgba(200,169,110,0.3) !important;
  }
  .sl-form .ant-input-affix-wrapper .ant-input {
    background: transparent !important; border: none !important; box-shadow: none !important;
    outline: none !important; color: #e8e8f0 !important; font-family: 'Jost', sans-serif !important;
    font-size: 13px !important; font-weight: 300 !important; padding: 0 !important; height: auto !important;
  }
  .sl-form .ant-input-affix-wrapper .ant-input::placeholder { color: #3a3a50 !important; }
  .sl-form .ant-input-prefix .anticon, .sl-form .ant-input-prefix { color: #7a7a90 !important; margin-right: 10px !important; }
  .sl-form .ant-input-suffix .anticon, .sl-form .ant-input-password-icon { color: #7a7a90 !important; transition: color 0.2s !important; cursor: pointer !important; }
  .sl-form .ant-input-password-icon:hover { color: #c8a96e !important; }
  .sl-form .ant-form-item-explain-error { font-family: 'Jost', sans-serif !important; font-size: 10px !important; color: #e06060 !important; letter-spacing: 0.05em !important; margin-top: 4px !important; }

  /* ── Checkbox ── */
  .sl-form .ant-checkbox-wrapper { font-family: 'Jost', sans-serif !important; font-size: 11px !important; color: #7a7a90 !important; letter-spacing: 0.05em !important; }
  .sl-form .ant-checkbox .ant-checkbox-inner { background: var(--input-bg) !important; border-color: #2a2a35 !important; border-radius: 2px !important; }
  .sl-form .ant-checkbox-checked .ant-checkbox-inner { background: rgba(200,169,110,0.15) !important; border-color: #c8a96e !important; }
  .sl-form .ant-checkbox-checked .ant-checkbox-inner::after { border-color: #c8a96e !important; }

  .sl-row { display: flex; justify-content: space-between; align-items: center; width: 100%; }
  .sl-forgot { font-family: 'Jost', sans-serif; font-size: 11px; color: #7a7a90; letter-spacing: 0.08em; text-decoration: none; transition: color 0.2s; }
  .sl-forgot:hover { color: #c8a96e; }

  /* ── Button ── */
  .sl-btn.ant-btn {
    width: 100% !important; height: auto !important; padding: 13px 24px !important;
    background: transparent !important; border: 1px solid #c8a96e !important; color: #c8a96e !important;
    font-family: 'Jost', sans-serif !important; font-size: 11px !important; letter-spacing: 0.35em !important;
    text-transform: uppercase !important; font-weight: 500 !important; border-radius: 4px !important;
    position: relative !important; overflow: hidden !important; transition: color 0.3s !important; box-shadow: none !important;
  }
  .sl-btn.ant-btn::before {
    content: '' !important; position: absolute !important; inset: 0 !important;
    background: #c8a96e !important; transform: translateX(-101%) !important;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1) !important; z-index: 0 !important;
  }
  .sl-btn.ant-btn:not(:disabled):hover::before { transform: translateX(0) !important; }
  .sl-btn.ant-btn:not(:disabled):hover { color: #0b0b0e !important; border-color: #c8a96e !important; }
  .sl-btn.ant-btn:disabled { opacity: 0.5 !important; cursor: not-allowed !important; background: transparent !important; color: #c8a96e !important; }
  .sl-btn .ant-btn-loading-icon, .sl-btn > span { position: relative !important; z-index: 1 !important; }

  /* ── Register link ── */
  .sl-register { margin-top: 24px; text-align: center; font-family: 'Jost', sans-serif; font-size: 12px; color: #9a9ab0; letter-spacing: 0.05em; }
  .sl-register a { color: #c8a96e !important; font-size: 12px !important; font-family: 'Jost', sans-serif !important; text-decoration: none !important; letter-spacing: 0.1em !important; transition: opacity 0.2s !important; }
  .sl-register a:hover { opacity: 0.8 !important; text-decoration: underline !important; }

  /* ── 2FA Step ── */
  .sl-2fa-box {
    background: rgba(200,169,110,0.05);
    border: 1px solid rgba(200,169,110,0.18);
    border-radius: 8px; padding: 24px 20px;
    text-align: center; margin-bottom: 28px;
  }
  .sl-2fa-icon-wrap {
    width: 56px; height: 56px;
    border: 1.5px solid var(--accent);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
    color: var(--accent); font-size: 24px;
  }
  .sl-2fa-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400; color: var(--text);
    margin-bottom: 8px; letter-spacing: 0.05em;
  }
  .sl-2fa-desc { font-size: 11px; color: var(--text-muted); letter-spacing: 0.04em; line-height: 1.8; }
  .sl-2fa-desc strong { color: var(--accent); font-weight: 500; }

  /* ── OTP Input ── */
  .sl-otp-wrap { margin-bottom: 6px; }
  .sl-otp-label { font-size: 10px; color: #7a7a90; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 8px; display: block; }
  .sl-otp-input {
    width: 100%; background: var(--input-bg) !important;
    border: 1px solid #2a2a35; border-radius: 4px;
    padding: 14px 20px; color: var(--text);
    font-family: 'Jost', sans-serif; font-size: 26px; font-weight: 300;
    text-align: center; letter-spacing: 0.5em;
    outline: none; box-shadow: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .sl-otp-input:focus {
    border-color: #c8a96e !important;
    background: #131318 !important;
    box-shadow: 0 0 0 3px rgba(200,169,110,0.15), 0 0 14px rgba(200,169,110,0.3) !important;
  }
  .sl-otp-input::placeholder { color: #2a2a45; letter-spacing: 0.4em; }
  .sl-otp-error { font-size: 10px; color: #e06060; letter-spacing: 0.05em; margin-top: 6px; min-height: 16px; }

  /* ── Back btn ── */
  .sl-back {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    font-family: 'Jost', sans-serif; font-size: 10px;
    color: #7a7a90; letter-spacing: 0.15em; text-transform: uppercase;
    padding: 0; margin-bottom: 24px; transition: color 0.2s;
  }
  .sl-back:hover { color: #c8a96e; }

  .sl-timer { margin-top: 16px; text-align: center; font-size: 11px; color: #7a7a90; letter-spacing: 0.05em; }
  .sl-timer span { color: #c8a96e; }

  /* ── Slide animation for step switch ── */
  @keyframes slSlide {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .sl-step { animation: slSlide 0.35s ease both; }

  @media (max-width: 600px) {
    .sl-brand { display: none; }
    .sl-form-panel { padding: 36px 24px; }
  }
`;

const LoginPage = () => {
  const [state, setState]           = useState({ loading: false });
  const [step, setStep]             = useState("login");   // "login" | "2fa"
  const [tempToken, setTempToken]   = useState("");
  const [otpCode, setOtpCode]       = useState("");
  const [otpError, setOtpError]     = useState("");

  const { setProfile, setAccessToken } = profileStore();
  const navigate = useNavigate();

  // ── Step 1: Login with email + password ──────────────────
  const onFinish = async (values) => {
    setState((p) => ({ ...p, loading: true }));

    const res = await request("login", "post", {
      email:    values.email,
      password: values.password,
    });

    if (res && !res.errors) {
      if (res.requires_2fa) {
        // ✅ 2FA required — switch to OTP step
        setTempToken(res.temp_token);
        setStep("2fa");
        setState((p) => ({ ...p, loading: false }));
      } else {
        // ✅ No 2FA — login directly
        setProfile({
          ...res.users,
          image: res.users?.profiles?.imagee ?? null,
          type:  res.users?.profiles?.type   ?? 'staff',
        });
        setAccessToken(res.access_token);
        navigate("/dashboard");
      }
    } else {
      setState((p) => ({ ...p, loading: false }));
    }
  };

  // ── Step 2: Verify 6-digit OTP ────────────────────────────
  const onVerify2FA = async () => {
    if (otpCode.length !== 6) {
      setOtpError("Please enter the 6-digit code");
      return;
    }
    setOtpError("");
    setState((p) => ({ ...p, loading: true }));

    const res = await request("verify-2fa", "post", {
      temp_token: tempToken,
      otp_code:   otpCode,
    });

    if (res && !res.errors) {
      // ✅ 2FA passed — complete login
      setProfile({
        ...res.users,
        image: res.users?.profiles?.imagee ?? null,
        type:  res.users?.profiles?.type   ?? 'staff',
      });
      setAccessToken(res.access_token);
      navigate("/dashboard");
    } else {
      setOtpError(
        res?.errors?.otp_code?.[0] ||
        res?.errors?.message?.[0]  ||
        "Invalid code. Please try again."
      );
      setState((p) => ({ ...p, loading: false }));
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="sl-login-root">
        <div className="sl-login-wrapper">

          {/* ── Brand Panel ── */}
          <div className="sl-brand">
            <div className="sl-logo-mark"><span>SL</span></div>
            <div className="sl-brand-name">Sheerlong</div>
            <div className="sl-brand-sub">Shop</div>
            <div className="sl-brand-divider" />
            <div className="sl-brand-tagline">Crafted for those<br />who know quality</div>
          </div>

          {/* ── Form Panel ── */}
          <div className="sl-form-panel">

            {/* ════════ STEP 1 — Login ════════ */}
            {step === "login" && (
              <div className="sl-step">
                <h2 className="sl-heading">Welcome Back</h2>
                <span className="sl-subheading">Sign in to your account</span>

                <Form
                  className="sl-form"
                  name="login"
                  layout="vertical"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Please input your email!" }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="you@example.com" />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 8 }}>
                    <div className="sl-row">
                      <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                      </Form.Item>
                      <a href="#" className="sl-forgot">Forgot password?</a>
                    </div>
                  </Form.Item>

                  <Form.Item style={{ marginTop: 16, marginBottom: 0 }}>
                    <Button
                      className="sl-btn"
                      htmlType="submit"
                      loading={state.loading}
                      disabled={state.loading}
                    >
                      {state.loading ? "Signing In…" : "Sign In"}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}

            {/* ════════ STEP 2 — 2FA OTP ════════ */}
            {step === "2fa" && (
              <div className="sl-step">
                {/* Back button */}
                <button
                  className="sl-back"
                  onClick={() => { setStep("login"); setOtpCode(""); setOtpError(""); }}
                >
                  <ArrowLeftOutlined /> Back to login
                </button>

                {/* Info box */}
                <div className="sl-2fa-box">
                  <div className="sl-2fa-icon-wrap">
                    <SafetyOutlined />
                  </div>
                  <div className="sl-2fa-title">Two-Factor Authentication</div>
                  <div className="sl-2fa-desc">
                    បើក <strong>Google Authenticator</strong> app នៅលើទូរស័ព្ទ<br />
                    ហើយវាយ <strong>6-digit code</strong> ដែលបង្ហាញ
                  </div>
                </div>

                {/* OTP input */}
                <div className="sl-otp-wrap">
                  <span className="sl-otp-label">Authenticator Code</span>
                  <input
                    className="sl-otp-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otpCode}
                    autoFocus
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setOtpCode(val);
                      if (otpError) setOtpError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onVerify2FA();
                    }}
                  />
                  <div className="sl-otp-error">{otpError}</div>
                </div>

                {/* Verify button */}
                <div style={{ marginTop: 8 }}>
                  <Button
                    className="sl-btn"
                    onClick={onVerify2FA}
                    loading={state.loading}
                    disabled={state.loading || otpCode.length !== 6}
                  >
                    {state.loading ? "Verifying…" : "Verify & Sign In"}
                  </Button>
                </div>

                <div className="sl-timer">
                  Code refreshes every <span>30 seconds</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
