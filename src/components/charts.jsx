import React from 'react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// note: some charts colors were previously hard-coded blue/purple.
// we now accept themeColors so the accent color can be used consistently
export default class Charts extends React.Component {
  render() {
    const { expenses, isDark, themeColors } = this.props;
    const COLORS = [
      themeColors?.accent || '#667eea',
      '#764ba2',
      '#f97316',
      '#4ade80',
      '#06b6d4',
      '#ec4899',
    ];
    // Prepare data for different charts
    const categoryData = {};
    expenses.forEach((exp) => {
      categoryData[exp.category] = (categoryData[exp.category] || 0) + exp.amount;
    });

    const pieData = Object.entries(categoryData).map(([name, value]) => ({
      name,
      value,
    }));

    // Daily trend data
    const dailyData = {};
    expenses.forEach((exp) => {
      const date = exp.date || new Date().toLocaleDateString();
      dailyData[date] = (dailyData[date] || 0) + exp.amount;
    });

    const lineData = Object.entries(dailyData)
      .slice(-7)
      .map(([date, amount]) => ({
        date,
        amount,
      }));

    // Cumulative area data
    let cumulative = 0;
    const areaData = lineData.map((item) => {
      cumulative += item.amount;
      return { ...item, cumulative };
    });

    // Category bar data
    const barData = pieData.slice(0, 6);

    // Waterfall data
    const waterfallData = barData.map((item, index) => ({
      name: item.name,
      individual: item.value,
      cumulative: barData.slice(0, index + 1).reduce((sum, b) => sum + b.value, 0),
    }));

    const textColor = isDark ? '#f1f5f9' : '#0f172a';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    return (
      <div style={styles.chartsContainer}>
        {/* Pie Chart */}
        <div style={styles.chartWrapper}>
          <h3 style={{ color: textColor, marginBottom: '15px' }}>💰 Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div style={styles.chartWrapper}>
          <h3 style={{ color: textColor, marginBottom: '15px' }}>📊 Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff' }} />
              <Bar dataKey="value" fill={themeColors?.accent || '#667eea'} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div style={styles.chartWrapper}>
          <h3 style={{ color: textColor, marginBottom: '15px' }}>🍩 Expense Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        {lineData.length > 0 && (
          <div style={styles.chartWrapper}>
            <h3 style={{ color: textColor, marginBottom: '15px' }}>📈 Daily Spending Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={textColor} />
                <YAxis stroke={textColor} />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff' }} />
                <Line type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Area Chart */}
        {areaData.length > 0 && (
          <div style={styles.chartWrapper}>
            <h3 style={{ color: textColor, marginBottom: '15px' }}>📉 Cumulative Spending</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={textColor} />
                <YAxis stroke={textColor} />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff' }} />
                <Area type="monotone" dataKey="cumulative" stroke="#4ade80" fillOpacity={1} fill="url(#colorCumulative)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Waterfall Chart */}
        {waterfallData.length > 0 && (
          <div style={styles.chartWrapper}>
            <h3 style={{ color: textColor, marginBottom: '15px' }}>🌊 Cumulative Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={waterfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={textColor} />
                <YAxis stroke={textColor} />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff' }} />
                <Bar dataKey="individual" stackId="a" fill={themeColors?.accent || '#667eea'} radius={[8, 8, 0, 0]} />
                <Bar dataKey="cumulative" stackId="b" fill="#764ba2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }
}

const styles = {
  chartsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  chartWrapper: {
    backgroundColor: 'transparent',
    padding: '15px',
    borderRadius: '12px',
  },
};
