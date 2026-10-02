import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function ListingDetails({ listingId, onBackHome, user }) {
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);

        const [listingResponse, reviewsResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/listings/${listingId}`),
            fetch(`${API_URL}/api/reviews/${listingId}`)
          ]);

        const listingData = await listingResponse.json();
        const reviewsData = await reviewsResponse.json();

        if (!listingResponse.ok) {
          throw new Error(
            listingData.message ||
              "Failed to load property"
          );
        }

        setListing(listingData);
        setReviews(
          Array.isArray(reviewsData)
            ? reviewsData
            : []
        );
      } catch (error) {
        console.error(error);
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [listingId]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(
        "Please login before writing a review."
      );
      return;
    }

    if (!comment.trim()) {
      setMessage(
        "Please write a review before submitting."
      );
      return;
    }

    try {
      setReviewLoading(true);

      const response = await fetch(
        `${API_URL}/api/reviews/${listingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            comment: comment.trim(),
            rating
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit review"
        );
      }

      setReviews((currentReviews) => [
        data.review,
        ...currentReviews
      ]);

      setComment("");
      setRating(5);

      setMessage(
        "Review submitted successfully! ⭐"
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-loading">
          Loading property...
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="details-page">
        <div className="details-error">

          <h2>
            Property not found
          </h2>

          <p>
            This property may have been
            removed or does not exist.
          </p>

          <button
            className="back-home"
            onClick={onBackHome}
          >
            ← Back to home
          </button>

        </div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) =>
              total + Number(review.rating),
            0
          ) / reviews.length
        ).toFixed(1)
      : "New";

  return (
    <div className="details-page">

      {}

      <div className="details-container">

        <button
          className="back-home"
          onClick={onBackHome}
        >
          ← Back to home
        </button>

        {}

        <div className="details-image-wrapper">

          {listing.image ? (
            <img
              src={listing.image}
              alt={listing.title}
              className="details-image"
            />
          ) : (
            <div className="details-image-placeholder">
              <span>⌂</span>
              <p>
                No property image
              </p>
            </div>
          )}

          <span className="details-category">
            {listing.category}
          </span>

        </div>

        {}

        <section className="details-content">

          <div className="details-main">

            <p className="eyebrow">
              {listing.category?.toUpperCase()}
            </p>

            <h1>
              {listing.title}
            </h1>

            <p className="details-location">
              📍 {listing.location},{" "}
              {listing.country}
            </p>

            <div className="details-rating">

              <span>
                ★
              </span>

              <strong>
                {averageRating}
              </strong>

              <small>
                {reviews.length}{" "}
                {reviews.length === 1
                  ? "review"
                  : "reviews"}
              </small>

            </div>

            <div className="details-divider"></div>

            {}

            <div className="description-section">

              <h2>
                About this place
              </h2>

              <p>
                {listing.description}
              </p>

            </div>

            {}

            <div className="host-section">

              <div className="host-avatar">
                {listing.owner?.username
                  ?.charAt(0)
                  ?.toUpperCase() || "H"}
              </div>

              <div>
                <small>
                  Hosted by
                </small>

                <strong>
                  {listing.owner?.username ||
                    "Rental-Hub host"}
                </strong>
              </div>

            </div>

          </div>

          {}

          <aside className="price-card">

            <p>
              Price per night
            </p>

            <div className="price-value">
              ₹
              {Number(
                listing.price
              ).toLocaleString()}

              <span>
                /night
              </span>
            </div>

            <div className="price-card-line"></div>

            <div className="price-meta">
              <span>
                Category
              </span>

              <strong>
                {listing.category}
              </strong>
            </div>

            <div className="price-meta">
              <span>
                Location
              </span>

              <strong>
                {listing.location}
              </strong>
            </div>

          </aside>

        </section>

        {}

        <section className="reviews-section">

          <div className="reviews-heading">

            <div>
              <p className="eyebrow">
                GUEST REVIEWS
              </p>

              <h2>
                What people say
              </h2>
            </div>

            <div className="review-summary">

              <strong>
                ★ {averageRating}
              </strong>

              <span>
                {reviews.length}{" "}
                {reviews.length === 1
                  ? "review"
                  : "reviews"}
              </span>

            </div>

          </div>

          {}

          {reviews.length === 0 ? (
            <div className="no-reviews">

              <div>
                ★
              </div>

              <h3>
                No reviews yet
              </h3>

              <p>
                Be the first person to
                review this property.
              </p>

            </div>
          ) : (
            <div className="review-list">

              {reviews.map((review) => (

                <article
                  className="review-card"
                  key={review._id}
                >

                  <div className="review-card-top">

                    <div className="review-author">

                      <div className="review-avatar">
                        {review.author?.username
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>

                      <div>

                        <strong>
                          {review.author
                            ?.username ||
                            "User"}
                        </strong>

                        <small>
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            }
                          )}
                        </small>

                      </div>

                    </div>

                    <div className="review-stars">
                      {"★".repeat(
                        Number(review.rating)
                      )}
                      {"☆".repeat(
                        5 -
                          Number(review.rating)
                      )}
                    </div>

                  </div>

                  <p>
                    {review.comment}
                  </p>

                </article>

              ))}

            </div>
          )}

          {/* =========================
              WRITE REVIEW
          ========================= */}

          {user ? (
            <div className="write-review">

              <div className="write-review-header">

                <p className="eyebrow">
                  SHARE YOUR EXPERIENCE
                </p>

                <h2>
                  Write a review
                </h2>

              </div>

              <form
                onSubmit={
                  handleReviewSubmit
                }
              >

                <div className="rating-selector">

                  <span>
                    Your rating
                  </span>

                  <div className="rating-buttons">

                    {[1, 2, 3, 4, 5].map(
                      (value) => (
                        <button
                          type="button"
                          key={value}
                          className={
                            value <= rating
                              ? "star-active"
                              : "star-inactive"
                          }
                          onClick={() =>
                            setRating(value)
                          }
                        >
                          ★
                        </button>
                      )
                    )}

                  </div>

                </div>

                <textarea
                  value={comment}
                  onChange={(event) =>
                    setComment(
                      event.target.value
                    )
                  }
                  placeholder="Tell others about your experience..."
                  rows="5"
                />

                {message && (
                  <div className="auth-message">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="review-submit"
                  disabled={reviewLoading}
                >
                  {reviewLoading
                    ? "Submitting..."
                    : "Submit review"}
                </button>

              </form>

            </div>
          ) : (
            <div className="login-review-message">

              <p>
                Login to share your experience
                and write a review.
              </p>

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default ListingDetails;