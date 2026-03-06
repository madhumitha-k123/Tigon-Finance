import React from 'react';
import { TigonLogoMark } from './TigonBrand';

export default function Sidebar({
  user,
  onLogout,
  theme,
  toggleTheme,
  themeColors,
  currentSection,
  onSectionChange,
  onNavigatePremium,
  isMobile = false,
  isOpen = true,
  onClose,
}) {
  const isDark = theme === 'dark';

  const sections = [
    { name: 'Dashboard', icon: 'DB' },
    { name: 'Expenses', icon: 'EX' },
    { name: 'Income', icon: 'IN' },
    { name: 'Analytics', icon: 'AN' },
    { name: 'Budget', icon: 'BG' },
    { name: 'Calendar', icon: 'CL' },
    { name: 'AI Assistant', icon: 'AI' },
  ];

  const panel = (
    <div
      style={{
        ...styles.sidebar,
        ...(isMobile ? styles.sidebarMobile : null),
        ...(isMobile && isOpen ? styles.sidebarMobileOpen : null),
        backgroundColor: themeColors.cardBg,
        borderRight: `1px solid ${themeColors.border}`,
      }}
    >
      <div style={{ ...styles.header, borderBottom: `1px solid ${themeColors.border}` }}>
        <h1 style={{ ...styles.logo, color: themeColors.text }}>
          <span style={styles.logoWrap}>
            <TigonLogoMark size={42} />
            <span>Tigon Finance</span>
          </span>
        </h1>
        <button onClick={toggleTheme} style={{ ...styles.themeBtn, color: themeColors.text }}>
          {isDark ? 'Light' : 'Dark'}
        </button>
      </div>

      {user && (
        <div style={{ ...styles.userInfo, borderBottom: `1px solid ${themeColors.border}` }}>
          <div style={{ ...styles.userAvatar, backgroundColor: themeColors.bg }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={styles.userDetails}>
            <div style={{ ...styles.userName, color: themeColors.text }}>{user.name || 'User'}</div>
            <div style={{ ...styles.userEmail, color: themeColors.textSecondary }}>{user.email}</div>
          </div>
        </div>
      )}

      <nav style={styles.nav}>
        {sections.map((section) => (
          <button
            key={section.name}
            onClick={() => {
              onSectionChange(section.name);
              if (isMobile && onClose) onClose();
            }}
            style={{
              ...styles.navItem,
              backgroundColor:
                currentSection === section.name ? `${themeColors.accent}20` : 'transparent',
              borderLeft:
                currentSection === section.name ? `4px solid ${themeColors.accent}` : `4px solid transparent`,
              color: currentSection === section.name ? themeColors.accent : themeColors.text,
            }}
          >
            <span style={styles.icon}>{section.icon}</span>
            <span>{section.name}</span>
          </button>
        ))}
      </nav>

      <div style={{ ...styles.footer, borderTop: `1px solid ${themeColors.border}` }}>
        <button
          onClick={() => {
            onNavigatePremium();
            if (isMobile && onClose) onClose();
          }}
          style={{
            ...styles.investBtn,
            marginBottom: '10px',
            backgroundColor: 'rgba(102,126,234,0.1)',
            color: themeColors.accent,
          }}
        >
          Go Premium
        </button>
        <button onClick={onLogout} style={{ ...styles.logoutBtn, color: '#dc2626' }}>
          Logout
        </button>
      </div>
    </div>
  );

  if (!isMobile) return panel;

  return (
    <>
      {isOpen && <div onClick={onClose} style={styles.overlay} />}
      {panel}
    </>
  );
}

const styles = {
  sidebar: {
    width: '280px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0',
    overflow: 'auto',
    position: 'relative',
    zIndex: 1,
  },
  sidebarMobile: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    transform: 'translateX(-100%)',
    transition: 'transform 0.25s ease',
    zIndex: 1001,
  },
  sidebarMobileOpen: {
    transform: 'translateX(0)',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    zIndex: 1000,
  },
  header: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  logo: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: 0,
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  themeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
  },
  userInfo: {
    padding: '15px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '2px',
  },
  userEmail: {
    fontSize: '12px',
  },
  nav: {
    flex: 1,
    padding: '10px 0',
  },
  navItem: {
    width: '100%',
    padding: '12px 20px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    textAlign: 'left',
    fontWeight: '500',
  },
  icon: {
    fontSize: '18px',
  },
  footer: {
    padding: '15px 20px',
  },
  investBtn: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  logoutBtn: {
    width: '100%',
    padding: '10px',
    border: 'none',
    background: 'rgba(220, 38, 38, 0.1)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
};
