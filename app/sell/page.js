"use client";

import { useState } from "react";

export default function SellPage() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const product = {
      productName,
      description,
      category,
      condition,
      price,
      phone,
      image,
    };

    console.log(product);
    alert("Product submitted successfully!");
  };

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "50px auto",
        background: "#ffffff",
        padding: "40px",
        borderRadius: "15px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "35px",
          color: "#2563eb",
        }}
      >
        Sell Your Item
      </h1>

      <form onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input
          type="text"
          placeholder="Enter product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          style={inputStyle}
        />

        <label>Description</label>
        <textarea
          placeholder="Write product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={textareaStyle}
        />

        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={inputStyle}
        >
          <option value="">Select Category</option>
          <option>📚 Books</option>
          <option>💻 Electronics</option>
          <option>🪑 Furniture</option>
          <option>🧮 Academic Supplies</option>
          <option>👕 Clothing</option>
          <option>📱 Accessories</option>
          <option>📦 Others</option>
        </select>

        <label>Condition</label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          required
          style={inputStyle}
        >
          <option value="">Select Condition</option>
          <option>New</option>
          <option>Like New</option>
          <option>Good</option>
          <option>Used</option>
        </select>

        <label>Price (BDT)</label>
        <input
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={inputStyle}
        />

        <label>Phone Number</label>
        <input
          type="text"
          placeholder="01XXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={inputStyle}
        />

        <label>Upload Product Image</label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{
            marginTop: "10px",
            marginBottom: "25px",
          }}
        />

        <button type="submit" style={buttonStyle}>
          Publish Listing
        </button>
      </form>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "20px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "16px",
  backgroundColor: "#ffffff",
  color: "#111827",
  outline: "none",
};

const textareaStyle = {
  width: "100%",
  height: "120px",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "20px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "16px",
  backgroundColor: "#ffffff",
  color: "#111827",
  resize: "vertical",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  backgroundColor: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  fontSize: "17px",
  fontWeight: "bold",
  cursor: "pointer",
};