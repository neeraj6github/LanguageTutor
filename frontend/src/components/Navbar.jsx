import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Fade in nav buttons when path changes
  useEffect(() => {
    setShowButtons(false);
    const timer = setTimeout(() => setShowButtons(true), 50); // small delay for smooth fade
    return () => clearTimeout(timer);
  }, [location]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <nav className="w-full bg-gradient-to-br from-[#973aa8] via-[#6411ad] to-[#3a0ca3] text-white px-6 py-4 flex justify-between items-center shadow-lg backdrop-blur-lg border-b border-white/10">
      <h1
        className="text-3xl font-extrabold tracking-wide font-mono cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-400 hover:from-orange-400 hover:to-yellow-300 transition duration-300"
        onClick={() => handleNavigate("/")}
      >
        TextTune
      </h1>

      <div
        className={`flex gap-3 mt-1 transition-opacity duration-500 ${
          showButtons ? "opacity-100" : "opacity-0"
        }`}
      >
        {location.pathname === "/" && (
          <>
            <NavButton onClick={() => handleNavigate("/login")} label="Login" />
            <NavButton onClick={() => handleNavigate("/signup")} label="Signup" />
          </>
        )}

        {location.pathname === "/login" && (
          <>
            <NavButton onClick={() => handleNavigate("/")} label="Home" />
            <NavButton onClick={() => handleNavigate("/signup")} label="Signup" />
          </>
        )}

        {location.pathname === "/signup" && (
          <>
            <NavButton onClick={() => handleNavigate("/")} label="Home" />
            <NavButton onClick={() => handleNavigate("/login")} label="Login" />
          </>
        )}

        {location.pathname.startsWith("/chat") && isLoggedIn && (
          <>
            <NavButton onClick={() => handleNavigate("/")} label="Home" />
            <NavButton onClick={handleLogout} label="Logout" />
          </>
        )}
      </div>
    </nav>
  );
};

const NavButton = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-lg bg-[#d1d5db] text-black font-semibold
               hover:bg-[#b3b9c6] transition duration-300 shadow-md hover:shadow-lg"
  >
    {label}
  </button>
);

export default Navbar;
