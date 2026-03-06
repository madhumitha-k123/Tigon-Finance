import React, { useState, useEffect } from 'react';

// very simple calendar/reminder widget. reminders are stored in localStorage
// keyed by user id; the component takes a "user" and "themeColors" prop so it
// can blend with the rest of the dashboard.

export default function Calendar({ user, themeColors }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0 = Jan
  const [reminders, setReminders] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [newReminder, setNewReminder] = useState('');
  const [newColor, setNewColor] = useState(themeColors.accent || '#4ade80');

  // a small palette; theme accent first then some standard hues
  const colorOptions = [
    themeColors.accent || '#4ade80',
    '#f97316',
    '#06b6d4',
    '#ec4899',
    '#fde68a',
    '#a78bfa',
  ];

  // load reminders from localStorage when user changes
  // load reminders when the current user changes
  useEffect(() => {
    if (user) {
      const data = JSON.parse(
        localStorage.getItem(`tigon_reminders_${user.id}`) || '{}'
      );
      // defer the state update to the next microtask so React doesn't complain
      // about a synchronous setState inside an effect.
      Promise.resolve().then(() => setReminders(data));
    } else {
      Promise.resolve().then(() => setReminders({}));
    }
  }, [user]);

  // when reminders load, notify about today's tasks
  // notify about today's reminders when reminders load; compute date
  useEffect(() => {
    const now = new Date();
    const key = now.toISOString().split('T')[0];
    if (reminders[key] && reminders[key].length) {
      alert(
        `[Reminder] Today's reminders:\n` +
          reminders[key].map((r) => `- ${r.text}`).join('\n')
      );
    }
  }, [reminders]);

  const saveReminders = (updated) => {
    setReminders(updated);
    if (user) {
      localStorage.setItem(
        `tigon_reminders_${user.id}`,
        JSON.stringify(updated)
      );
    }
  };

  const addReminder = () => {
    if (!selectedDate || !newReminder.trim()) return;
    const key = selectedDate.toISOString().split('T')[0];
    const existing = reminders[key] || [];
    const newObj = { text: newReminder.trim(), color: newColor };
    const updated = { ...reminders, [key]: [...existing, newObj] };
    saveReminders(updated);
    setNewReminder('');
  };

  const deleteReminder = (index) => {
    if (!selectedDate) return;
    const key = selectedDate.toISOString().split('T')[0];
    const existing = reminders[key] || [];
    const updatedList = existing.filter((_, i) => i !== index);
    const updated = { ...reminders, [key]: updatedList };
    saveReminders(updated);
  };

  const changeReminderColor = (index, color) => {
    if (!selectedDate) return;
    const key = selectedDate.toISOString().split('T')[0];
    const existing = reminders[key] || [];
    const updatedList = existing.map((r, i) =>
      i === index ? { ...r, color } : r
    );
    const updated = { ...reminders, [key]: updatedList };
    saveReminders(updated);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const generateWeeks = () => {
    const weeks = [];
    let day = 1;
    for (let w = 0; w < 6; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        if (w === 0 && d < firstDayOfWeek) {
          week.push(null);
        } else if (day > daysInMonth) {
          week.push(null);
        } else {
          week.push(new Date(year, month, day));
          day += 1;
        }
      }
      weeks.push(week);
    }
    return weeks;
  };

  const weeks = generateWeeks();
  const monthName = new Date(year, month).toLocaleString('default', {
    month: 'long',
  });

  const navPrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };
  const navNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const formatKey = (d) => d.toISOString().split('T')[0];
  const controlStyle = {
    color: themeColors.text,
    backgroundColor: themeColors.bg,
    border: `1px solid ${themeColors.border}`,
    borderRadius: '6px',
    padding: '6px 8px',
  };
  const buttonStyle = {
    color: themeColors.text,
    backgroundColor: themeColors.cardBg,
    border: `1px solid ${themeColors.border}`,
    borderRadius: '6px',
    padding: '6px 10px',
    cursor: 'pointer',
  };

  return (
    <div style={{ color: themeColors.text }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <button onClick={navPrev} style={buttonStyle}>Prev</button>
        <h3>
          {monthName} {year}
        </h3>
        <button onClick={navNext} style={buttonStyle}>Next</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '560px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <th
                  key={d}
                  style={{ padding: '5px', color: themeColors.textSecondary }}
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((date, di) => (
                  <td
                    key={di}
                    onClick={() => date && setSelectedDate(date)}
                    style={{
                      padding: '10px',
                      border: '1px solid ' + themeColors.border,
                      verticalAlign: 'top',
                      height: '80px',
                      backgroundColor:
                        date && reminders[formatKey(date)]
                          ? (reminders[formatKey(date)][0].color || '#e0f2fe') + '33' // add transparency
                          : 'transparent',
                      cursor: date ? 'pointer' : 'default',
                    }}
                  >
                    {date ? date.getDate() : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDate && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '12px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              backgroundColor: themeColors.cardBg,
              padding: '20px',
              borderRadius: '8px',
              width: 'min(420px, 100%)',
              maxHeight: 'calc(100vh - 24px)',
              overflowY: 'auto',
            }}
          >
            <h4 style={{ margin: '0 0 10px 0' }}>
              {selectedDate.toDateString()}
            </h4>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {(reminders[formatKey(selectedDate)] || []).map((r, i) => (
                <div
                  key={i}
                  style={{
                    margin: '6px 0',
                    padding: '6px',
                    border: '1px solid ' + themeColors.border,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <span style={{ color: r.color || themeColors.text, flex: 1 }}>
                    - {r.text}
                  </span>
                  <select
                    value={r.color || themeColors.accent}
                    onChange={(e) => changeReminderColor(i, e.target.value)}
                    style={{ ...controlStyle, fontSize: '12px' }}
                  >
                    {colorOptions.map((c) => (
                      <option key={c} value={c} style={{ color: c }}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteReminder(i)}
                    style={buttonStyle}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
              placeholder="New reminder"
              style={{ ...controlStyle, width: '100%', margin: '5px 0' }}
            />
            <div style={{ margin: '5px 0' }}>
              <label style={{ fontSize: '12px', marginRight: '8px' }}>Color:</label>
              <select
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                style={controlStyle}
              >
                {colorOptions.map((c) => (
                  <option key={c} value={c} style={{ color: c }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ textAlign: 'right' }}>
              <button onClick={addReminder} style={{ ...buttonStyle, marginRight: '10px' }}>
                Add
              </button>
              <button onClick={() => setSelectedDate(null)} style={buttonStyle}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

