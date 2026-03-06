import React from 'react';

export default class ExpenseForm extends React.Component {
  render() {
    const {
      expenseAmount,
      setExpenseAmount,
      expenseCategory,
      setExpenseCategory,
      addExpenses,
    } = this.props;

    return (
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Add Expense
        </h3>

        <input
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="number"
          value={expenseAmount}
          placeholder="Enter Amount"
          onChange={(e) => setExpenseAmount(e.target.value)}
        />

        <br /><br />

        <input
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          value={expenseCategory}
          placeholder="Enter Category"
          onChange={(e) => setExpenseCategory(e.target.value)}
        />

        <br /><br />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={addExpenses}
        >
          Add Expense
        </button>

      </div>
    );
  }
}
