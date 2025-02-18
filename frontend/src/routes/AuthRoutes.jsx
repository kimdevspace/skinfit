/*AuthRoutes.jsx*/

import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import FindPW from "../pages/auth/FindPW";
import UserForm from "../pages/auth/UserForm";
import { AuthRoute, UserFormRoute } from "./ProtectedRoutes";

function AuthRoutes() {
  return (
    <Routes>
      <Route
        path="login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="signup"
        element={
          <AuthRoute>
            <SignUp />
          </AuthRoute>
        }
      />
      <Route
        path="findpw"
        element={
          <AuthRoute>
            <FindPW />
          </AuthRoute>
        }
      />
      <Route
        path="userform"
        element={
          <UserFormRoute>
            <UserForm />
          </UserFormRoute>
        }
      />
    </Routes>
  );
}

export default AuthRoutes;
