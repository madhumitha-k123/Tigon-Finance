import React from 'react';

export default class AIAssistant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRoast: false,
      iceIdx: Math.floor(Math.random() * 26),
    };
  }

  getRecommendation = () => {
    const { expenses, income } = this.props;
    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    const savingsPercentage = income > 0 ? ((income - totalExpenses) / income) * 100 : 0;
    const budgetPercentage = income > 0 ? (totalExpenses / income) * 100 : 0;
    const overage = totalExpenses - income;

    if (budgetPercentage > 100) {
      return {
        title: '🚨 BRUH NO 🚨',
        tier: 'CRITICAL OVERSPEND',
        message: `You're spending ₹${overage.toFixed(2)} MORE than you earn! That's literally breaking the laws of economics bro.`,
        advice: [
          `1. IMMEDIATELY stop all subscriptions you don't use`,
          `2. Delete UberEats, Swiggy, and all food apps from your phone`,
          `3. Eat from home like a normal person`,
          `4. Pause your gym membership (you weren't going anyway)`,
          `5. Literally ANYTHING is better than going broke`,
        ],
      };
    }

    if (budgetPercentage > 85 && budgetPercentage <= 100) {
      return {
        title: '🔴 CODE RED ALERT 🔴',
        tier: 'CRITICAL SPENDING',
        message: `You're at ${budgetPercentage.toFixed(1)}% of your income spent. That's DANGEROUSLY close to zero savings.`,
        advice: [
          `1. Cut back on weekly dining out immediately`,
          `2. Review your subscriptions - there's definitely wastage here`,
          `3. Stop impulse shopping, BESTIE`,
          `4. Start a "no-spend" week challenge`,
          `5. Your future self will HATE you if you keep this up`,
        ],
      };
    }

    if (budgetPercentage > 75 && budgetPercentage <= 85) {
      return {
        title: '🟠 HEY BESTIE 🟠',
        tier: 'WARNING ZONE',
        message: `At ${budgetPercentage.toFixed(1)}%, you're spending most of your income. Not great, not terrible... but trending wrong.`,
        advice: [
          `1. Track every single expense for a week`,
          `2. Identify and cut 2 non-essential recurring expenses`,
          `3. Pack lunch instead of buying: saves ~₹300/week`,
          `4. Limit dining out to 2x per week MAX`,
          `5. You can do better - start now!`,
        ],
      };
    }

    if (totalExpenses > income) {
      return {
        title: '💸 CRITICAL RIZZ LOSS 💸',
        tier: 'OVERSPENDING',
        message: `Your expenses exceed your income by ₹${overage.toFixed(2)}. You're literally eating into savings/debt.`,
        advice: [
          `1. This is unsustainable - make cuts TODAY`,
          `2. Create a strict budget and stick to it`,
          `3. Pause ALL discretionary spending`,
          `4. Focus only on essentials (food, rent, utilities)`,
          `5. Get a side hustle ASAP`,
        ],
      };
    }

    if (savingsPercentage < 5) {
      return {
        title: '😬 YIKES ENERGY 😬',
        tier: 'MINIMAL SAVINGS',
        message: `You're only saving ${savingsPercentage.toFixed(1)}%! That's basically... nothing.`,
        advice: [
          `1. Find ₹50-100/day to save by cutting small stuff`,
          `2. Use cashback apps and coupons strategically`,
          `3. Reduce energy bills by 15% (lights off, AC smartly)`,
          `4. Meal prep on Sundays instead of ordering`,
          `5. ₹1500/month savings = ₹18K/year. Start NOW.`,
        ],
      };
    }

    if (savingsPercentage >= 5 && savingsPercentage < 15) {
      return {
        title: "💬 LET'S TALK 💬",
        tier: 'LOW SAVINGS',
        message: `Saving ${savingsPercentage.toFixed(1)}%? It's something, but we need to talk about optimization.`,
        advice: [
          `1. Automate ₹500 transfer to savings on payday`,
          `2. Use "pay yourself first" principle`,
          `3. Review subscriptions - cut at least 3`,
          `4. Find 2 areas where you can spend 20% less`,
          `5. You're capable of ${Math.round(savingsPercentage + 5)}% - push for it!`,
        ],
      };
    }

    if (savingsPercentage >= 15 && savingsPercentage < 20) {
      return {
        title: '👍 LOWKEY NOT BAD 👍',
        tier: 'DECENT SAVINGS',
        message: `Saving ${savingsPercentage.toFixed(1)}%? Not bad at all! You're building a foundation.`,
        advice: [
          `1. Push to achieve 20% savings rate`,
          `2. Invest your savings - don't let inflation eat it`,
          `3. Start an emergency fund if you haven't`,
          `4. Look into high-yield savings accounts`,
          `5. You're on the right track - KEEP GOING!`,
        ],
      };
    }

    if (savingsPercentage >= 20 && savingsPercentage < 30) {
      return {
        title: '⚡ FINANCIAL RIZZ UNLOCKED ⚡',
        tier: 'GOOD SAVINGS',
        message: `${savingsPercentage.toFixed(1)}% savings rate? BRO/SIS, you're officially making smart moves!`,
        advice: [
          `1. Diversify: stocks, bonds, mutual funds`,
          `2. Start building your investment portfolio`,
          `3. Plan for retirement starting NOW`,
          `4. Target 6-month emergency fund`,
          `5. You're literally WINNING - benchmark is 20-30%!`,
        ],
      };
    }

    return {
      title: '🎯 ABSOLUTELY UNHINGED 🎯',
      tier: 'ELITE SAVINGS',
      message: `${savingsPercentage.toFixed(1)}% savings rate?! You're literally in the TOP 5% financially. Certified BOSS.`,
      advice: [
        `1. You've mastered the basics - time for wealth building`,
        `2. Aggressive investing: 60% stocks, 30% bonds, 10% alternatives`,
        `3. Start side investments: real estate, startups, etc.`,
        `4. Plan for financial independence/retirement`,
        `5. You're the template others should follow - INSPIRE PEOPLE!`,
      ],
    };
  };

  render() {
    const { themeColors, expenses, income } = this.props;
    const { iceIdx } = this.state;
    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    const savingsPercentage = income > 0 ? ((income - totalExpenses) / income) * 100 : 0;
    const budgetPercentage = income > 0 ? (totalExpenses / income) * 100 : 0;
    const recommendation = this.getRecommendation();
    const iceBreakers = [
      "Bro, your spending is like a mystery anime - unexpected plot twists every episode",
      "Your bank balance and my faith in humanity have something in common: both decreasing",
      "If your savings was a Netflix series, it would be: CANCELLED after Season 1",
      "Your financial health is like my love life: a tragedy waiting to happen",
      "Spending money like it's going out of style... which it IS because you're BROKE",
      "Your expenses are my ringtone - they NEVER stop",
      "That budget you made? Cute. Very cute. Like a participation trophy cute.",
      "Your savings rate is so low, it's doing limbo with my self-esteem",
      "I've seen better financial planning in a toddler's piggy bank",
      "Your money is like sand - you keep losing it through your fingers",
      "Breakup alert: You and financial stability need to talk",
      "Your spending habits are giving 'yes man' energy - saying yes to EVERYTHING",
      "That's a big yikes for your portfolio, chief",
      "Your financial decisions are like your WiFi: EVERYWHERE and NOWHERE",
      "Losing money faster than I can roast you about it",
      "Your bank: 'Sir... ma'am... we need to talk'",
      "If money was calories, you'd be THICC with debt",
      "That dip in your savings? That's you YEET-ing money into the void",
      "Your expense tracking is like my gym membership - ABANDONED",
      "The only thing growing faster than your expenses is my disappointment",
      "You're not broke, you're just FINANCIALLY CREATIVE",
      "Your balance sheet looks like my emotional availability: NON-EXISTENT",
      "That's not sustainable, king/queen... that's a CATASTROPHE",
      "Your savings goal and reality are having a CIVIL WAR",
      "Congratulations! You've unlocked the achievement: BROKE AS A JOKE",
      "Your income-to-expense ratio is giving 'unbalanced' energy",
    ];
    const randomIceBreaker = iceBreakers[iceIdx];

    return (
      <div style={{ ...styles.container, backgroundColor: themeColors.bg, color: themeColors.text }}>
        <div style={{ ...styles.card, backgroundColor: themeColors.cardBg }}>
          <h2 style={styles.title}>🤖 Your AI Financial Advisor</h2>

          {/* Stats */}
          <div style={styles.statsGrid}>
            <div style={{ ...styles.stat, backgroundColor: themeColors.bg }}>
              <div style={{ color: themeColors.textSecondary }}>Monthly Income</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ade80' }}>₹{income.toFixed(2)}</div>
            </div>
            <div style={{ ...styles.stat, backgroundColor: themeColors.bg }}>
              <div style={{ color: themeColors.textSecondary }}>Total Expenses</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f97316' }}>₹{totalExpenses.toFixed(2)}</div>
            </div>
            <div style={{ ...styles.stat, backgroundColor: themeColors.bg }}>
              <div style={{ color: themeColors.textSecondary }}>Savings Rate</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: themeColors.accent }}>{savingsPercentage.toFixed(1)}%</div>
            </div>
          </div>

          {/* Recommendation */}
          <div style={{ ...styles.recommendationBox, backgroundColor: themeColors.cardBg, borderColor: themeColors.border }}>
            <h3 style={{ ...styles.recommendationTitle, color: recommendation.tier.includes('CRITICAL') ? '#dc2626' : themeColors.accent }}>
              {recommendation.title}
            </h3>
            <p style={{ ...styles.recommendationMessage, color: themeColors.text }}>
              {recommendation.message}
            </p>
            <div style={styles.adviceList}>
              {recommendation.advice.map((item, idx) => (
                <div key={idx} style={{ ...styles.adviceItem, color: themeColors.text }}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Ice Breaker */}
          <div style={{ ...styles.iceBreaker, backgroundColor: themeColors.bg, borderColor: themeColors.accent }}>
            <p style={{ fontStyle: 'italic', color: themeColors.textSecondary }}>
              "{randomIceBreaker}"
            </p>
          </div>

          {/* Action Button */}
          <button
            style={styles.actionButton}
            onClick={() => this.setState({ showRoast: !this.state.showRoast })}
          >
            {this.state.showRoast ? 'Hide Advice' : 'Show Full Advice'}
          </button>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    padding: '20px',
    borderRadius: '12px',
  },
  card: {
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  stat: {
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  recommendationBox: {
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid',
    marginBottom: '15px',
  },
  recommendationTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  recommendationMessage: {
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  adviceList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  adviceItem: {
    paddingLeft: '10px',
    borderLeft: '2px solid',
    fontSize: '14px',
  },
  iceBreaker: {
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid',
    marginBottom: '15px',
    fontStyle: 'italic',
  },
  actionButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};
