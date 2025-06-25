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

const getTripById = async (id: string) => {
  const response = await axiosInstance.get(`/trip/trips/${id}`);
  return response.data.data;
};

export const useGetTripById = (id: string) => {
  const { authUser } = useAuthStore();
  return useQuery({
    queryKey: ["trip", authUser?.id],
    queryFn: () => getTripById(id),
    enabled: !!id,
  });
};

interface UpdateTripTypes extends createTripTypes {
  id: string;
}

const updateTrip = async ({ id, ...data }: UpdateTripTypes) => {
  const response = await axiosInstance.put(`/trip/update-trip/${id}`, data);
  return response.data.data;
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthStore();

  return useMutation({
    mutationFn: updateTrip,
    onSuccess: () => {
      toast.success("Trip updated successfully");
      queryClient.invalidateQueries({ queryKey: ["trips", authUser?.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update trip");
    },
  });
};

const addMember = async ({ id, userId }: { id: string; userId: string }) => {
  const response = await axiosInstance.post(`/trip/add-member/${id}`, {
    userId,
  });
  return response.data.data;
};

export const useAddMember = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthStore();

  return useMutation({
    mutationFn: addMember,
    onSuccess: () => {
      toast.success("Member added successfully");
      queryClient.invalidateQueries({ queryKey: ["trip", authUser?.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add member");
    },
  });
};

const removeMember = async ({
  tripId,
  userId,
}: {
  tripId: string;
  userId: string;
}) => {
  const response = await axiosInstance.delete(
    `/trip/trips/${tripId}/members/${userId}`
  );
  return response.data.data;
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeMember,
    onSuccess: () => {
      toast.success("Member removed successfully");
      queryClient.invalidateQueries({ queryKey: ["trip"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove member");
    },
  });
};

interface Split {
  userId: string;
  amount: number;
}

interface CreateExpensePayload {
  title: string;
  amount: number;
  category?: string;
  notes?: string;
  tripId: string;
  splits: Split[];
}

const createExpense = async (data: CreateExpensePayload) => {
  const response = await axiosInstance.post("/expense/create-expense", data);
  return response.data.data;
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      toast.success("Expense created successfully");
      queryClient.invalidateQueries();
    },
    onError: (error: any) => {
      toast.error(error.message || "Error creating expense");
    },
  });
};

const getExpenses = async (id: string) => {
  const response = await axiosInstance.get(`/expense/expense/${id}`);
  return response.data.data;
};

export const useGetExpenses = (tripId: string) => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: () => getExpenses(tripId),
    enabled: !!tripId,
  });
};

const getExpenseById = async (id: string) => {
  const response = await axiosInstance.get(`/expense/expenses/${id}`);
  return response.data.data;
};

export const useGetExpenseById = (id: string) => {
  return useQuery({
    queryKey: ["expense", id],
    queryFn: () => getExpenseById(id),
    enabled: !!id,
  });
};

interface UpdateExpensePayload {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
}

const updateExpense = async ({ id, ...data }: UpdateExpensePayload) => {
  const response = await axiosInstance.put(
    `/expense/update-expense/${id}`,
    data
  );
  return response.data.data;
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      toast.success("Expense updated");
      queryClient.invalidateQueries();
    },
    onError: (error: any) => {
      toast.error(error.message || "Error updating expense");
    },
  });
};

const getExpenseSummary = async (tripId: string) => {
  const response = await axiosInstance.get(
    `/expense/expense-summary/${tripId}`
  );
  return response.data.data;
};

export const useExpenseSummary = (tripId: string) => {
  return useQuery({
    queryKey: ["expense-summary", tripId],
    queryFn: () => getExpenseSummary(tripId),
    enabled: !!tripId,
  });
};

type Contributions = {
  paidById: string;
  _sum: { amount: number };
}[];

const getUserContribution = async (tripId: string) => {
  const response = await axiosInstance.get(
    `/expense/expense-contribution/${tripId}`
  );
  return response.data.data;
};

export const useUserContribution = (tripId: string) => {
  return useQuery<Contributions>({
    queryKey: ["user-contribution", tripId],
    queryFn: () => getUserContribution(tripId),
    enabled: !!tripId,
  });
};

export const getAllUsers = async (search: string) => {
  const response = await axiosInstance.get("/trip/all-users", {
    params: { search },
  });
  return response.data.data;
};

export const useGetAllUsers = (search: string) => {
  return useQuery({
    queryKey: ["all-users", search],
    queryFn: () => getAllUsers(search),
    enabled: !!search,
  });
};
