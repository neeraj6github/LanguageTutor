import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { gsap } from "gsap";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const buttonGroupRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (buttonGroupRef.current) {
      gsap.from(buttonGroupRef.current.children, {
        opacity: 0,
        y: -20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [location]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <nav className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <h1
        className="text-3xl font-extrabold tracking-wide font-mono cursor-pointer hover:text-yellow-300 transition duration-200"
        onClick={() => handleNavigate("/")}
      >
        AI-ChitChat
      </h1>

      <div className="flex gap-3 mt-1" ref={buttonGroupRef}>
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

// Button with dark blue theme
const NavButton = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-lg border border-white bg-white text-blue-900 font-semibold hover:bg-blue-100 hover:text-blue-900 transition duration-200 shadow-md hover:shadow-lg"
  >
    {label}
  </button>
);

export default Navbar;
