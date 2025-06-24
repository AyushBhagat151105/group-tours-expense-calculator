import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { toast } from "sonner";

interface User {
  id?: string;
  fullName: string;
  email: string;
  avatar?: string;
  isVerified?: boolean;
}

interface SignUpResponse {
  statusCode: Number;
  success: boolean;
  message?: string;
  data?: Record<string, any>;
}

interface FormDataTypes {
  email: string;
  password: string;
  fullName: string;
}

interface loginFormDataTypes {
  email: string;
  password: string;
}

interface AuthStore {
  authUser: User | null;
  isSignedIn: boolean;
  isLoggedIn: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signUp: (data: FormDataTypes) => Promise<SignUpResponse | undefined>;
  signIn: (data: loginFormDataTypes) => Promise<User | undefined>;
  logOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  authUser: null,
  isSignedIn: false,
  isLoggedIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/me");
      // console.log("auth api call");
      set({ authUser: res.data.data });
      // console.log("auth user", res.data.data);
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data: FormDataTypes): Promise<SignUpResponse | undefined> => {
    set({ isSignedIn: true });

    try {
      const res = await axiosInstance.post("/auth/register", data);
      // console.log(res.data)
      return res.data as SignUpResponse;
    } catch (error) {
      console.log(error);
      toast.error("Error while signUp");
      return undefined;
    } finally {
      set({ isSignedIn: false });
    }
  },

  signIn: async (data: loginFormDataTypes) => {
    set({ isLoggedIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      // console.log(res)

      if (res.data.data.isVerified) {
        set({ authUser: res.data.data });
        toast.success("Login successful.");
        return res.data.data;
      } else {
        toast.success("Please verify your email first.");
        return res.data.data;
      }
    } catch (error) {
      toast.error(`Error while login ${error}`);
    } finally {
      set({ isLoggedIn: false });
    }
  },

  logOut: async () => {
    set({ isLoggedIn: true });
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem("auth");
    } catch (error) {
      toast.error("Error while logout");
    } finally {
      set({ isLoggedIn: false });
    }
  },
}));
