import React from 'react';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      isRegister: false,
      isForgot: false,
      forgotEmail: '',
      newPassword: '',
      confirmPassword: '',
      error: '',
      success: '',
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ error: '', success: '' }, () => {
      const { email, password, name, isRegister } = this.state;
      if (!email || !password) {
        this.setState({ error: 'Please fill in all fields.' });
        return;
      }
      if (!email.includes('@')) {
        this.setState({ error: 'Please enter a valid email.' });
        return;
      }
      if (password.length < 6) {
        this.setState({ error: 'Password must be at least 6 characters.' });
        return;
      }

      if (isRegister) {
        if (!name || name.trim().length < 2) {
          this.setState({ error: 'Name must be at least 2 characters.' });
          return;
        }

        const users = JSON.parse(localStorage.getItem('tigon_users') || '[]');
        if (users.find((u) => u.email === email)) {
          this.setState({ error: 'This email is already registered. Please login or use a different email.' });
          return;
        }

        const newUser = {
          id: Date.now(),
          name,
          email,
          password,
        };
        users.push(newUser);
        localStorage.setItem('tigon_users', JSON.stringify(users));
        localStorage.setItem('tigon_currentUser', JSON.stringify(newUser));
        this.props.onLogin(newUser);
      } else {
        const users = JSON.parse(localStorage.getItem('tigon_users') || '[]');
        const user = users.find((u) => u.email === email && u.password === password);
        if (!user) {
          this.setState({ error: 'Invalid email or password. Please try again or reset your password.' });
          return;
        }
        localStorage.setItem('tigon_currentUser', JSON.stringify(user));
        this.props.onLogin(user);
      }
    });
  };

  handleForgotPassword = (e) => {
    e.preventDefault();
    this.setState({ error: '', success: '' }, () => {
      const { forgotEmail, newPassword, confirmPassword } = this.state;
      if (!forgotEmail) {
        this.setState({ error: 'Please enter your email address.' });
        return;
      }
      if (!forgotEmail.includes('@')) {
        this.setState({ error: 'Please enter a valid email.' });
        return;
      }
      const users = JSON.parse(localStorage.getItem('tigon_users') || '[]');
      const user = users.find((u) => u.email === forgotEmail);
      if (!user) {
        this.setState({ error: 'No account found with this email address.' });
        return;
      }
      if (!newPassword || !confirmPassword) {
        this.setState({ error: 'Please enter a new password.' });
        return;
      }
      if (newPassword.length < 6) {
        this.setState({ error: 'Password must be at least 6 characters.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        this.setState({ error: 'Passwords do not match.' });
        return;
      }

      const updatedUsers = users.map((u) =>
        u.email === forgotEmail ? { ...u, password: newPassword } : u
      );
      localStorage.setItem('tigon_users', JSON.stringify(updatedUsers));
      this.setState({ success: 'Password reset successful. Please login with your new password.' });

      setTimeout(() => {
        this.setState({
          isForgot: false,
          forgotEmail: '',
          newPassword: '',
          confirmPassword: '',
          email: '',
          password: '',
          success: '',
        });
      }, 1800);
    });
  };

  resetToLogin = () => {
    this.setState({
      isForgot: false,
      email: '',
      password: '',
      name: '',
      isRegister: false,
      error: '',
      success: '',
      forgotEmail: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  render() {
    const {
      email,
      password,
      name,
      isRegister,
      isForgot,
      forgotEmail,
      newPassword,
      confirmPassword,
      error,
      success,
    } = this.state;

    const isDark = this.props.theme === 'dark';
    const themeColors = this.props.themeColors || {
      bg: isDark ? '#0f172a' : '#ffffff',
      cardBg: isDark ? '#1e293b' : '#f8fafc',
      text: isDark ? '#f1f5f9' : '#0f172a',
      textSecondary: isDark ? '#94a3b8' : '#475569',
      border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      accent: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    };

    const pageStyle = {
      background: 'transparent',
      color: themeColors.text,
    };

    const cardStyle = {
      background: themeColors.cardBg,
      border: `1px solid ${themeColors.border}`,
      color: themeColors.text,
      boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.45)' : '0 20px 50px rgba(0,0,0,0.12)',
    };

    const textSecondaryStyle = { color: themeColors.textSecondary };

    const inputStyle = {
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      color: themeColors.text,
      borderColor: themeColors.border,
    };

    const buttonStyle = {
      background: themeColors.gradient,
      color: '#ffffff',
    };

    const linkButtonStyle = {
      color: themeColors.accent,
    };

    return (
      <div className="login-container" style={pageStyle}>
        <div className="login-card" style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button
              type="button"
              onClick={this.props.toggleTheme}
              className="login-toggle-button"
              style={linkButtonStyle}
            >
              {isDark ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>

          <h1 className="login-title" style={{ color: themeColors.text }}>
            {isForgot ? 'Reset Password' : isRegister ? 'Create Account' : 'Login to Tigon'}
          </h1>

          <form onSubmit={isForgot ? this.handleForgotPassword : this.handleSubmit} className="login-form">
            {isForgot ? (
              <>
                <div className="login-form-group">
                  <label className="login-label" style={textSecondaryStyle}>Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => this.setState({ forgotEmail: e.target.value })}
                    placeholder="Enter your registered email"
                    className="login-input"
                    style={inputStyle}
                  />
                </div>

                <div className="login-form-group">
                  <label className="login-label" style={textSecondaryStyle}>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => this.setState({ newPassword: e.target.value })}
                    placeholder="Enter new password (min 6 characters)"
                    className="login-input"
                    style={inputStyle}
                  />
                </div>

                <div className="login-form-group">
                  <label className="login-label" style={textSecondaryStyle}>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                    placeholder="Confirm your new password"
                    className="login-input"
                    style={inputStyle}
                  />
                </div>
              </>
            ) : (
              <>
                {isRegister && (
                  <div className="login-form-group">
                    <label className="login-label" style={textSecondaryStyle}>Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => this.setState({ name: e.target.value })}
                      placeholder="Enter your name"
                      className="login-input"
                      style={inputStyle}
                    />
                  </div>
                )}

                <div className="login-form-group">
                  <label className="login-label" style={textSecondaryStyle}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    placeholder="Enter your email"
                    className="login-input"
                    style={inputStyle}
                  />
                </div>

                <div className="login-form-group">
                  <label className="login-label" style={textSecondaryStyle}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => this.setState({ password: e.target.value })}
                    placeholder="Enter your password (min 6 characters)"
                    className="login-input"
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            {error && <div className="login-error">{error}</div>}
            {success && <div className="login-success">{success}</div>}

            <button type="submit" className="login-button" style={buttonStyle}>
              {isForgot ? 'Reset Password' : isRegister ? 'Create Account' : 'Login'}
            </button>
          </form>

          {isForgot ? (
            <p className="login-toggle" style={textSecondaryStyle}>
              Remember your password?{' '}
              <button type="button" onClick={this.resetToLogin} className="login-toggle-button" style={linkButtonStyle}>
                Back to Login
              </button>
            </p>
          ) : (
            <>
              {!isRegister && (
                <p className="login-forgot-link" style={textSecondaryStyle}>
                  <button
                    type="button"
                    onClick={() =>
                      this.setState({
                        isForgot: true,
                        error: '',
                        email: '',
                        password: '',
                      })
                    }
                    className="login-forgot-button"
                    style={linkButtonStyle}
                  >
                    Forgot Password?
                  </button>
                </p>
              )}

              <p className="login-toggle" style={textSecondaryStyle}>
                {isRegister ? 'Already have account? ' : "Don't have account? "}
                <button
                  type="button"
                  onClick={() =>
                    this.setState((prev) => ({
                      isRegister: !prev.isRegister,
                      error: '',
                      email: '',
                      password: '',
                      name: '',
                    }))
                  }
                  className="login-toggle-button"
                  style={linkButtonStyle}
                >
                  {isRegister ? 'Login' : 'Register'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }
}
