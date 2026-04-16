import React, { useEffect} from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../Component/Login.css";
function Login() {
  const [active, setactive] = useState("user");
  const [alertmsg,setalertmsg]=useState("")
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handlechange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };
  const handlelogin = async (e) => {
    e.preventDefault();

    if (!formdata.email || !formdata.password) {
    setalertmsg("please fill the fields")
      setTimeout(()=>setalertmsg(""),2500)
      return;
    }

    // 🔥 LOGIN API CALL

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formdata.email,
          password: formdata.password
        })
      });

      // ❌ wrong credentials
      if (res.status === 401) {
        throw new Error("Invalid login");
      }

      const data = await res.json();

      // 🔥 data = { token, role, name }
      setAuth(data);

      console.log("Login Success:", data);

      // 🔥 ROLE BASED NAVIGATION (backend decides)
      if (data.role === "ADMIN") {
        navigate("/Admin");
      } else {
        navigate("/User");
      }

    } catch (error) {
      console.log(error);
      setalertmsg("login fail");
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

          <h2>{active==="admin" ? "Admin Login" :"User Login"}</h2>

          <form onSubmit={handlelogin}>
                <input type="email" name="email" placeholder="Enter Email" onChange={handlechange}/>
                <input type="password" name="password" placeholder="Enter password" onChange={handlechange} />
                <button className="login-button" type="submit">Login</button>
          </form>
        </div>
      </div>
    
  );
}

export default Login;
