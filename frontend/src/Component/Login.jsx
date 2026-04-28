import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext.jsx";
import "../Component/Login.css";

function Login() {
  const [active, setactive] = useState("user");
  const [alertmsg, setalertmsg] = useState("");
  const [formdata, setformdata] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handlechange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handlelogin = async (e) => {
    e.preventDefault();

    if (!formdata.email || !formdata.password) {
      setalertmsg("Please fill the fields");
      setTimeout(() => setalertmsg(""), 2500);
      return;
    }

    // ✅ FRONTEND-ONLY DEMO CREDENTIALS
    if (formdata.email === "user@gmail.com" && formdata.password === "user123") {
      login("demo-user-token", "USER", "Demo User");
      navigate("/user");
      return;
    }

    if (formdata.email === "admin@gmail.com" && formdata.password === "admin") {
      login("demo-admin-token", "ADMIN", "Demo Admin");
      navigate("/admin");
      return;
    }

    // 🔥 API INTEGRATION (if not demo credentials)
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
        throw new Error("Invalid login");
      }

      const data = await res.json();
      login(data.token, data.role, data.name);

      if (data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }

    } catch (error) {
      console.log(error);
      setalertmsg("Invalid login");
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
          <input type="email" name="email" placeholder="Enter Email" onChange={handlechange} />
          <input type="password" name="password" placeholder="Enter password" onChange={handlechange} />
          <button className="login-button" type="submit">Login</button>
        </form>
      </div>
    </div>

  );
}

export default Login;
