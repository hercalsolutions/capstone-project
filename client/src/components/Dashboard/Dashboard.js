import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/authActions';
import { useNavigate } from 'react-router-dom';
import BudgetView from './BudgetView';
import TransactionList from './TransactionList';
import './Dashboard.css';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username || 'User'}!</h1>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-content">
        <BudgetView />
        <TransactionList />
      </div>
    </div>
  );
}

export default Dashboard;
