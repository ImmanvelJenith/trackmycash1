import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import PrivateRoute from "./Auth/PrivateRoute";
import { ExpenseProvider } from "./Context/ExpenseContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ExpenseProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/trackmycash1" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/users" element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </ExpenseProvider>
  );
}

export default App;
