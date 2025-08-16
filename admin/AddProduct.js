// src/admin/AddProduct.js
import React, { useState } from "react";
import axios from "axios";
import "../styles/AddProduct.css";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    sizes: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      sizes: form.sizes.split(",").map((s) => s.trim()),
    };

    try {
      const res = await axios.post("http://localhost:5000/api/auth/products", payload);
      alert("Product added successfully!");
      setForm({ name: "", price: "", category: "", description: "", sizes: "", imageUrl: "" });
    } catch (err) {
      alert("Failed to add product");
      console.error(err);
    }
  };

  return (
    <div className="add-product-container">
      <form className="add-product-form" onSubmit={handleSubmit}>
        <h2>Add New Product</h2>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kids">Kids</option>
        </select>

        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
        ></textarea>

        <input
          type="text"
          name="sizes"
          placeholder="Sizes (comma separated, eg: S,M,L)"
          value={form.sizes}
          onChange={handleChange}
        />

        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
        />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
