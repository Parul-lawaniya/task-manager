import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import TaskDetails from "../pages/task/TaskDetails";
import ProtectedRoutes from "./ProtectedRoutes";
function AuthRoutes() {
  return (
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        {/* This is ProtectedRoutes */}
       <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/task/:id"
          element={
            <ProtectedRoutes>
              <TaskDetails />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}


export default AuthRoutes