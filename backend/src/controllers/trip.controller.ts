import { db } from "@/db";
import { AuthenticatedRequest } from "@/types/express";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { Response } from "express";

export const createTrip = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    const { name, location, startDate, endDate, currency } = req.body;

    if (!name || !location || !startDate || !endDate || !currency) {
      throw new ApiError(400, "Invalid request");
    }

    const trip = await db.trip.create({
      data: {
        name,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        currency,
        createdBy: userId as string,
        TripMember: {
          create: {
            user: {
              connect: { id: userId as string },
            },
          },
        },
      },
      include: {
        TripMember: true,
      },
    });

    if (!trip) {
      throw new ApiError(500, "Something went wrong while creating trip");
    }

    res
      .status(201)
      .json(new ApiResponse(201, "Trip created successfully", trip));
  }
);

export const getTrip = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    const trip = await db.trip.findFirst({
      where: {
        id: id,
        OR: [
          { createdBy: userId as string },
          {
            TripMember: {
              some: {
                userId: userId as string,
              },
            },
          },
        ],
      },
      include: {
        TripMember: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatar: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    if (!trip) throw new ApiError(404, "Trip not found");

    console.log("Original TripMember count:", trip.TripMember.length);

    const transformedTrip = {
      ...trip,
      members: trip.TripMember.map((member) => member.user),
      TripMember: undefined,
    };

    console.log("Transformed members count:", transformedTrip.members.length);

    res
      .status(200)
      .json(
        new ApiResponse(200, "Trip retrieved successfully", transformedTrip)
      );
  }
);

export const getTrips = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    const trips = await db.trip.findMany({
      where: {
        OR: [
          { createdBy: userId as string },
          { TripMember: { some: { userId: userId as string } } },
        ],
      },
    });

    if (!trips) throw new ApiError(404, "Trip not found");
    res
      .status(200)
      .json(new ApiResponse(200, "Trip retrieved successfully", trips));
  }
);

export const updateTrip = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    const { name, location, startDate, endDate, currency } = req.body;

    if (!name || !location || !startDate || !endDate || !currency) {
      throw new ApiError(400, "Invalid request");
    }

    const trip = await db.trip.update({
      where: {
        id: id,
      },
      data: {
        name,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        currency,
      },
    });

    if (!trip) throw new ApiError(404, "Trip not found");

    res
      .status(200)
      .json(new ApiResponse(200, "Trip updated successfully", trip));
  }
);

export const deleteTrip = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const { id: tripId } = req.params;

    if (!userId) throw new ApiError(401, "Unauthorized");

    const trip = await db.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) throw new ApiError(404, "Trip not found");

    if (trip.createdBy !== userId) {
      throw new ApiError(403, "Only the creator can delete this trip");
    }

    const deletedTrip = await db.trip.delete({
      where: { id: tripId },
      include: {
        TripMember: true,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Trip deleted successfully", deletedTrip));
  }
);

export const addMember = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id: tripId } = req.params;
    const { userId } = req.body;

    if (!userId) throw new ApiError(400, "User ID is required");

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new ApiError(404, "User not found");

    const trip = await db.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) throw new ApiError(404, "Trip not found");

    // Check if already a member
    const existingMember = await db.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId,
          userId,
        },
      },
    });

    if (existingMember) {
      throw new ApiError(409, "User is already a member of this trip");
    }

    // Add new member
    const newMember = await db.tripMember.create({
      data: {
        userId,
        tripId,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Member added successfully", newMember));
  }
);

export const removeMember = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const currentUserId = req.user?.id;
    const { id: tripId, userId } = req.params;

    const trip = await db.trip.findFirst({
      where: {
        id: tripId,
        createdBy: currentUserId as string,
      },
    });

    if (!trip) throw new ApiError(403, "Only trip creator can remove members");

    if (userId === trip.createdBy) {
      throw new ApiError(400, "Trip creator cannot be removed");
    }

    const existingMember = await db.tripMember.findFirst({
      where: {
        tripId: tripId,
        userId: userId,
      },
    });

    if (!existingMember) throw new ApiError(404, "Member not found in trip");

    const tripMember = await db.tripMember.delete({
      where: {
        tripId_userId: {
          tripId: tripId,
          userId: userId,
        },
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Member removed successfully", tripMember));
  }
);

export const getAllUsers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, "Unauthorized");
    const search = req.query.search as string;
    const users = await db.user.findMany({
      where: {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { fullName: { contains: search, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
      },
    });
    res
      .status(200)
      .json(new ApiResponse(200, "Users retrieved successfully", users));
  }
);
