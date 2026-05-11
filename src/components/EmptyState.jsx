import { ImageOff } from "lucide-react";

function EmptyState({ title, body }) {
  return (
    <div className="empty-state">
      <div className="empty-state-visual" aria-hidden>
        <ImageOff size={22} strokeWidth={2} />
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export default EmptyState;
