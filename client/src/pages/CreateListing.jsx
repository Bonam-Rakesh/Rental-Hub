import { useState } from "react";

const API_URL = "http://localhost:5000";

function CreateListing({ onCreated, onBackHome }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
    category: "Apartment",
    image: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login before creating a listing");
      }

      const response = await fetch(`${API_URL}/api/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create listing"
        );
      }

      setMessage("Listing created successfully! 🎉");

      setForm({
        title: "",
        description: "",
        price: "",
        location: "",
        country: "",
        category: "Apartment",
        image: ""
      });

      setTimeout(() => {
        if (onCreated) {
          onCreated(data.listing);
        }
      }, 700);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <div className="create-container">

        <button
          className="back-home"
          onClick={onBackHome}
        >
          ← Back to home
        </button>

        <div className="create-header">
          <p className="eyebrow">SHARE YOUR SPACE</p>

          <h1>List your property</h1>

          <p>
            Add your property to Rental-Hub and let people
            discover their next stay.
          </p>
        </div>

        <form
          className="create-form"
          onSubmit={handleSubmit}
        >
          <div className="form-section">
            <h2>Property details</h2>

            <div className="form-grid">
              <label className="full-width">
                Property title

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern Apartment in Chandigarh"
                  required
                />
              </label>

              <label className="full-width">
                Description

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your property..."
                  rows="5"
                  required
                />
              </label>

              <label>
                Price per night

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="1500"
                  min="0"
                  required
                />
              </label>

              <label>
                Category

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="Apartment">
                    Apartment
                  </option>

                  <option value="House">
                    House
                  </option>

                  <option value="Villa">
                    Villa
                  </option>

                  <option value="Room">
                    Room
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </label>

              <label>
                Location

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Chandigarh"
                  required
                />
              </label>

              <label>
                Country

                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="India"
                  required
                />
              </label>

              <label className="full-width">
                Image URL

                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/property-image.jpg"
                />

                <small>
                  Add a public image URL for your property.
                </small>
              </label>
            </div>
          </div>

          <div className="create-preview">
            <p className="eyebrow">PREVIEW</p>

            <div className="preview-card">
              {form.image ? (
                <img
                  src={form.image}
                  alt="Property preview"
                />
              ) : (
                <div className="preview-placeholder">
                  Property image
                </div>
              )}

              <div className="preview-info">
                <h3>
                  {form.title || "Your property title"}
                </h3>

                <p>
                  {form.location || "Location"},{" "}
                  {form.country || "Country"}
                </p>

                <strong>
                  ₹
                  {form.price
                    ? Number(form.price).toLocaleString()
                    : "0"}
                  <span>/night</span>
                </strong>
              </div>
            </div>
          </div>

          {message && (
            <div className="auth-message">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="create-submit"
            disabled={loading}
          >
            {loading
              ? "Creating listing..."
              : "Publish property"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateListing;