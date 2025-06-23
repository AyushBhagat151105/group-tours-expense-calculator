import {
  addMember,
  createTrip,
  deleteTrip,
  getTrip,
  getTrips,
  removeMember,
  updateTrip,
} from "@/controllers/trip.controller";
import { isAuthenticated } from "@/middlewares/isAuthenticated";
import { Router } from "express";

export const tripRoute = Router();

tripRoute.post("/create-trip", isAuthenticated, createTrip);
tripRoute.get("/trips", isAuthenticated, getTrips);
tripRoute.get("/trips/:id", isAuthenticated, getTrip);
tripRoute.put("/update-trip/:id", isAuthenticated, updateTrip);
tripRoute.delete("/delete-trip/:id", isAuthenticated, deleteTrip);
tripRoute.post("/add-member/:id", isAuthenticated, addMember);
tripRoute.delete("/remove-member/:id", isAuthenticated, removeMember);
