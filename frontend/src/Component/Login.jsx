import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext.jsx";  // ADD THIS
import "../Component/Login.css";

function Login() {
  const [active, setactive] = useState("user");
  const [alertmsg, setalertmsg] = useState("");
  const [formdata, setformdata] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const { login } = useAuth();   // ADD THIS — get login function from context

  const handlechange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handlelogin = async (e) => {
    e.preventDefault();

    if (!formdata.email || !formdata.password) {
      setalertmsg("Please fill all fields");
      setTimeout(() => setalertmsg(""), 2500);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formdata.email,
          password: formdata.password
        })
      });

      if (res.status === 401) {
        setalertmsg("Invalid email or password");
        setTimeout(() => setalertmsg(""), 3000);
        return;
      }

      const data = await res.json();
      // data = { token, role, name }

      // Store token in context AND window (fixes the token problem)
      login(data.token, data.role, data.name);

      console.log("Login Success:", data);

      // Navigate based on role
      if (data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }

    } catch (error) {
      console.log(error);
      setalertmsg("Login failed. Is Spring Boot running?");
      setTimeout(() => setalertmsg(""), 3000);
    }
  };

  return (
    <div className="login">
      {alertmsg && <div className="alert">{alertmsg}</div>}
      <div className="login-box">
        <div className="tabs">
          <button
            className={active === "user" ? "dark" : ""}
            onClick={() => setactive("user")}
          >
            User Login
          </button>
          <button
            className={active === "admin" ? "dark" : ""}
            onClick={() => setactive("admin")}
          >
            Admin Login
          </button>
        </div>

        <h2>{active === "admin" ? "Admin Login" : "User Login"}</h2>

        <form onSubmit={handlelogin}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handlechange}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handlechange}
          />
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;