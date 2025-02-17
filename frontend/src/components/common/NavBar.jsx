import "./NavBar.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { House, Search, User, LogOut } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "../../api/axiosInstance.js";
import useAuthStore from "../../stores/Auth.js";

// 로그아웃 api 요청 함수
const handleLogout = async () => {
  const response = await axios.delete("auth/logout", {});
  return response.data;
};

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // 로그아웃 시 store 초기화를 위해 useAuthStore import
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const { mutate } = useMutation({
    mutationFn: handleLogout,
    onSuccess: () => {
      clearAuth(); // 로그아웃 시 store 초기화
      navigate("/auth/login");
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return (
    <nav className="navbar">
      <Link to={"/"} className={location.pathname === "/" ? "active" : ""}>
        <House />
        <p>홈</p>
      </Link>

      <Link
        to={"/search"}
        className={location.pathname === "/search" ? "active" : ""}
      >
        <Search />
        <p>검색</p>
      </Link>

      <Link
        to={"/mypage"}
        className={location.pathname === "/mypage" ? "active" : ""}
      >
        <User />
        <p>마이</p>
      </Link>

      <button onClick={() => mutate()}>
        <LogOut />
        <p>로그아웃</p>
      </button>
    </nav>
  );
}

export default NavBar;
