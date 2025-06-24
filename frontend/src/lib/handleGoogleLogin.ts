export const handleGoogleLogin = () => {
  const backendURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  console.log(backendURL);
  window.location.href = `${backendURL}/auth/google`;
};
