/*AuthRoutes.jsx*/

import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import FindPW from "../pages/auth/FindPW";
import UserForm from "../pages/auth/UserForm";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="findpw" element={<FindPW />} />
      <Route path="userform" element={<UserForm />} />
    </Routes>
  );
}

export default AuthRoutes;