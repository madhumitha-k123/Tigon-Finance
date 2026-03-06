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
        this.setState({ error: '❌ Please fill in all fields' });
        return;
      }
      if (!email.includes('@')) {
        this.setState({ error: '❌ Please enter a valid email' });
        return;
      }
      if (password.length < 6) {
        this.setState({ error: '❌ Password must be at least 6 characters' });
        return;
      }

      if (isRegister) {
        if (!name || name.trim().length < 2) {
          this.setState({ error: '❌ Name must be at least 2 characters' });
          return;
        }

        const users = JSON.parse(localStorage.getItem('tigon_users') || '[]');
        if (users.find((u) => u.email === email)) {
          this.setState({
            error: '❌ This email is already registered. Please login or use a different email.',
          });
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
          this.setState({
            error: '❌ Invalid email or password. Please try again or reset your password.',
          });
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
        this.setState({ error: '❌ Please enter your email address' });
        return;
      }
      if (!forgotEmail.includes('@')) {
        this.setState({ error: '❌ Please enter a valid email' });
        return;
      }
      const users = JSON.parse(localStorage.getItem('tigon_users') || '[]');
      const user = users.find((u) => u.email === forgotEmail);
      if (!user) {
        this.setState({ error: '❌ No account found with this email address' });
        return;
      }
      if (!newPassword || !confirmPassword) {
        this.setState({ error: '❌ Please enter a new password' });
        return;
      }
      if (newPassword.length < 6) {
        this.setState({ error: '❌ Password must be at least 6 characters' });
        return;
      }
      if (newPassword !== confirmPassword) {
        this.setState({ error: '❌ Passwords do not match' });
        return;
      }

      const updatedUsers = users.map((u) =>
        u.email === forgotEmail ? { ...u, password: newPassword } : u
      );
      localStorage.setItem('tigon_users', JSON.stringify(updatedUsers));
      this.setState({
        success: '✅ Password reset successful! Please login with your new password.',
      });

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
      }, 2000);
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

    if (isForgot) {
      return (
        <div className="login-container">
          <div className="login-card">
            <h1 className="login-title">🔑 Reset Password</h1>
            <form onSubmit={this.handleForgotPassword} className="login-form">
              <div className="login-form-group">
                <label className="login-label">Email Address</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => this.setState({ forgotEmail: e.target.value })}
                  placeholder="Enter your registered email"
                  className="login-input"
                />
              </div>

              <div className="login-form-group">
                <label className="login-label">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => this.setState({ newPassword: e.target.value })}
                  placeholder="Enter new password (min 6 characters)"
                  className="login-input"
                />
              </div>

              <div className="login-form-group">
                <label className="login-label">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                  placeholder="Confirm your new password"
                  className="login-input"
                />
              </div>

              {error && <div className="login-error">{error}</div>}
              {success && <div className="login-success">{success}</div>}

              <button type="submit" className="login-button">
                🔄 Reset Password
              </button>
            </form>

            <p className="login-toggle">
              Remember your password?{' '}
              <button
                type="button"
                onClick={this.resetToLogin}
                className="login-toggle-button"
              >
                Back to Login
              </button>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">
            {isRegister ? '✨ Create Account' : '🔐 Login to Tigon'}
          </h1>

          <form onSubmit={this.handleSubmit} className="login-form">
            {isRegister && (
              <div className="login-form-group">
                <label className="login-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => this.setState({ name: e.target.value })}
                  placeholder="Enter your name"
                  className="login-input"
                />
              </div>
            )}

            <div className="login-form-group">
              <label className="login-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
                placeholder="Enter your email"
                className="login-input"
              />
            </div>

            <div className="login-form-group">
              <label className="login-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                placeholder="Enter your password (min 6 characters)"
                className="login-input"
              />
            </div>

            {error && <div className="login-error">{error}</div>}
            {success && <div className="login-success">{success}</div>}

            <button type="submit" className="login-button">
              {isRegister ? '✅ Create Account' : '🚀 Login Now'}
            </button>
          </form>

          {!isRegister && (
            <p className="login-forgot-link">
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
              >
                🔑 Forgot Password?
              </button>
            </p>
          )}

          <p className="login-toggle">
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
            >
              {isRegister ? 'Login' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    );
  }
}
