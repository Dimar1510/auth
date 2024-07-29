import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import About from "./pages/about/About";
import Profile from "./pages/profile/Profile";
import NotFound from "./pages/404/NotFound";
import Header from "./components/Header/Header";
import { NextUIProvider } from "@nextui-org/react";

const App = () => {
  const navigate = useNavigate();
  return (
    <NextUIProvider navigate={navigate}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </NextUIProvider>
  );
};

export default App;
