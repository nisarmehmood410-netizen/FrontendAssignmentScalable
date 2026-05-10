import { Link } from "react-router-dom";
import Card from "./Card";
import RatingStars from "./RatingStars";

function ImageCard({ image }) {
  const commentCount = image.comments?.length || 0;

  return (
    <Card className="image-card">
      <Link to={`/images/${image.id || image._id}`} className="image-link">
        <div className="image-frame">
          <span className="card-badge">Frame</span>
          <img src={image.imageUrl} alt={image.title} loading="lazy" />
        </div>

        <div className="image-copy">
          <div className="image-copy-top image-meta-row">
            <div>
              <h3>{image.title}</h3>
              <p>{image.location || "Any latitude"}</p>
            </div>

            <span className="pill-soft">{commentCount} notes</span>
          </div>

          <p className="image-caption">{image.caption}</p>

          <div className="image-meta image-meta-row">
            {/* <span>{image.author || image.creator || "Unknown lens"}</span> */}

            <div className="image-rating">
              <RatingStars
                value={Math.round(image.rating || 0)}
                readonly
                size="sm"
              />
              <span>{(image.rating || 0).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default ImageCard;
