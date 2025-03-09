import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";

const Profile = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [createdProjects, setCreatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's created projects
  useEffect(() => {
    const fetchCreatedProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch("http://localhost:3000/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        const userProjects = data.filter(
          (project) => project.creator?._id === user?._id
        );
        console.log("User's created projects:", userProjects);
        setCreatedProjects(userProjects);
      } catch (error) {
        console.error("Error fetching created projects:", error);
        setCreatedProjects([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchCreatedProjects();
    else setLoading(false);
  }, [user]);

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const handleCardClick = (id) => {
    navigate(`/projects/${id}`);
  };

  if (!user) {
    return (
      <section className="min-h-screen bg-[#8A6B7D]/10 flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#8A6B7D]/10 px-4 sm:px-6 md:px-8 lg:px-10 py-12 sm:py-16">
      <div className="bg-gray-100 w-full max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Welcome, {user.name}
        </h2>

        {/* Created Projects */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Your Created Projects
          </h3>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : createdProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {createdProjects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => handleCardClick(project._id)}
                  className="cursor-pointer"
                >
                  <Card
                    category={project.category || "N/A"}
                    title={project.title || "Untitled"}
                    raised={`$${project.raised || 0}`}
                    percentage={`${
                      project.completionPercentage !== undefined
                        ? project.completionPercentage.toFixed(2)
                        : "0.00"
                    }%`}
                    goal={`$${project.goal || 0}`}
                    daysLeft={project.daysLeft || 0}
                    image={project.image || "https://via.placeholder.com/150"}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              You haven’t created any projects yet.
            </p>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full h-12 px-6 text-base font-semibold bg-[#FF8C5A] text-white rounded-md hover:bg-[#FF7043] transition"
        >
          Logout
        </button>
      </div>
    </section>
  );
};

export default Profile;
