import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import LoginSignup from "./components/LoginSignup";
import ExploreProjects from "./components/ExploreProjects";
import ProjectDetails from "./components/ProjectDetails";
import Profile from "./components/Profile";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const [isLoginSignupOpen, setIsLoginSignupOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          _id: payload.id,
          name: payload.name || payload.email || "User",
        });
      } catch (error) {
        console.error("Token decoding failed:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const openLoginSignup = () => setIsLoginSignupOpen(true);
  const closeLoginSignup = (userData) => {
    setIsLoginSignupOpen(false);
    if (userData) setUser(userData);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar
          openLoginSignup={openLoginSignup}
          user={user}
          onLogout={handleLogout}
        />
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Projects />
              </>
            }
          />
          <Route path="/explore-projects" element={<ExploreProjects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route
            path="/profile"
            element={<Profile user={user} onLogout={handleLogout} />}
          />
        </Routes>
        <Footer />
        <LoginSignup isOpen={isLoginSignupOpen} onClose={closeLoginSignup} />
      </div>
    </Router>
  );
};

export default App;
