import { db } from "@/db";
import { AuthenticatedRequest } from "@/types/express";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { Response } from "express";

export const createExpense = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    const { title, amount, category, notes, splits, tripId } = req.body;

    if (!userId) throw new ApiError(401, "Unauthorized");

    if (!title || !amount) throw new ApiError(400, "Invalid request");

    if (!Array.isArray(splits) || splits.length === 0) {
      throw new ApiError(400, "At least one split is required");
    }

    const totalSplitAmount = splits.reduce(
      (sum, s) => sum + Number(s.amount),
      0
    );

    if (Number(totalSplitAmount.toFixed(2)) !== Number(amount.toFixed(2))) {
      throw new ApiError(
        400,
        `Split amounts (${totalSplitAmount}) must equal the total expense amount (${amount})`
      );
    }

    const expense = await db.expense.create({
      data: {
        title,
        amount,
        category,
        notes,
        tripId,
        paidById: userId,
        ExpenseSplit: {
          create: splits.map((s: { userId: string; amount: number }) => ({
            userId: s.userId,
            amount: s.amount,
          })),
        },
      },
      include: {
        ExpenseSplit: true,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Expense created with splits", expense));
  }
);

export const getExpenses = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const { id: tripId } = req.params;

    if (!tripId) {
      throw new ApiError(400, "Trip id is required");
    }

    const expense = await db.expense.findMany({
      where: {
        tripId: tripId,
      },
    });

    if (!expense) throw new ApiError(404, "Expense not found");

    res
      .status(200)
      .json(new ApiResponse(200, "Expense retrieved successfully", expense));
  }
);

export const updateExpense = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const { id: expenseId } = req.params;

    const { title, amount, category, notes } = req.body;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!expenseId) {
      throw new ApiError(400, "Expense id is required");
    }

    if (!title || !amount || !category || !notes) {
      throw new ApiError(400, "Invalid request");
    }

    const expense = await db.expense.update({
      where: {
        id: expenseId,
      },
      data: {
        title,
        amount,
        category,
        notes,
      },
    });

    if (!expense) throw new ApiError(404, "Expense not found");

    res
      .status(200)
      .json(new ApiResponse(200, "Expense updated successfully", expense));
  }
);

export const getExpenseById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { expenseId } = req.params;

    if (!expenseId) {
      throw new ApiError(400, "Expense ID is required");
    }

    const expense = await db.expense.findUnique({
      where: { id: expenseId },
      include: {
        paidBy: true,
        ExpenseSplit: true,
      },
    });

    if (!expense) throw new ApiError(404, "Expense not found");

    res
      .status(200)
      .json(new ApiResponse(200, "Expense fetched successfully", expense));
  }
);

export const getTripExpenseSummary = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id: tripId } = req.params;

    const total = await db.expense.aggregate({
      where: { tripId },
      _sum: {
        amount: true,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Trip expense summary", total._sum));
  }
);

export const filterExpenses = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id: tripId } = req.params;
    const { category, startDate, endDate } = req.query;

    const expense = await db.expense.findMany({
      where: {
        tripId,
        category: category ? String(category) : undefined,
        createdAt: {
          gte: startDate ? new Date(String(startDate)) : undefined,
          lte: endDate ? new Date(String(endDate)) : undefined,
        },
      },
    });

    res.status(200).json(new ApiResponse(200, "Filtered expenses", expense));
  }
);

export const getUserExpenseContribution = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id: tripId } = req.params;

    const result = await db.expense.groupBy({
      by: ["paidById"],
      where: { tripId },
      _sum: {
        amount: true,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, "User-wise contribution", result));
  }
);
