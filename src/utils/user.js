/** Display name for who created a photo (handles several API shapes). */
export function getPhotoCreatorName(photo) {
  if (!photo || typeof photo !== "object") return "";

  const direct = photo.author;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const creator = photo.creator;
  if (creator && typeof creator === "object") {
    const name = creator.username || creator.name || creator.email;
    if (name) return String(name).trim();
  }
  if (typeof creator === "string" && creator.trim()) return creator.trim();

  const creatorId = photo.creatorId;
  if (creatorId && typeof creatorId === "object") {
    const name = creatorId.username || creatorId.name || creatorId.email;
    if (name) return String(name).trim();
  }

  const uploadedBy = photo.uploadedBy;
  if (uploadedBy && typeof uploadedBy === "object") {
    const name = uploadedBy.username || uploadedBy.name || uploadedBy.email;
    if (name) return String(name).trim();
  }

  return "";
}
