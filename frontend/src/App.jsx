import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Entry from "./Pages/EntryPage/Entry";
import Login from "./Pages/EntryPage/login";
import Register from "./Pages/EntryPage/register";
import Dashboard from "./Pages/DashBoard/dashBoard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
