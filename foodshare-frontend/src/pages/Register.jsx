import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor",
    address: "",
    phone: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", formData);
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {["name", "email", "password", "address", "phone"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        ))}

        <select name="role" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="donor">Donor</option>
          <option value="ngo">NGO</option>
        </select>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Register
        </button>
      </form>
    </div>
  );
}
