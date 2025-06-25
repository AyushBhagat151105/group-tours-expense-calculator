import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface createTripTypes {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  currency: string;
}

// ---------------------------
// GET Trips
// ---------------------------
const getTrips = async () => {
  const response = await axiosInstance.get("/trip/trips");
  return response.data.data;
};

export const useGetTrips = () => {
  const { authUser } = useAuthStore();

  return useQuery({
    queryKey: ["trips", authUser?.id],
    queryFn: getTrips,
    enabled: !!authUser?.id,
  });
};

// ---------------------------
// CREATE Trip
// ---------------------------
const createTrip = async (data: createTripTypes) => {
  const response = await axiosInstance.post("/trip/create-trip", data);
  return response.data.data;
};

export const useCreateTrip = () => {
  const { authUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTrip,
    onSuccess: (data) => {
      toast.success(data.message || "Trip created successfully");
      queryClient.invalidateQueries({ queryKey: ["trips", authUser?.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error creating trip");
    },
  });
};

// ---------------------------
// DELETE Trip
// ---------------------------
const deleteTrip = async (id: string) => {
  const response = await axiosInstance.delete(`/delete-trip/${id}`);
  return response.data.data;
};

export const useDeleteTrip = () => {
  const { authUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTrip(id),
    onSuccess: (data) => {
      toast.success(data.message || "Trip deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["trips", authUser?.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error deleting trip");
    },
  });
};
