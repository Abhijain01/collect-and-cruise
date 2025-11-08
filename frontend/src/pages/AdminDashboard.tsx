import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  imageUrl?: string;
}

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stockQuantity: 0,
  });
  const [image, setImage] = useState<File | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);

  const token = JSON.parse(localStorage.getItem("userInfo") || "{}").token;

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products. Are you admin?");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle product add/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, String(value)));
      if (image) formData.append("image", image);

      if (editing) {
        await axios.put(
          `http://localhost:5000/api/admin/products/${editing._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditing(null);
      } else {
        await axios.post("http://localhost:5000/api/admin/products", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({ name: "", description: "", price: 0, category: "", stockQuantity: 0 });
      setImage(null);
      fetchProducts();
    } catch (err) {
      console.error("Failed to upload product:", err);
      setError("Error uploading product");
    }
  };

  // Delete product
  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete product");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>🛠️ Admin Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#f4f4f4",
          padding: "20px",
          width: "350px",
          margin: "20px auto",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Stock Quantity"
          value={form.stockQuantity}
          onChange={(e) =>
            setForm({ ...form, stockQuantity: Number(e.target.value) })
          }
          required
        />
        <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <button
          type="submit"
          style={{
            background: "#007bff",
            color: "#fff",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {editing ? "Update Product" : "Add Product"}
        </button>
      </form>

      <h2>Product List</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map((p) => (
          <li
            key={p._id}
            style={{
              margin: "10px auto",
              padding: "10px",
              width: "60%",
              background: "#e3e3e3",
              borderRadius: "8px",
            }}
          >
            <strong>{p.name}</strong> — ${p.price}
            <div style={{ marginTop: "5px" }}>
              <button
                onClick={() => setEditing(p)}
                style={{ marginRight: "10px", background: "#28a745", color: "#fff" }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                style={{ background: "#dc3545", color: "#fff" }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
