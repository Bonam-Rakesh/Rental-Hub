import { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateListing from "./pages/CreateListing";
import ListingDetails from "./pages/ListingDetails";

const API_URL = "http://localhost:5000";

function App() {
  const [page, setPage] = useState("home");

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  const [selectedListingId, setSelectedListingId] =
    useState(null);

  const [searchLocation, setSearchLocation] =
    useState("");

  const [searchCategory, setSearchCategory] =
    useState("");

  const [searchMinPrice, setSearchMinPrice] =
    useState("");

  const [searchMaxPrice, setSearchMaxPrice] =
    useState("");

  const [searchActive, setSearchActive] =
    useState(false);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("user");

    const token =
      localStorage.getItem("token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchListings = async (filters = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filters.location) {
        params.append(
          "location",
          filters.location
        );
      }

      if (filters.category) {
        params.append(
          "category",
          filters.category
        );
      }

      if (filters.minPrice) {
        params.append(
          "minPrice",
          filters.minPrice
        );
      }

      if (filters.maxPrice) {
        params.append(
          "maxPrice",
          filters.maxPrice
        );
      }

      const queryString =
        params.toString();

      const url = queryString
        ? `${API_URL}/api/listings?${queryString}`
        : `${API_URL}/api/listings`;

      const response = await fetch(url);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch listings"
        );
      }

      setListings(data);
    } catch (error) {
      console.error(
        "Failed to fetch listings:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearch = async () => {
    setSearchActive(true);

    await fetchListings({
      location: searchLocation.trim(),
      category: searchCategory,
      minPrice: searchMinPrice,
      maxPrice: searchMaxPrice
    });

    document
      .getElementById("listings")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  };

  const handleClearSearch = async () => {
    setSearchLocation("");
    setSearchCategory("");
    setSearchMinPrice("");
    setSearchMaxPrice("");
    setSearchActive(false);

    await fetchListings();

    document
      .getElementById("listings")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setPage("home");
  };

  if (page === "login") {
    return (
      <Login
        onLoginSuccess={() => {
          const savedUser =
            localStorage.getItem("user");

          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }

          setPage("home");
        }}
        onRegisterClick={() =>
          setPage("register")
        }
        onBackHome={() =>
          setPage("home")
        }
      />
    );
  }

  if (page === "register") {
    return (
      <Register
        onRegisterSuccess={() =>
          setPage("home")
        }
        onLoginClick={() =>
          setPage("login")
        }
      />
    );
  }

  if (page === "create") {
    return (
      <CreateListing
        onCreated={(newListing) => {
          setListings(
            (currentListings) => [
              newListing,
              ...currentListings
            ]
          );

          setPage("home");
        }}
        onBackHome={() =>
          setPage("home")
        }
      />
    );
  }

  if (page === "details") {
    return (
      <ListingDetails
        listingId={selectedListingId}
        user={user}
        onBackHome={() => {
          setSelectedListingId(null);
          setPage("home");
        }}
      />
    );
  }

  return (
    <div className="app">

      <nav className="navbar">

        <button
          className="logo"
          onClick={() =>
            setPage("home")
          }
        >
          <span className="logo-mark">
            R
          </span>

          <span>
            Rental-Hub
          </span>
        </button>

        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#listings">
            Explore
          </a>

          <a href="#about">
            About
          </a>

          {user ? (
            <>
              <span className="welcome-user">
                Hi, {user.username}
              </span>

              <button
                className="list-property-btn"
                onClick={() =>
                  setPage("create")
                }
              >
                + List your property
              </button>

              <button
                className="login-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="login-btn"
              onClick={() =>
                setPage("login")
              }
            >
              Login
            </button>
          )}

        </div>
      </nav>

      <main>

        <section
          className="hero"
          id="home"
        >

          <div className="hero-content">

            <p className="eyebrow">
              FIND YOUR NEXT STAY
            </p>

            <h1>
              Find a place
              <br />
              <span>
                you'll love.
              </span>
            </h1>

            <p className="hero-description">
              Discover comfortable places
              to stay, explore new locations,
              and find a rental that feels
              like home.
            </p>

            <div className="search-box">

              <div className="search-field">

                <span>
                  ⌕
                </span>

                <div>

                  <small>
                    Location
                  </small>

                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(event) =>
                      setSearchLocation(
                        event.target.value
                      )
                    }
                    placeholder="Where do you want to stay?"
                  />

                </div>

              </div>

              <div className="search-field">

                <span>
                  ⌂
                </span>

                <div>

                  <small>
                    Property type
                  </small>

                  <select
                    value={searchCategory}
                    onChange={(event) =>
                      setSearchCategory(
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Any type
                    </option>

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

                </div>

              </div>

              <div className="search-field price-search-field">

                <span>
                  ₹
                </span>

                <div>

                  <small>
                    Price range
                  </small>

                  <div className="price-inputs">

                    <input
                      type="number"
                      min="0"
                      value={searchMinPrice}
                      onChange={(event) =>
                        setSearchMinPrice(
                          event.target.value
                        )
                      }
                      placeholder="Min"
                    />

                    <span>
                      -
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={searchMaxPrice}
                      onChange={(event) =>
                        setSearchMaxPrice(
                          event.target.value
                        )
                      }
                      placeholder="Max"
                    />

                  </div>

                </div>

              </div>

              <button
                className="search-btn"
                onClick={handleSearch}
              >
                Search
              </button>

            </div>

            {searchActive && (
              <button
                className="clear-search-btn"
                onClick={handleClearSearch}
              >
                Clear search ×
              </button>
            )}

          </div>

          <div className="hero-decoration">

            <div className="glow glow-one"></div>

            <div className="glow glow-two"></div>

            <div className="hero-card">

              <div className="hero-card-image"></div>

              <div className="hero-card-info">

                <div>

                  <strong>
                    Beautiful stays
                  </strong>

                  <span>
                    Ready for your next journey
                  </span>

                </div>

                <div className="rating">
                  ★ 4.9
                </div>

              </div>

            </div>

          </div>

        </section>

        <section
          className="listings-section"
          id="listings"
        >

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                {searchActive
                  ? "SEARCH RESULTS"
                  : "EXPLORE"}
              </p>

              <h2>
                {searchActive
                  ? "Matching stays"
                  : "Featured stays"}
              </h2>

            </div>

            <div className="results-actions">

              {searchActive && (
                <button
                  className="view-all-btn"
                  onClick={
                    handleClearSearch
                  }
                >
                  View all →
                </button>
              )}

              <span className="results-count">
                {listings.length}{" "}
                {listings.length === 1
                  ? "property"
                  : "properties"}
              </span>

            </div>

          </div>

          {loading ? (
            <div className="loading">
              Finding the perfect stays...
            </div>
          ) : listings.length === 0 ? (
            <div className="empty-state">

              <div className="empty-icon">
                ⌂
              </div>

              <h3>
                No properties found
              </h3>

              <p>
                Try changing your search
                location, property type,
                or price range.
              </p>

              {searchActive && (
                <button
                  className="view-all-btn"
                  onClick={
                    handleClearSearch
                  }
                >
                  Clear search
                </button>
              )}

            </div>
          ) : (
            <div className="listing-grid">

              {listings.map(
                (listing) => (

                  <article
                    className="listing-card"
                    key={listing._id}
                    onClick={() => {
                      setSelectedListingId(
                        listing._id
                      );

                      setPage("details");
                    }}
                  >

                    <div className="listing-image-wrapper">

                      {listing.image ? (
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="listing-image"
                        />
                      ) : (
                        <div className="listing-placeholder">
                          ⌂
                        </div>
                      )}

                      <button
                        className="favorite-btn"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >
                        ♡
                      </button>

                    </div>

                    <div className="listing-info">

                      <div className="listing-top">

                        <h3>
                          {listing.title}
                        </h3>

                        <span className="category">
                          {listing.category}
                        </span>

                      </div>

                      <p className="location">
                        {listing.location},{" "}
                        {listing.country}
                      </p>

                      <div className="listing-bottom">

                        <strong>
                          ₹
                          {Number(
                            listing.price
                          ).toLocaleString()}

                          <span>
                            /night
                          </span>
                        </strong>

                        <span className="card-rating">
                          ★ 5.0
                        </span>

                      </div>

                    </div>

                  </article>
                )
              )}

            </div>
          )}

        </section>

        <section
          className="about-section"
          id="about"
        >

          <p className="eyebrow">
            ABOUT RENTAL-HUB
          </p>

          <h2>
            Simple stays. Better experiences.
          </h2>

          <p>
            Rental-Hub makes it easy to
            discover rental properties,
            compare stays, and find a place
            that fits your journey.
          </p>

        </section>

      </main>

      <footer>

        <div className="logo">

          <span className="logo-mark">
            R
          </span>

          <span>
            Rental-Hub
          </span>

        </div>

        <p>
          Rental-Hub.
        </p>

      </footer>

    </div>
  );
}

export default App;