const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

const transactionController = {
  createTransaction: async (req, res, next) => {
    try {
      const { description, amount, transactionDate, category, budgetId } = req.body;
      const userId = req.user.id;

      // Validation
      if (!description || !amount || !transactionDate || !category) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
      }

      // Verify budget belongs to user if provided
      if (budgetId) {
        const budget = await Budget.findById(budgetId);
        if (!budget || budget.user_id !== userId) {
          return res.status(404).json({ message: 'Budget not found' });
        }
      }

      const transaction = await Transaction.create(
        userId,
        description,
        amount,
        transactionDate,
        category,
        budgetId || null
      );

      res.status(201).json({ message: 'Transaction created successfully', transaction });
    } catch (error) {
      next(error);
    }
  },

  getTransactions: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const transactions = await Transaction.findByUserId(userId);
      res.status(200).json({ transactions });
    } catch (error) {
      next(error);
    }
  },

  getTransactionById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findById(id);

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      if (transaction.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      res.status(200).json({ transaction });
    } catch (error) {
      next(error);
    }
  },

  updateTransaction: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { description, amount, transactionDate, category, budgetId } = req.body;

      const existingTransaction = await Transaction.findById(id);
      if (!existingTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      if (existingTransaction.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const updatedTransaction = await Transaction.update(
        id,
        description,
        amount,
        transactionDate,
        category,
        budgetId || null
      );

      res.status(200).json({ message: 'Transaction updated successfully', transaction: updatedTransaction });
    } catch (error) {
      next(error);
    }
  },

  deleteTransaction: async (req, res, next) => {
    try {
      const { id } = req.params;

      const existingTransaction = await Transaction.findById(id);
      if (!existingTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      if (existingTransaction.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      await Transaction.delete(id);
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  getSpentByCategory: async (req, res, next) => {
    try {
      const { budgetId } = req.params;
      const userId = req.user.id;

      const budget = await Budget.findById(budgetId);
      if (!budget || budget.user_id !== userId) {
        return res.status(404).json({ message: 'Budget not found' });
      }

      const spentByCategory = await Transaction.getSpentByCategory(userId, budgetId);
      res.status(200).json({ spentByCategory });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = transactionController;
