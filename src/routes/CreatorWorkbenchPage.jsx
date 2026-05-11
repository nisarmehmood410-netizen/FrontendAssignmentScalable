import { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import { createImage } from "../services/images.api";

const initialState = {
  imageFile: null,
  title: "",
  caption: "",
  location: "",
  people: "",
};

function CreatorWorkbenchPage() {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileKey, setFileKey] = useState(0);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.imageFile || !form.title.trim() || !form.caption.trim()) {
      setError("Please add image, title, and caption.");
      return;
    }

    const data = new FormData();
    data.append("image", form.imageFile);
    data.append("title", form.title.trim());
    data.append("caption", form.caption.trim());
    data.append("location", form.location.trim());
    data.append("people", form.people.trim());

    setLoading(true);

    try {
      const res = await createImage(data);
      setMessage(res?.message || "Image published successfully.");
      setForm(initialState);
      setFileKey((k) => k + 1);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-stack creator-shell">
      <div className="split-panel-head">
        <section className="creator-accent-card">
          <span className="creator-accent-badge">studio desk</span>
          <div>
            <span className="eyebrow">Publishing lane</span>
            <h2>Upload and push to the collective wall</h2>
            <p className="muted-copy">
              Publish images with title, caption, and metadata from one form.
            </p>
          </div>
          <div className="creator-accent-meta">
            <div>
              <strong>Raster-ready</strong> PNG, JPG, WEBP uploads with captions
              and light metadata tags.
            </div>
            <div>
              <strong>Audience sync</strong> Posts appear instantly in the explorer
              without extra hops.
            </div>
          </div>
        </section>

        <aside className="feed-hero-side">
          <div className="hero-stat-grid">
            <div className="hero-stat">
              <span>Uploader</span>
              <strong>Creator role</strong>
            </div>
            <div className="hero-stat">
              <span>Throughput</span>
              <strong>Single asset</strong>
            </div>
            <div className="hero-stat" style={{ gridColumn: "1 / -1" }}>
              <span>Autosave?</span>
              <strong>You stay responsible</strong>
            </div>
          </div>
        </aside>
      </div>

      <Card className="form-card">
        <form className="creator-form" onSubmit={handleSubmit}>
          <Input
            key={fileKey}
            type="file"
            label="Image"
            accept="image/*"
            onChange={(e) =>
              updateField("imageFile", e.target.files?.[0] || null)
            }
            hint={form.imageFile ? form.imageFile.name : "Choose an image"}
          />

          <div className="form-grid">
            <Input
              label="Title"
              value={form.title}
              placeholder="Image title"
              onChange={(e) => updateField("title", e.target.value)}
            />

            <Input
              label="Location"
              value={form.location}
              placeholder="Location"
              onChange={(e) => updateField("location", e.target.value)}
            />
          </div>

          <Textarea
            label="Caption"
            value={form.caption}
            placeholder="Write a caption"
            onChange={(e) => updateField("caption", e.target.value)}
          />

          <Input
            label="People"
            value={form.people}
            placeholder="Names separated by commas"
            onChange={(e) => updateField("people", e.target.value)}
          />

          {message && <p className="success-banner">{message}</p>}
          {error && <p className="error-banner">{error}</p>}

          <div className="form-actions">
            <Button type="submit" disabled={loading}>
              {loading ? "Publishing..." : "Publish"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setForm(initialState);
                setMessage("");
                setError("");
                setFileKey((k) => k + 1);
              }}
            >
              Reset lane
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreatorWorkbenchPage;
