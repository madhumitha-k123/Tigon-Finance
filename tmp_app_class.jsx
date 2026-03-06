import React from "react";
import Landing from "./Landing";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Premium from "./components/Premium";

const initializeUser = () => {
  const currentUser = localStorage.getItem("tigon_currentUser");
  return currentUser ? JSON.parse(currentUser) : null;
};

const initializeTheme = () => {
  return localStorage.getItem("tigon_theme") || "light";
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const usr = initializeUser();
    this.state = {
      showLanding: true,
      user: usr,
      theme: initializeTheme(),
      currentPage: "dashboard",
      expenses: usr ? JSON.parse(localStorage.getItem(`tigon_expenses_${usr.id}`) || "[]") : [],
    };
  }

  handleLogin = (userData) => {
    console.log('Logging in user:', userData);
    localStorage.setItem('tigon_currentUser', JSON.stringify(userData));
    const userExpenses = JSON.parse(
      localStorage.getItem(`tigon_expenses_${userData.id}`) || "[]"
    );
    this.setState({ user: userData, expenses: userExpenses, showLanding: false });
  };

  handleLogout = () => {
    localStorage.removeItem("tigon_currentUser");
    this.setState({ user: null, expenses: [], showLanding: true });
  };

  toggleTheme = () => {
    this.setState((prev) => {
      const newTheme = prev.theme === "light" ? "dark" : "light";
      localStorage.setItem("tigon_theme", newTheme);
      return { theme: newTheme };
    });
  };

  saveExpenses = (updatedExpenses) => {
    this.setState({ expenses: updatedExpenses }, () => {
      const { user } = this.state;
      if (user) {
        localStorage.setItem(`tigon_expenses_${user.id}`, JSON.stringify(updatedExpenses));
      }
    });
  };

  render() {
    const { showLanding, user, theme, currentPage, expenses } = this.state;
    const isDark = theme === "dark";

    const themeColors = {
      bg: isDark ? "#0f172a" : "#ffffff",
      cardBg: isDark ? "#1e293b" : "#f8fafc",
      text: isDark ? "#f1f5f9" : "#0f172a",
      textSecondary: isDark ? "#94a3b8" : "#475569",
      border: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      accent: "#667eea",
    };

    if (showLanding) {
      return (
        <Landing
          onGetStarted={() => this.setState({ showLanding: false })}
          theme={theme}
          toggleTheme={this.toggleTheme}
          themeColors={themeColors}
        />
      );
    }

    if (!user) {
      return <Login onLogin={this.handleLogin} />;
    }

    if (currentPage === "premium") {
      return (
        <Premium
          user={user}
          themeColors={themeColors}
          onClose={() => this.setState({ currentPage: "dashboard" })}
        />
      );
    }

    return (
      <Dashboard
        user={user}
        onLogout={this.handleLogout}
        theme={theme}
        toggleTheme={this.toggleTheme}
        expenses={expenses}
        onExpensesChange={this.saveExpenses}
        themeColors={themeColors}
        onNavigatePremium={() => this.setState({ currentPage: "premium" })}
      />
    );
  }
}
