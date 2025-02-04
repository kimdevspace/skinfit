import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./assets/styles/main.scss"
import Login from "./pages/auth/Login.jsx"
import Search from "./pages/search/Search.jsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

//탠스택 쿼리 사용위해 필요
const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <Login /> */}
      <Search />
    </QueryClientProvider>
  </StrictMode>
)
