import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      alert(res.data.message);

      // Save token for authentication
      localStorage.setItem("token", res.data.token);

      // Redirect to dashboard
      window.location.href = "/dashboard";

    } catch (err) {
      alert(err.response.data.message || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Login</h2>
      <form onSubmit={submitHandler}>
        <input name="email" placeholder="Email" onChange={handleChange} /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />
        <button>Login</button>
      </form>
    </div>
  );
}
