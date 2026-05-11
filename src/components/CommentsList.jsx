function CommentsList({ comments }) {
  if (!comments.length) {
    return (
      <p className="muted-copy">No comments yet. Be the first to leave one.</p>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <article key={comment.id || comment._id} className="comment-item">
          <div className="comment-author">
            {comment.author || comment.userName || "Unknown"}
          </div>
          <p>{comment.text}</p>
        </article>
      ))}
    </div>
  );
}

export default CommentsList;
