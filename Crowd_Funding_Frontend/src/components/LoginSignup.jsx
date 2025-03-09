import React, { useState } from "react";
import axios from "axios";

const LoginSignup = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isLogin
        ? "http://localhost:3000/api/auth/login"
        : "http://localhost:3000/api/auth/register";

      const response = await axios.post(url, formData);

      console.log(`${isLogin ? "Login" : "Signup"} successful:`, response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        // Pass user data back to App
        const userData = {
          name: response.data.user?.name || formData.name || "User",
        };
        onClose(userData); // Pass user data on close
      }

      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Error during ${isLogin ? "login" : "signup"}`
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg relative">
        <button
          onClick={() => onClose(null)} // Pass null if closed without login/signup
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFD37A]"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFD37A]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFD37A]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#FFD37A] p-3 rounded-md font-semibold text-gray-800 hover:bg-[#ffca5a] transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {isLogin ? "Need an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
