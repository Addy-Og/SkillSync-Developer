import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    if (!emailId || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e?.preventDefault();
    setError("");
    if (!firstName || !lastName || !emailId || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Sign up failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[82vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary text-2xl font-bold mb-3">
            ⚡
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {isLoginForm ? "Welcome back" : "Join SkillSync"}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isLoginForm
              ? "Sign in to connect with fellow developers"
              : "Create your profile and start matching skills"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-800/60 rounded-xl mb-6 border border-slate-700/50">
          <button
            type="button"
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              isLoginForm
                ? "bg-primary text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            onClick={() => {
              setIsLoginForm(true);
              setError("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              !isLoginForm
                ? "bg-primary text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            onClick={() => {
              setIsLoginForm(false);
              setError("");
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{typeof error === "string" ? error : "An error occurred"}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={isLoginForm ? handleLogin : handleSignUp} className="space-y-4">
          {!isLoginForm && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="alex@example.com"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-semibold px-1 py-0.5"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <span className="loading loading-spinner loading-xs"></span>}
            {isLoginForm ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400 mt-6">
          {isLoginForm ? "New to SkillSync?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLoginForm(!isLoginForm);
              setError("");
            }}
            className="text-primary hover:underline font-semibold ml-1"
          >
            {isLoginForm ? "Sign up now" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
