export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

/** Owner display name from list/detail image payloads (creator object, nested ids, etc.). */
export function resolveImageAuthor(image) {
  if (!image || typeof image !== "object") return "";

  const direct = image.author;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const creator = image.creator;
  if (creator && typeof creator === "object") {
    const name = creator.username || creator.name || creator.email;
    if (name) return String(name).trim();
  }
  if (typeof creator === "string" && creator.trim()) return creator.trim();

  const creatorId = image.creatorId;
  if (creatorId && typeof creatorId === "object") {
    const name = creatorId.username || creatorId.name || creatorId.email;
    if (name) return String(name).trim();
  }

  const uploadedBy = image.uploadedBy;
  if (uploadedBy && typeof uploadedBy === "object") {
    const name = uploadedBy.username || uploadedBy.name || uploadedBy.email;
    if (name) return String(name).trim();
  }

  return "";
}
