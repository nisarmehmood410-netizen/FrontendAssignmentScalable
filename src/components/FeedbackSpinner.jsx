function FeedbackSpinner({ label = "Loading content..." }) {
  return (
    <div className="loading-state" aria-live="polite">
      <span className="loading-orbit" />
      <p>{label}</p>
    </div>
  );
}

export default FeedbackSpinner;
