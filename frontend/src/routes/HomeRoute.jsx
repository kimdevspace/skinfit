/*HomeRoute.jsx*/ //메인페이지
import { Routes, Route } from "react-router-dom";


function HomeRoute() {
  return (
    <Routes>
      <Route index element={<Home />} />
      {/* <Route path="intro" element={<Intro />} />
      <Route path="loading" element={<Loading />} /> */}
    </Routes>
  );
}

export default HomeRoute;