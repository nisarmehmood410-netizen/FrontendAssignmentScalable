import { useMemo, useState } from "react";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import ImageCard from "../components/ImageCard";
import LoadingState from "../components/LoadingState";
import SearchBar from "../components/SearchBar";
import useImageFeed from "../hooks/useImageFeed";

function HomePage() {
  const [query, setQuery] = useState("");
  const { images, isLoading, errorMessage } = useImageFeed(query);

  const summary = useMemo(() => {
    if (!images.length) return "No scenes yet";

    if (query.trim()) {
      return `${images.length} match${images.length > 1 ? "es" : ""}`;
    }

    return `${images.length} live scene${images.length > 1 ? "s" : ""}`;
  }, [images.length, query]);

  const aggregateRating = useMemo(() => {
    if (!images.length) return null;
    const total = images.reduce((acc, item) => acc + Number(item.rating || 0), 0);
    return (total / images.length).toFixed(1);
  }, [images]);

  return (
    <div className="page-stack">
      <section className="hero-panel feed-hero">
        <div className="feed-hero-intro">
          <span className="eyebrow">Live feed</span>
          <h1>Stories told in frames</h1>
          <p>
            Browse uploaded images, search quickly, and open details with comments
            and ratings.
          </p>
        </div>

        <aside className="feed-hero-side">
          <div className="hero-stat-grid">
            <div className="hero-stat">
              <span>Snapshot</span>
              <strong>{summary}</strong>
            </div>
            <div className="hero-stat">
              <span>Search</span>
              <strong>Title &amp; caption</strong>
            </div>
            {aggregateRating ? (
              <div className="hero-stat" style={{ gridColumn: "1 / -1" }}>
                <span>Wall average rating</span>
                <strong>{aggregateRating}</strong>
              </div>
            ) : null}
          </div>
        </aside>
      </section>

      <Card className="toolbar-panel">
        <SearchBar value={query} onChange={setQuery} />
      </Card>

      {isLoading && <LoadingState label="Loading images..." />}

      {!isLoading && errorMessage && (
        <EmptyState title="Signal dropped" body={errorMessage} />
      )}

      {!isLoading && !errorMessage && (
        <>
          {images.length > 0 ? (
            <section className="image-grid">
              {images.map((img) => (
                <ImageCard key={img.id || img._id} image={img} />
              ))}
            </section>
          ) : (
            <EmptyState
              title="No scenes found"
              body="Try another search term."
            />
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;
