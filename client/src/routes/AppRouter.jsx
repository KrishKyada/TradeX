import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import RequireAuth from "../components/RequireAuth";
import Analytics from "../pages/Analytics";
import Portfolio from "../pages/Portfolio";
import Market from "../pages/Market";
import Wallet from "../pages/Wallet";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={ <RequireAuth> <Dashboard /> </RequireAuth>} />
        <Route path="/analytics" element={ <RequireAuth> <Analytics /> </RequireAuth>} />
        <Route path="/portfolio" element={<RequireAuth> <Portfolio /> </RequireAuth>} />
        <Route path="/market" element={<RequireAuth> <Market /> </RequireAuth>} />
        <Route path="/wallet" element={<RequireAuth> <Wallet /> </RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}
