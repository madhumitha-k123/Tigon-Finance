import React from 'react';

export default class ExpenseList extends React.Component {
  render() {
    const { expenses } = this.props;
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Expense List
        </h3>

        {expenses.length === 0 ? (
          <p className="text-gray-500 text-sm">No expenses added yet.</p>
        ) : (
          <ul>
            {expenses.map((exp, index) => (
              <li className="text-grey-600" key={index}>
                {exp.category}: ₹{exp.amount}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
