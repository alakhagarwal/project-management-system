import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { PublicRoute } from "./components/PublicRoute.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Register from "./Pages/EntryPage/register.jsx";
import Login from "./Pages/EntryPage/login.jsx";
import DashBoard from "./Pages/DashBoard/dashBoard.jsx";
import NotFound from "./Pages/NotFound.jsx";
import "./App.css";

function AppRoutes() {
  const location = useLocation();

  // Hide navbar on login and register pages
  const hideNavbarPaths = ["/login", "/register"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        {/* Public Routes - redirect to dashboard if already authenticated */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />

        {/* Default Route - Dashboard as fallback */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
