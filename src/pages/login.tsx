import "../App.css";
import Logo from "../../public/Logo.png";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import netflix_spinner from "../../public/netflix_spinner.gif";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [signInState, setSignInState] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState(""); // 🔥 Firebase error

  const { login, signup } = useAuth();

  const validate = () => {
    let isValid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");

    if (signInState === "Sign Up" && name.trim() === "") {
      setNameError("Please enter your name.");
      isValid = false;
    }

    if (email.trim() === "") {
      setEmailError("Please enter a valid email.");
      isValid = false;
    }

    if (password.trim().length < 4 || password.trim().length > 60) {
      setPasswordError(
        "Your password must contain between 4 and 60 characters."
      );
      isValid = false;
    }

    return isValid;
  };

  const handleInputFocus = (field: string) => {
    if (field === "name") setNameError("");
    if (field === "email") setEmailError("");
    if (field === "password") setPasswordError("");
    setAuthError(""); // clear firebase errors when typing
  };

  const handleSwitchForm = () => {
    setSignInState((prev) => (prev === "Sign In" ? "Sign Up" : "Sign In"));
    setName("");
    setEmail("");
    setPassword("");
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setAuthError("");
  };

  const user_auth = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setAuthError(""); // clear previous firebase errors

  if (!validate()) return;

  setLoading(true);

  try {
    if (signInState === "Sign In") {
      await login(email, password);
    } else {
      await signup(name, email, password);
    }

    // ✅ only runs if success
    navigate("/home");

  } catch (error: any) {
    console.log("Firebase Error:", error);

    const code = error?.code || "";

    if (code.includes("invalid-credential")) {
      // 🔥 Firebase now combines wrong password + user not found
      setAuthError("Incorrect email or password");
    } else if (code.includes("invalid-email")) {
      setAuthError("Invalid email format");
    } else if (code.includes("too-many-requests")) {
      setAuthError("Too many attempts. Try again later.");
    } else {
      setAuthError("Something went wrong. Try again.");
    }

  } finally {
    setLoading(false);
  }
};

  return loading ? (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <img src={netflix_spinner} alt="loading" />
    </div>
  ) : (
    <>
      <div
        className="min-h-[110vh] w-full bg-cover bg-center bg-no-repeat px-8 py-6"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/background_banner.jpg')",
        }}
      >
        <img className="h-24 ml-10" src={Logo} alt="Netflix Logo" />

        <div
          className="max-w-md mx-auto mt-10 p-8 rounded text-white"
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
        >
          <p className="text-[32px] font-bold mb-6">{signInState}</p>

          <form onSubmit={user_auth} className="space-y-4">

            {signInState === "Sign Up" && (
              <div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => handleInputFocus("name")}
                  type="text"
                  placeholder="Your Name"
                  className={`w-full h-12 rounded px-5 bg-neutral-800 ${
                    nameError ? "border border-red-600" : ""
                  }`}
                />
                {nameError && (
                  <p className="text-sm text-red-500 mt-1">{nameError}</p>
                )}
              </div>
            )}

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => handleInputFocus("email")}
                placeholder="Email"
                className={`w-full h-12 rounded px-5 bg-neutral-800 ${
                  emailError ? "border border-red-600" : ""
                }`}
              />
              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => handleInputFocus("password")}
                placeholder="Password"
                className={`w-full h-12 rounded px-5 pr-12 bg-neutral-800 ${
                  passwordError ? "border border-red-600" : ""
                }`}
              />

              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>

              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>

            {/* 🔥 Firebase Error */}
            {authError && (
              <p className="text-red-500 text-sm bg-red-900/20 p-3 rounded">
                {authError}
              </p>
            )}

            <button className="w-full py-4 bg-red-600 hover:bg-red-700">
              {signInState}
            </button>

            <div className="text-gray-400 mt-6 text-sm">
              {signInState === "Sign In" ? (
                <p>
                  New to Netflix?{" "}
                  <span
                    className="text-white cursor-pointer"
                    onClick={handleSwitchForm}
                  >
                    Sign Up Now
                  </span>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <span
                    className="text-white cursor-pointer"
                    onClick={handleSwitchForm}
                  >
                    Sign In
                  </span>
                </p>
              )}
            </div>

          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}