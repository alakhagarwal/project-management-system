import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Entry() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists and is not expired
    const token = localStorage.getItem("authToken");
    const expiry = localStorage.getItem("tokenExpiry");

    if (token && expiry) {
      const now = new Date().getTime();
      const isTokenValid = now < parseInt(expiry);

      if (isTokenValid) {
        // Token is valid, go to dashboard
        navigate("/dashboard", { replace: true });
        return;
      } else {
        // Clear expired token
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiry");
      }
    }

    // No valid token, go to login
    navigate("/login", { replace: true });
  }, [navigate]);

  return null; // Shows nothing while redirecting
}

export default Entry;
