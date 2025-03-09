import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineClose } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ openLoginSignup, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // Fetch all projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/projects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  const handleExploreProjects = () => {
    navigate("/explore-projects");
    setIsOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
    setIsOpen(false);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      navigate("/explore-projects");
    } else {
      const filteredProjects = projects.filter(
        (project) =>
          project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      navigate("/explore-projects", { state: { filteredProjects } });
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsOpen(false);
  };

  return (
    <nav className="bg-white py-3 w-full flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-16 fixed top-0 z-20 shadow-lg">
      <div>
        <h1
          className="text-lg sm:text-xl md:text-2xl lg:text-2.5xl xl:text-4xl font-bold text-[#FFD37A] cursor-pointer"
          onClick={handleLogoClick}
        >
          BackItUp
        </h1>
      </div>
      <div className="hidden md:flex items-center bg-zinc-200 rounded-full h-9 md:h-10 lg:h-11 xl:h-12 w-full max-w-[10rem] md:max-w-xs lg:max-w-md xl:max-w-lg px-3 md:px-4 gap-1 md:gap-2">
        <IoSearch
          className="text-base md:text-lg lg:text-lg xl:text-xl cursor-pointer"
          onClick={handleSearch}
        />
        <input
          type="text"
          placeholder="Search Campaigns"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border-none outline-none w-full bg-zinc-200 text-xs md:text-sm lg:text-sm xl:text-base"
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex items-center gap-2 lg:gap-4">
        <button
          onClick={handleExploreProjects}
          className="h-10 px-3 lg:px-4 text-sm lg:text-base font-semibold border border-gray-400 rounded-md hover:bg-gray-100 transition"
        >
          Explore Projects
        </button>
        {user ? (
          <div className="flex items-center gap-2">
            <button onClick={handleProfileClick} className="focus:outline-none">
              <FaUserCircle className="text-2xl text-gray-600 hover:text-gray-800 transition" />
            </button>
            <span className="text-sm lg:text-base font-medium">
              Hello, {user.name}
            </span>
          </div>
        ) : (
          <>
            <button
              onClick={openLoginSignup}
              className="h-10 px-3 lg:px-4 text-sm lg:text-base font-semibold border border-gray-400 rounded-md hover:bg-gray-100 transition"
            >
              Login
            </button>
            <button
              onClick={openLoginSignup}
              className="h-10 px-3 lg:px-4 text-sm lg:text-base font-semibold bg-[#FFD37A] rounded-md hover:bg-[#ffca5a] transition"
            >
              Register
            </button>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className="text-xl md:hidden text-zinc-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <AiOutlineClose /> : <RxHamburgerMenu />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col gap-3 md:hidden">
          {/* Mobile Search Bar */}
          <div className="flex items-center bg-zinc-200 rounded-full h-10 px-3 gap-2">
            <IoSearch
              className="text-lg cursor-pointer"
              onClick={handleSearch}
            />
            <input
              type="text"
              placeholder="Search Campaigns"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-none outline-none w-full bg-zinc-200 text-sm"
            />
          </div>
          <button
            onClick={handleExploreProjects}
            className="h-10 px-4 text-sm font-semibold border border-gray-400 rounded-md hover:bg-gray-100 transition"
          >
            Explore Projects
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleProfileClick}
                className="focus:outline-none"
              >
                <FaUserCircle className="text-2xl text-gray-600 hover:text-gray-800 transition" />
              </button>
              <span className="text-sm font-medium">Hello, {user.name}</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => {
                  openLoginSignup();
                  setIsOpen(false);
                }}
                className="h-10 px-4 text-sm font-semibold border border-gray-400 rounded-md hover:bg-gray-100 transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  openLoginSignup();
                  setIsOpen(false);
                }}
                className="h-10 px-4 text-sm font-semibold bg-[#FFD37A] rounded-md hover:bg-[#ffca5a] transition"
              >
                Register
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
