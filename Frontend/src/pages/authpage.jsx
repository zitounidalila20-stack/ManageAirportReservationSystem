import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Add this import
import StatusPopup from "../components/generalcompenents/StatusPopup";


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [authInfo, setAuthInfo] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  // -------- VALIDATION --------
  const validateField = (name, value, updatedData) => {
    let errorMsg = "";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) errorMsg = "Email is required";
      else if (!emailRegex.test(value)) errorMsg = "Invalid email format";
    }

    if (name === "password") {
      if (!value) errorMsg = "Password is required";
      else if (value.length < 8) errorMsg = "Minimum 8 characters";
    }

    if (name === "confirmPassword" && !isLogin) {
      if (!value) errorMsg = "Confirm your password";
      else if (value !== updatedData.password) errorMsg = "Passwords do not match";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // -------- HANDLE CHANGE --------
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updated = { ...authInfo, [name]: value };
    setAuthInfo(updated);
    validateField(name, value, updated);

    if (name === "password" && !isLogin) {
      validateField("confirmPassword", updated.confirmPassword, updated);
    }
  };

  // Helper function to get role from token
  const getRoleFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      return decoded.role || decoded.userRole || "passenger"; // Try different possible field names
    } catch (err) {
      console.error("Error decoding token:", err);
      return "passenger";
    }
  };

  // -------- SUBMIT --------
  const handleAuth = (e) => {
  e.preventDefault();

  if (!authInfo.email || !authInfo.password) {
    setPopup({
      show: true,
      type: "error",
      title: "Missing fields",
      message: "Please fill all required fields",
    });
    return;
  }

  if (!isLogin && authInfo.password !== authInfo.confirmPassword) {
    setPopup({
      show: true,
      type: "error",
      title: "Password error",
      message: "Passwords do not match",
    });
    return;
  }

  const endpoint = isLogin ? "/login" : "/CreateAccount";
  
  const payload = isLogin 
    ? { email: authInfo.email, password: authInfo.password } 
    : authInfo;

  axios
    .post(`http://localhost:5000${endpoint}`, payload)
    .then((res) => {
      const token = res.data.token;
      localStorage.setItem("token", token);

      // Debug function to see token contents
      const debugToken = () => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          const decoded = jwtDecode(storedToken);
          console.log("=== TOKEN DEBUG INFO ===");
          console.log("Full decoded token:", decoded);
          console.log("All keys in token:", Object.keys(decoded));
          console.log("Role value:", decoded.role || decoded.userRole || "No role found");
          console.log("=========================");
        }
      };

      // Get role from token
      const userRole = getRoleFromToken(token);
      
      console.log("Response data:", res.data);
      console.log("Extracted Role from token:", userRole);

      setPopup({
        show: true,
        type: "success",
        title: "Success",
        message: isLogin
          ? "Logged in successfully"
          : "Account created successfully",
      });

      setTimeout(() => {
        debugToken(); // Call debug function to see token contents
        if (userRole === "admin") {
          navigate("/dashboard");
        }if(userRole == "staff"){
          console.log("Navigating to staff...");
          navigate("/StaffHome");
        }
         else {
          console.log("Navigating to home...");
          navigate("/");
        }
      }, 1200);
    })
    .catch((err) => {
      console.error("Auth error:", err.response?.data);
      setPopup({
        show: true,
        type: "error",
        title: "Error",
        message:
          err.response?.data?.message ||
          (isLogin ? "User not found" : "User already exists"),
      });
    });
};

  // -------- GOOGLE --------
  const handleGoogle = (res) => {
    axios
      .post("http://localhost:5000/google", {
        credential: res.credential,
      })
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem("token", token);
        
        const userRole = getRoleFromToken(token);
        
        setPopup({
          show: true,
          type: "success",
          title: "success",
          message: "Successful Google login",
        });

        setTimeout(() => {
          if (userRole === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }, 1200);
      })
      .catch((err) => {
        console.log(err.message);
        setPopup({
          show: true,
          type: "error",
          title: "Error",
          message: "Google login failed, please try again",
        });
      });
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-neutral-950 overflow-hidden">
      
      {/* ================= BACKGROUND GLOW EFFECTS ================= */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ================= MAIN CARD ================= */}
      <div className="relative w-[900px] h-[600px] bg-black/80 backdrop-blur-md border border-neutral-800 rounded-xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] overflow-hidden flex z-10">

        {/* ================= LOGIN ================= */}
        <div
          className={`absolute w-1/2 h-full flex flex-col justify-center px-12 transition-all duration-700 ease-in-out z-30 ${
            isLogin
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <h2 className="text-4xl text-white mb-6">Login</h2>

          <form onSubmit={handleAuth} className="space-y-4">
            <input
              name="email"
              value={authInfo.email}
              onChange={handleChange}
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border-b border-green-700 text-white outline-none p-2 focus:border-green-400 transition-colors"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

            <input
              name="password"
              value={authInfo.password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border-b border-green-700 text-white outline-none p-2 focus:border-green-400 transition-colors"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition"
              disabled={!authInfo.email || !authInfo.password}
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-gray-500 text-xs">
            or Sign In with
          </div>

          <div className="pt-8 flex justify-center">
            <GoogleLogin onSuccess={handleGoogle} />
          </div>
        </div>

        {/* ================= SIGN UP ================= */}
        <div
          className={`absolute w-1/2 h-full flex flex-col justify-center px-12 transition-all duration-700 ease-in-out z-30 ${
            !isLogin
              ? "translate-x-full opacity-100"
              : "translate-x-0 opacity-0 pointer-events-none"
          }`}
        >
          <h2 className="text-4xl text-white mb-6">Sign Up</h2>

          <form onSubmit={handleAuth} className="space-y-4">
            <input
              name="email"
              value={authInfo.email}
              onChange={handleChange}
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border-b border-green-700 text-white outline-none p-2 focus:border-green-400 transition-colors"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

            <input
              name="password"
              value={authInfo.password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border-b border-green-700 text-white outline-none p-2 focus:border-green-400 transition-colors"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

            <input
              name="confirmPassword"
              value={authInfo.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder="Confirm Password"
              className="w-full bg-transparent border-b border-green-700 text-white outline-none p-2 focus:border-green-400 transition-colors"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
            )}

            <button
              className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition"
              disabled={
                !authInfo.email ||
                !authInfo.password ||
                !authInfo.confirmPassword
              }
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center text-gray-500 text-xs">
            or Sign Up with
          </div>
          <div className="pt-8 flex justify-center">
            <GoogleLogin onSuccess={handleGoogle} />
          </div>
        </div>

        {/* ================= OVERLAY ================= */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-700 ease-in-out z-20 ${
            isLogin ? "translate-x-full" : "translate-x-0"
          }`}
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1529074963764-98f45c47344b")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/20" />

          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            className="absolute top-4 left-4 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded shadow-lg hover:scale-105 transition z-50"
          >
            {isLogin ? "Sign Up →" : "← Login"}
          </button>
        </div>

        {/* ================= POPUP ================= */}
        {popup.show && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <StatusPopup
              type={popup.type}
              title={popup.title}
              message={popup.message}
              buttonText="OK"
              onClick={() =>
                setPopup((prev) => ({ ...prev, show: false }))
              }
            />
          </div>
        )}
      </div>
    </div>
  );}
