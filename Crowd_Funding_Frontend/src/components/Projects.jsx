import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]); // State to hold fetched projects

  // Slider settings
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Fetch projects from the database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        console.log("Projects fetched for slider:", data); // Debug log
        setProjects(Array.isArray(data) ? data : []); // Ensure it’s an array
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]); // Fallback to empty array on error
      }
    };
    fetchProjects();
  }, []); // Empty dependency array = fetch once on mount

  const sliderRef = React.useRef(null);

  const handlePrev = () => sliderRef.current.slickPrev();
  const handleNext = () => sliderRef.current.slickNext();

  const handleCardClick = (id) => {
    navigate(`/projects/${id}`);
  };

  return (
    <section className="min-h-[90vh] flex flex-col items-center pt-12 sm:pt-16 bg-[#8A6B7D]/10">
      <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-10">
        Explore Projects / Campaigns
      </h2>
      <div className="bg-gray-100 w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12 gap-6">
        {projects.length > 0 ? (
          <Slider
            ref={sliderRef}
            {...settings}
            className="w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl"
          >
            {projects.map((project) => (
              <div
                key={project._id} // Use MongoDB _id
                onClick={() => handleCardClick(project._id)}
                className="cursor-pointer px-2"
              >
                <Card
                  category={project.category || "N/A"}
                  title={project.title || "Untitled"}
                  raised={`$${project.raised || 0}`} // Match DB field 'raised'
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
          </Slider>
        ) : (
          <p className="text-gray-600">No projects available yet.</p>
        )}

        {/* Custom Arrows Below Slider */}
        {projects.length > 0 && (
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-gray-900 transition"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-gray-900 transition"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
