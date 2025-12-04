import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      alert(res.data.message);
    } catch (err) {
      alert(err.response.data.message || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Register</h2>
      <form onSubmit={submitHandler}>
        <input name="name" placeholder="Name" onChange={handleChange} /><br />
        <input name="email" placeholder="Email" onChange={handleChange} /><br />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} /><br />
        <button>Register</button>
      </form>
    </div>
  );
}
