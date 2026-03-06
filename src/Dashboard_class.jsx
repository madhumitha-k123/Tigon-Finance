import React from 'react';
import Sidebar from './components/Sidebar';
import AIAssistant from './components/AIAssistant';
import Charts from './components/charts';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    const { user } = props;
    const storedIncome = parseFloat(localStorage.getItem(`tigon_income_${user?.id}`) || '0');
    this.state = {
      currentSection: 'Dashboard',
      expenseAmount: '',
      expenseCategory: 'Food',
      expenseDescription: '',
      income: storedIncome,
      newIncome: storedIncome || '',
    };
  }

  handleAddExpense = (e) => {
    e.preventDefault();
    const { expenseAmount, expenseCategory, expenseDescription } = this.state;
    const { expenses, onExpensesChange } = this.props;
    if (!expenseAmount || !expenseCategory) return;

    const newExpense = {
      id: Date.now(),
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      description: expenseDescription,
      date: new Date().toLocaleDateString(),
    };
    const updatedExpenses = [...expenses, newExpense];
    onExpensesChange(updatedExpenses);
    this.setState({ expenseAmount: '', expenseDescription: '' });
  };

  handleDeleteExpense = (id) => {
    const { expenses, onExpensesChange } = this.props;
    const updatedExpenses = expenses.filter((exp) => exp.id !== id);
    onExpensesChange(updatedExpenses);
  };

  handleIncomeChange = (value) => {
    const { user } = this.props;
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      this.setState({ income: 0 });
      localStorage.removeItem(`tigon_income_${user?.id}`);
    } else {
      this.setState({ income: parsed });
      localStorage.setItem(`tigon_income_${user?.id}`, parsed);
    }
  };

  renderSection = () => {
    const { currentSection, income, newIncome, expenseAmount, expenseCategory, expenseDescription } = this.state;
    const { expenses, themeColors, theme, user, onNavigatePremium } = this.props;
    const isDark = theme === 'dark';

    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    const balance = income - totalExpenses;
    const savingsPercentage = income > 0 ? ((income - totalExpenses) / income) * 100 : 0;
    const budgetPercentage = income > 0 ? (totalExpenses / income) * 100 : 0;

    const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Other'];

    switch (currentSection) {
      case 'Dashboard':
        return (
          <div style={sectionStyles.dashboardGrid}>
            {/* Overview Cards */}
            <div style={sectionStyles.statsGrid}>
              <div style={{ ...sectionStyles.statCard, backgroundColor: themeColors.cardBg, borderColor: themeColors.border }}>
                <div style={sectionStyles.statLabel}>💰 Total Income</div>
                <div style={{ ...sectionStyles.statValue, color: '#4ade80' }}>₹{income.toFixed(2)}</div>
              </div>
              <div style={{ ...sectionStyles.statCard, backgroundColor: themeColors.cardBg, borderColor: themeColors.border }}>
                <div style={sectionStyles.statLabel}>📊 Total Expenses</div>
                <div style={{ ...sectionStyles.statValue, color: '#f97316' }}>₹{totalExpenses.toFixed(2)}</div>
              </div>
              {balance >= 0 && (
              <div style={{ ...sectionStyles.statCard, backgroundColor: themeColors.cardBg, borderColor: themeColors.border }}>
                <div style={sectionStyles.statLabel}>💎 Balance</div>
                <div style={{ ...sectionStyles.statValue, color: themeColors.accent }}>
                  ₹{balance.toFixed(2)}
                </div>
              </div>
              )}
            </div>

            {/* Charts */}
            <div style={sectionStyles.chartsContainer}>
              <Charts expenses={expenses} isDark={isDark} themeColors={themeColors} />
            </div>

            {/* AI Assistant Preview */}
            <div style={{ ...sectionStyles.aiPreview, backgroundColor: themeColors.cardBg, color: themeColors.text }}>
              <h3>🤖 Your AI Financial Advisor</h3>
              <p>Switch to AI Assistant section for personalized roasts and recommendations!</p>
            </div>
          </div>
        );

      case 'Expenses':
        return (
          <div>
            {/* Add Expense Form */}
            <div style={{ ...sectionStyles.formCard, backgroundColor: themeColors.cardBg, color: themeColors.text }}>
              <h3>➕ Add New Expense</h3>
              <form onSubmit={this.handleAddExpense} style={sectionStyles.form}>
                <div style={sectionStyles.formGroup}>
                  <label style={{ color: themeColors.textSecondary }}>Amount (₹)</label>
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => this.setState({ expenseAmount: e.target.value })}
                    placeholder="Enter amount"
                    step="0.01"
                    style={sectionStyles.input}
                  />
                </div>
                <div style={sectionStyles.formGroup}>
                  <label style={{ color: themeColors.textSecondary }}>Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => this.setState({ expenseCategory: e.target.value })}
                    style={sectionStyles.input}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={sectionStyles.formGroup}>
                  <label style={{ color: themeColors.textSecondary }}>Description (optional)</label>
                  <input
                    type="text"
                    value={expenseDescription}
                    onChange={(e) => this.setState({ expenseDescription: e.target.value })}
                    placeholder="What was this for?"
                    style={sectionStyles.input}
                  />
                </div>
                <button type="submit" style={sectionStyles.submitBtn}>
                  💾 Add Expense
                </button>
              </form>
            </div>

            {/* Expenses List */}
            <div style={{ ...sectionStyles.formCard, backgroundColor: themeColors.cardBg, color: themeColors.text, marginTop: '20px' }}>
              <h3>📋 All Expenses</h3>
              {expenses.length === 0 ? (
                <p style={{ color: themeColors.textSecondary }}>No expenses yet. Add one to get started!</p>
              ) : (
                <div style={sectionStyles.expensesList}>
                  {expenses.map((exp) => (
                    <div key={exp.id} style={{ ...sectionStyles.expenseItem, backgroundColor: themeColors.bg, borderColor: themeColors.border }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: themeColors.text }}>{exp.category}</div>
                        <div style={{ fontSize: '14px', color: themeColors.textSecondary }}>{exp.description || 'No description'}</div>
                        <div style={{ fontSize: '12px', color: themeColors.textSecondary }}>{exp.date}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 'bold', color: '#f97316', fontSize: '18px' }}>₹{exp.amount.toFixed(2)}</div>
                        <button
                          onClick={() => this.handleDeleteExpense(exp.id)}
                          style={sectionStyles.deleteBtn}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'Income':
        return (
          <div style={{ ...sectionStyles.formCard, backgroundColor: themeColors.cardBg, color: themeColors.text }}>
            <h3>💵 Monthly Income</h3>
            <div style={sectionStyles.incomeSection}>
              <div style={sectionStyles.incomeDisplay}>
                <p style={{ color: themeColors.textSecondary }}>Your current monthly income:</p>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#4ade80', margin: '20px 0' }}>
                  ₹{income.toFixed(2)}
                </div>
              </div>
              <div style={sectionStyles.incomeForm}>
                <input
                  type="number"
                  value={newIncome}
                  onChange={(e) => this.setState({ newIncome: e.target.value })}
                  placeholder="Enter your monthly income"
                  step="0.01"
                  style={sectionStyles.input}
                />
                <button
                  onClick={() => {
                    this.handleIncomeChange(newIncome);
                    this.setState({ newIncome: '' });
                  }}
                  style={sectionStyles.submitBtn}
                >
                  ✅ Update Income
                </button>
              </div>
            </div>
          </div>
        );

      case 'Analytics':
        return (
          <div style={{ ...sectionStyles.formCard, backgroundColor: themeColors.cardBg, color: themeColors.text }}>
            <h3>📈 Financial Analytics</h3>
            <div style={sectionStyles.analyticsGrid}>
              <div style={{ ...sectionStyles.analyticsCard, backgroundColor: themeColors.bg, borderColor: themeColors.border }}>
                <div style={{ color: themeColors.textSecondary }}>Savings Rate</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4ade80' }}>
                  {savingsPercentage.toFixed(1)}%
                </div>
              </div>
              <div style={{ ...sectionStyles.analyticsCard, backgroundColor: themeColors.bg, borderColor: themeColors.border }}>
                <div style={{ color: themeColors.textSecondary }}>Expense Ratio</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f97316' }}>
                  {budgetPercentage.toFixed(1)}%
                </div>
              </div>
              <div style={{ ...sectionStyles.analyticsCard, backgroundColor: themeColors.bg, borderColor: themeColors.border }}>
                <div style={{ color: themeColors.textSecondary }}>Average Expense</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: themeColors.accent }}>
                  ₹{expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : '0.00'}
                </div>
              </div>
            </div>
            <Charts expenses={expenses} isDark={isDark} themeColors={themeColors} />
          </div>
        );

      case 'Budget':
        return (
          <div style={{ ...sectionStyles.formCard, backgroundColor: themeColors.cardBg, color: themeColors.text }}>
            <h3>🎯 Budget Tracking</h3>
            <div style={sectionStyles.budgetContainer}>
              <div style={sectionStyles.budgetItem}>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>Income: ₹{income.toFixed(2)}</span>
                </div>
                <div style={{ ...sectionStyles.progressBar, backgroundColor: themeColors.bg, height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: '100%',
                      backgroundColor: '#4ade80',
                    }}
                  />
                </div>
              </div>

              <div style={sectionStyles.budgetItem}>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>Expenses: ₹{totalExpenses.toFixed(2)}</span>
                  <span style={{ float: 'right', color: themeColors.textSecondary }}>{budgetPercentage.toFixed(1)}%</span>
                </div>
                <div style={{ ...sectionStyles.progressBar, backgroundColor: themeColors.bg, height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(budgetPercentage, 100)}%`,
                      backgroundColor: budgetPercentage > 100 ? '#dc2626' : budgetPercentage > 80 ? '#f97316' : '#4ade80',
                    }}
                  />
                </div>
              </div>

              <div style={{ ...sectionStyles.budgetItem, marginTop: '20px', padding: '15px', backgroundColor: themeColors.bg, borderRadius: '8px' }}>
                <div>Remaining: <span style={{ fontSize: '20px', fontWeight: 'bold', color: balance >= 0 ? '#4ade80' : '#dc2626' }}>₹{balance.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        );

      case 'AI Assistant':
        return <AIAssistant expenses={expenses} income={income} themeColors={themeColors} />;

      default:
        return null;
    }
  };

  render() {
    const { theme, user, onLogout, toggleTheme, themeColors, onNavigatePremium } = this.props;
    return (
      <div style={{ ...styles.container, backgroundColor: themeColors.bg, color: themeColors.text }}>
        <Sidebar
          user={user}
          onLogout={onLogout}
          theme={theme}
          toggleTheme={toggleTheme}
          themeColors={themeColors}
          currentSection={this.state.currentSection}
          onSectionChange={(section) => this.setState({ currentSection: section })}
          onNavigatePremium={onNavigatePremium}
        />
        <div style={styles.mainContent}>
          <div style={styles.contentWrapper}>{this.renderSection()}</div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  mainContent: {
    flex: 1,
    overflow: 'auto',
    padding: '20px',
  },
  contentWrapper: {
    maxWidth: '1400px',
  },
};

const sectionStyles = {
  dashboardGrid: {
    display: 'grid',
    gap: '20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  statCard: {
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '14px',
    marginBottom: '10px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
  },
  chartsContainer: {
    backgroundColor: 'transparent',
    padding: '20px',
    borderRadius: '12px',
  },
  aiPreview: {
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    marginTop: '20px',
  },
  formCard: {
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  form: {
    display: 'grid',
    gap: '15px',
    marginTop: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  input: {
    padding: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  submitBtn: {
    padding: '10px 14px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  deleteBtn: {
    marginTop: '8px',
    padding: '6px 10px',
    backgroundColor: 'transparent',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  expensesList: {
    display: 'grid',
    gap: '12px',
  },
  expenseItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid',
    alignItems: 'center',
  },
  incomeSection: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  incomeDisplay: {
    flex: '1 1 300px',
  },
  incomeForm: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  analyticsCard: {
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid',
    textAlign: 'center',
  },
  budgetContainer: {
    display: 'grid',
    gap: '16px',
  },
  budgetItem: {
    display: 'block',
  },
  progressBar: {},
};
