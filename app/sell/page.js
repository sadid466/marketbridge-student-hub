"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SellPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pendingListing");

    if (!saved) return undefined;

    const restoreId = window.setTimeout(() => {
      const data = JSON.parse(saved);

      setProductName(data.productName || "");
      setDescription(data.description || "");
      setCategory(data.category || "");
      setCondition(data.condition || "");
      setPrice(data.price || "");
      setPhone(data.phone || "");

      localStorage.removeItem("pendingListing");
    }, 0);

    return () => window.clearTimeout(restoreId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    // User must be logged in
    if (!session) {
      const formData = {
        productName,
        description,
        category,
        condition,
        price,
        phone,
      };

      localStorage.setItem("pendingListing", JSON.stringify(formData));

      localStorage.setItem("redirectAfterLogin", "/sell");

      alert("Please login before publishing a listing.");
      console.log(
        "Redirect saved:",
        localStorage.getItem("redirectAfterLogin"),
      );
      router.push("/login");
      return;
    }
    setIsSubmitting(true);

    try {
      // Upload image to Cloudinary before creating the MongoDB document.
      let imageUrl = "";

      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.success || !uploadData.imageUrl) {
          throw new Error(uploadData.error || "Image upload failed.");
        }

        imageUrl = uploadData.imageUrl;
      }

      const product = {
        title: productName,
        description,
        category,
        condition,
        price: Number(price),
        phone,
        imageUrl,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit product.");
      }

      localStorage.removeItem("pendingListing");
      alert("Product submitted successfully!");

      setProductName("");
      setDescription("");
      setCategory("");
      setCondition("");
      setPrice("");
      setPhone("");
      setImage(null);
    } catch (error) {
      console.error("Failed to publish listing:", error);
      alert(error.message || "Failed to submit product.");
    } finally {
      setIsSubmitting(false);
    }
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

        <label
          style={{
            display: "block",
            marginBottom: "12px",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          Upload Product Image
        </label>

        <label
          htmlFor="productImage"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            marginBottom: "15px",
          }}
        >
          📷 Choose Image
        </label>

        <input
          id="productImage"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => setImage(e.target.files[0])}
        />

        <p
          style={{
            marginTop: "8px",
            marginBottom: "25px",
            color: "#6b7280",
            fontSize: "15px",
          }}
        >
          {image ? `Selected: ${image.name}` : "No image selected"}
        </p>

        <button type="submit" style={buttonStyle} disabled={isSubmitting}>
          {isSubmitting ? "Publishing..." : "Publish Listing"}
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
