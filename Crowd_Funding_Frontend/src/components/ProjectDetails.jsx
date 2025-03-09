import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProjectDetails = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const navigate = useNavigate();
  const [project, setProject] = useState(null); // State to hold the fetched project
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch project details from the backend
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/projects/${id}`
        );
        if (!response.ok) {
          throw new Error("Project not found");
        }
        const data = await response.json();
        console.log("Fetched project details:", data); // Debug log
        setProject(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]); // Re-fetch if id changes

  const handleContribute = () => {
    alert("Contribute functionality coming soon!");
  };

  // Show loading or error states
  if (loading) {
    return (
      <section className="min-h-screen bg-[#8A6B7D]/10 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </section>
    );
  }

  if (error || !project) {
    return (
      <section className="min-h-screen bg-[#8A6B7D]/10 flex items-center justify-center">
        <p className="text-red-600">
          {error || "Project not found. Please try again."}
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#8A6B7D]/10 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-12 sm:py-16">
      <div className="bg-gray-100 w-full max-w-4xl p-6 rounded-lg shadow-lg">
        <img
          src={project.image || "https://via.placeholder.com/150"}
          alt={project.title || "Project Image"}
          className="w-full h-64 object-cover rounded-md mb-6"
        />
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          {project.title || "Untitled"}
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          {project.category || "N/A"}
        </p>
        <p className="text-lg text-gray-700 mb-6">
          {project.description || "No description available."}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Raised</p>
            <p className="text-lg font-semibold">${project.raised || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Goal</p>
            <p className="text-lg font-semibold">${project.goal || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Percentage</p>
            <p className="text-lg font-semibold">
              {project.completionPercentage !== undefined
                ? `${project.completionPercentage.toFixed(2)}%`
                : "0.00%"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Days Left</p>
            <p className="text-lg font-semibold">{project.daysLeft || 0}</p>
          </div>
        </div>
        <button
          onClick={handleContribute}
          className="w-full h-12 px-6 text-base font-semibold bg-[#FF8C5A] text-white rounded-md hover:bg-[#FF7043] transition"
        >
          Contribute
        </button>
      </div>
    </section>
  );
};

export default ProjectDetails;
