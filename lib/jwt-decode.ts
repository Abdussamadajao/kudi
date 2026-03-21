import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  userId?: string;
  role?: string;
  // Add any other custom fields your JWT might have
}
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return (decoded.exp ?? 0) < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};