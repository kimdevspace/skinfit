/*HomeRoute.jsx*/ //메인페이지
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home"
import Intro from '../pages/home/Intro'
import Loading from '../pages/home/Loading'



function HomeRoute() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="intro" element={<Intro />} />
      <Route path="loading" element={<Loading />} />
    </Routes>
  );
}

export default HomeRoute;