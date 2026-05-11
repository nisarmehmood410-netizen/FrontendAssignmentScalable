import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import CommentsList from "../components/CommentsList";
import EmptyState from "../components/EmptyState";
import LoadingIndicator from "../components/LoadingIndicator";
import StarRating from "../components/StarRating";
import Textarea from "../components/Textarea";
import { addComment, fetchImageById, submitRating } from "../api/photos";
import { getPhotoCreatorName } from "../utils/user";

function PhotoDetailPage() {
  const { imageId } = useParams();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [comment, setComment] = useState("");

  const [rating, setRating] = useState(0);
  const [savingComment, setSavingComment] = useState(false);
  const [savingRating, setSavingRating] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [ratingError, setRatingError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchImageById(imageId);
        if (!active) return;

        const normalized = {
          ...data,
          imageUrl: data?.imageUrl || data?.url || "",
          author: getPhotoCreatorName(data) || "Unknown",
          uploadedAt: data?.uploadedAt || data?.createdAt || "—",
          rating: data?.averageRating ?? data?.rating ?? 0,
          reviewsCount: data?.ratingCount ?? data?.reviewsCount ?? 0,
          comments: (data?.comments || []).map((c) => ({
            id: c?.id || c?._id,
            author:
              c?.author ||
              c?.userName ||
              c?.user?.username ||
              (typeof c?.userId === "object" ? c.userId?.username : "") ||
              "Unknown",
            text: c?.text || "",
          })),
        };

        setImage(normalized);
        setRating(Math.round(normalized.rating || 0));
      } catch {
        if (active) setError("Image not found.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [imageId]);

  const id = image?.id || image?._id;

  const people = useMemo(() => {
    if (!image?.people) return "—";
    return Array.isArray(image.people)
      ? image.people.join(", ")
      : image.people;
  }, [image]);

  async function handleSubmitComment(e) {
    e.preventDefault();

    if (!id || !comment.trim()) return;

    setCommentError("");
    setSavingComment(true);

    try {
      const newComment = await addComment(id, {
        text: comment.trim(),
      });

      setImage((prev) => ({
        ...prev,
        comments: [
          ...(prev.comments || []),
          {
            id:
              newComment?.id ||
              newComment?._id ||
              `new-comment-${Date.now()}`,
            author:
              newComment?.author ||
              newComment?.userName ||
              newComment?.user?.username ||
              "You",
            text: newComment?.text || comment.trim(),
          },
        ],
      }));

      setComment("");
    } catch (err) {
      setCommentError(
        err.response?.data?.message || "Failed to post comment.",
      );
    } finally {
      setSavingComment(false);
    }
  }

  async function changeRating(value) {
    if (!id) return;

    setRatingError("");
    setRating(value);
    setSavingRating(true);

    try {
      const result = await submitRating(id, value);
      setImage((prev) => {
        const nextRating = result?.averageRating ?? result?.rating ?? value;
        const nextReviewCount =
          result?.reviewsCount ??
          result?.ratingCount ??
          (prev.reviewsCount || 0) + 1;

        return {
          ...prev,
          rating: nextRating,
          reviewsCount: nextReviewCount,
        };
      });
    } catch (err) {
      setRating(Math.round(image?.rating || 0));
      setRatingError(
        err.response?.data?.message || "Failed to submit rating.",
      );
    } finally {
      setSavingRating(false);
    }
  }

  if (loading) return <LoadingIndicator label="Loading..." />;

  if (error || !image) {
    return (
      <EmptyState
        title="Unable to load"
        body={error || "Try another image."}
      />
    );
  }

  return (
    <div className="detail-layout">
      <section className="detail-media">
        <div className="detail-image-wrap">
          <img src={image.imageUrl} alt={image.title} />
        </div>
      </section>

      <section className="detail-sidebar">
        <Card>
          <div className="detail-header">
            <div>
              <span className="eyebrow">Frame study</span>
              <h2>{image.title}</h2>
            </div>
          </div>

          <p className="detail-caption">{image.caption}</p>

          <dl className="metadata-grid">
            <div>
              <dt>Location</dt>
              <dd>{image.location || "—"}</dd>
            </div>

            <div>
              <dt>People</dt>
              <dd>{people}</dd>
            </div>

            <div>
              <dt>Date</dt>
              <dd>{image.uploadedAt || "—"}</dd>
            </div>

            <div>
              <dt>Rating</dt>
              <dd>
                {(image.rating || 0).toFixed(1)} / 5 ({image.reviewsCount || 0}
                )
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h3>Rating</h3>
          <p className="muted-copy">Select a score from 1–5</p>

          <StarRating value={rating} onRate={changeRating} />

          {savingRating && <p className="muted-copy">Saving...</p>}
          {ratingError && <p className="muted-copy">{ratingError}</p>}
        </Card>

        <Card>
          <div className="section-row">
            <h3>Comments</h3>
            <span className="status-chip">{image.comments?.length || 0}</span>
          </div>

          <CommentsList comments={image.comments || []} />

          <form className="comment-form" onSubmit={handleSubmitComment}>
            <Textarea
              label="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <Button type="submit" disabled={savingComment}>
              {savingComment ? "Posting..." : "Post"}
            </Button>
          </form>

          {commentError && <p className="muted-copy">{commentError}</p>}
        </Card>
      </section>
    </div>
  );
}

export default PhotoDetailPage;
