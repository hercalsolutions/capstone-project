const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class Transaction {
  static async create(userId, description, amount, transactionDate, category, budgetId = null) {
    const id = uuidv4();
    const query = `
      INSERT INTO transactions (id, user_id, budget_id, description, amount, transaction_date, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await pool.query(query, [id, userId, budgetId, description, amount, transactionDate, category]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM transactions WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, description, amount, transactionDate, category, budgetId = null) {
    const query = `
      UPDATE transactions 
      SET description = $2, amount = $3, transaction_date = $4, category = $5, budget_id = $6
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id, description, amount, transactionDate, category, budgetId]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM transactions WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByBudgetId(budgetId) {
    const query = 'SELECT * FROM transactions WHERE budget_id = $1 ORDER BY transaction_date DESC';
    const result = await pool.query(query, [budgetId]);
    return result.rows;
  }

  static async getSpentByCategory(userId, budgetId) {
    const query = `
      SELECT category, SUM(amount) as total 
      FROM transactions 
      WHERE user_id = $1 AND budget_id = $2
      GROUP BY category
    `;
    const result = await pool.query(query, [userId, budgetId]);
    return result.rows;
  }
}

module.exports = Transaction;
