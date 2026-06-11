import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import './Dashboard.css';

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    transactionDate: '',
    category: '',
    budgetId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transRes, budRes] = await Promise.all([
        axiosInstance.get('/transactions'),
        axiosInstance.get('/budgets')
      ]);
      setTransactions(transRes.data.transactions);
      setBudgets(budRes.data.budgets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/transactions', {
        ...formData,
        budgetId: formData.budgetId || null
      });
      setFormData({
        description: '',
        amount: '',
        transactionDate: '',
        category: '',
        budgetId: ''
      });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axiosInstance.delete(`/transactions/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="transaction-view">
      <h2>Transactions</h2>
      {!showForm && (
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Transaction
        </button>
      )}

      {showForm && (
        <form className="transaction-form" onSubmit={handleSubmit}>
          <h3>Add New Transaction</h3>
          <div className="form-group">
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g., Grocery shopping"
              required
            />
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Budget (Optional):</label>
            <select
              name="budgetId"
              value={formData.budgetId}
              onChange={handleInputChange}
            >
              <option value="">Select Budget</option>
              {budgets.map(budget => (
                <option key={budget.id} value={budget.id}>{budget.name}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Add Transaction</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="transactions-list">
        {transactions.length === 0 ? (
          <p className="empty-message">No transactions yet.</p>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.description}</td>
                  <td>${parseFloat(transaction.amount).toFixed(2)}</td>
                  <td>{transaction.category}</td>
                  <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(transaction.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TransactionList;
