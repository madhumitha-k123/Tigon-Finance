import { useState } from "react";
import Landing from "./Landing";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Premium from "./components/Premium";
import ThemeMotionBackground from "./components/ThemeMotionBackground";

const initializeUser = () => {
  const currentUser = localStorage.getItem("tigon_currentUser");
  return currentUser ? JSON.parse(currentUser) : null;
};

const initializeTheme = () => {
  return localStorage.getItem("tigon_theme") || "light";
};

export default function App() {
  // if somebody has already logged in during a previous session we skip the
  // marketing landing page and go straight to the login/dashboard flow.
  const [showLanding, setShowLanding] = useState(() => {
    const currentUser = localStorage.getItem("tigon_currentUser");
    return currentUser ? false : true;
  });

  const [user, setUser] = useState(() => initializeUser());
  const [theme, setTheme] = useState(() => initializeTheme());
  const [currentPage, setCurrentPage] = useState("dashboard"); // "dashboard" or "premium"
  const [expenses, setExpenses] = useState(() => {
    const currentUser = localStorage.getItem("tigon_currentUser");
    const usr = currentUser ? JSON.parse(currentUser) : null;
    return usr ? JSON.parse(localStorage.getItem(`tigon_expenses_${usr.id}`) || "[]") : [];
  });

  const handleLogin = (userData) => {
    console.log('Logging in user:', userData);
    localStorage.setItem('tigon_currentUser', JSON.stringify(userData));
    setUser(userData);
    const userExpenses = JSON.parse(
      localStorage.getItem(`tigon_expenses_${userData.id}`) || "[]"
    );
    setExpenses(userExpenses);
  };

  const handleLogout = () => {
    // Remove logged in user and reset app state
    localStorage.removeItem("tigon_currentUser");
    setUser(null);
    setExpenses([]);
    // when a user logs out we bring them back to the landing page
    // so they can choose "Get started" again if they wish
    setShowLanding(true);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("tigon_theme", newTheme);
  };

  const saveExpenses = (updatedExpenses) => {
    setExpenses(updatedExpenses);
    if (user) {
      localStorage.setItem(
        `tigon_expenses_${user.id}`,
        JSON.stringify(updatedExpenses)
      );
    }
  };

  const isDark = theme === "dark";
  // themeColors controls the palettes used throughout the app.
  // changed the default gradient/colours to the green/teal scheme that the
  // user mentioned in the screenshot. the landing page and login page will
  // both pick up `themeColors.bg` for the main background and `gradient`
  // for call‑to‑action areas.
  // simple blue/purple theme used originally; keep dark mode colors
  const themeColors = {
    bg: isDark ? "#0f172a" : "#ffffff",
    cardBg: isDark ? "#1e293b" : "#f8fafc",
    text: isDark ? "#f1f5f9" : "#0f172a",
    textSecondary: isDark ? "#94a3b8" : "#475569",
    border: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    accent: "#667eea",
  };

  let page = null;

  if (showLanding) {
    page = (
      <Landing
        onGetStarted={() => setShowLanding(false)}
        theme={theme}
        toggleTheme={toggleTheme}
        themeColors={themeColors}
      />
    );
  } else if (!user) {
    page = (
      <Login
        onLogin={handleLogin}
        theme={theme}
        toggleTheme={toggleTheme}
        themeColors={themeColors}
      />
    );
  } else if (currentPage === "premium") {
    page = (
      <Premium
        user={user}
        themeColors={themeColors}
        onClose={() => setCurrentPage("dashboard")}
      />
    );
  } else {
    page = (
      <Dashboard
        user={user}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
        expenses={expenses}
        onExpensesChange={saveExpenses}
        themeColors={themeColors}
        onNavigatePremium={() => setCurrentPage("premium")}
      />
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }}>
      <ThemeMotionBackground theme={theme} />
      <div style={{ position: "relative", zIndex: 1 }}>{page}</div>
    </div>
  );
}
