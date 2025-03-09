import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "./Card";

const ExploreProjects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Check if filtered projects were passed via state (from search)
        if (location.state?.filteredProjects) {
          console.log(
            "Using filtered projects from search:",
            location.state.filteredProjects
          );
          setProjects(location.state.filteredProjects);
        } else {
          // Fetch all projects (no token required)
          const response = await fetch("http://localhost:3000/api/projects");
          if (!response.ok) throw new Error("Failed to fetch projects");
          const data = await response.json();
          console.log("Projects from server:", data);
          setProjects(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Problem fetching projects:", error);
        setProjects([]);
      }
    };
    fetchProjects();
  }, [location.state]);

  const handleCardClick = (id) => {
    navigate(`/projects/${id}`);
  };

  const handleOpenCreateModal = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in to create a project!");
      navigate("/"); // Or wherever your login page is
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateProject = async (projectData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in first!");
        handleCloseCreateModal();
        return;
      }

      const response = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: projectData.title,
          category: projectData.category,
          goal: Number(projectData.goal),
          duration: Number(projectData.duration),
          description: projectData.description,
          image: projectData.image,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Couldn’t create project");
      }

      const newProject = await response.json();
      console.log("New project added:", newProject);
      setProjects((oldProjects) => [...oldProjects, newProject.project]);
      handleCloseCreateModal();
    } catch (error) {
      console.error("Error adding project:", error.message);
      alert("Something went wrong: " + error.message);
    }
  };

  return (
    <section className="min-h-screen bg-[#8A6B7D]/10 px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12">
      <div className="bg-gray-100 w-full flex flex-col justify-start items-start px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12 gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
          {projects.length > 0 ? (
            projects.map((project) => {
              if (!project || !project._id) return null;
              return (
                <div
                  key={project._id}
                  onClick={() => handleCardClick(project._id)}
                  className="cursor-pointer"
                >
                  <Card
                    category={project.category || "Unknown"}
                    title={project.title || "No Title"}
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
              );
            })
          ) : (
            <p>No projects available yet.</p>
          )}
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="h-12 px-6 text-base font-semibold bg-[#FFD37A] rounded-md hover:bg-[#ffca5a] transition"
        >
          List Your Own Project
        </button>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={handleCloseCreateModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Create New Project
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const projectData = {
                  title: formData.get("title"),
                  category: formData.get("category"),
                  goal: formData.get("goal"),
                  duration: formData.get("duration"),
                  description: formData.get("description"),
                  image: formData.get("image"),
                };
                handleCreateProject(projectData);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  required
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a category</option>
                  <option value="DESIGN">Design</option>
                  <option value="TECHNOLOGY">Technology</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Funding Goal ($)
                </label>
                <input
                  type="number"
                  name="goal"
                  required
                  min="1"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Duration (days)
                </label>
                <input
                  type="number"
                  name="duration"
                  required
                  min="1"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  required
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 px-6 text-base font-semibold bg-[#FF8C5A] text-white rounded-md hover:bg-[#FF7043] transition"
              >
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ExploreProjects;
