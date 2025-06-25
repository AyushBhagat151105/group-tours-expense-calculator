import {
  createExpense,
  filterExpenses,
  getExpenseById,
  getExpenses,
  getTripExpenseSummary,
  getUserExpenseContribution,
  updateExpense,
} from "@/controllers/expense.controller";
import { isAuthenticated } from "@/middlewares/isAuthenticated";
import e, { Router } from "express";

export const expenseRoute = Router();

expenseRoute.post("/create-expense", isAuthenticated, createExpense);
expenseRoute.get("/expense/:id", isAuthenticated, getExpenses);
expenseRoute.get("/expenses/:id", isAuthenticated, getExpenseById);
expenseRoute.put("/update-expense/:id", isAuthenticated, updateExpense);
expenseRoute.get(
  "/expense-summary/:id",
  isAuthenticated,
  getTripExpenseSummary
);
expenseRoute.get(
  "/expense-contribution/:id",
  isAuthenticated,
  getUserExpenseContribution
);
expenseRoute.get("/filter-expenses", isAuthenticated, filterExpenses);
