function StarRating({ value, onRate, size = "md", readonly = false }) {
  return (
    <div className={`rating-group rating-${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= value ? "star active" : "star"}
          onClick={() => !readonly && onRate?.(star)}
          disabled={readonly}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default StarRating;
