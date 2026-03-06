import React from 'react';

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      error: '',
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      formData: {
        ...prev.formData,
        [name]: value,
      },
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { formData } = this.state;
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      this.setState({ error: 'Please fill in all fields' });
      return;
    }
    if (!formData.email.includes('@')) {
      this.setState({ error: 'Please enter a valid email' });
      return;
    }
    if (formData.password.length < 6) {
      this.setState({ error: 'Password must be at least 6 characters' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      this.setState({ error: 'Passwords do not match' });
      return;
    }
    this.props.onRegister(formData);
    this.setState({ error: '' });
  };

  render() {
    const { formData, error } = this.state;
    return (
      <div className="auth-container register-container">
        <div className="auth-card">
          <h1>Create Your Account</h1>
          <form onSubmit={this.handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={this.handleChange}
                placeholder="Enter your full name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={this.handleChange}
                placeholder="Enter your email"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={this.handleChange}
                placeholder="Enter your password"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={this.handleChange}
                placeholder="Confirm your password"
                className="form-input"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="auth-button">
              Register
            </button>
          </form>

          <p className="auth-link">
            Already have an account? <a href="#login">Login here</a>
          </p>
        </div>
      </div>
    );
  }
}
