// Default profile picture for every user. It is a path served by the frontend
// (school-front/public/ahmed.jpeg), so it works locally and in production.
const DEFAULT_USER_IMAGE = "/ahmed.jpeg";

// ~1.5MB of base64 text; the frontend resizes pictures to 256px (~20KB)
const MAX_IMAGE_LENGTH = 1.5 * 1024 * 1024;

const DATA_URL = /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/;

// returns an error message, or null when the value is a valid image
const validateImage = (image) => {
  if (typeof image !== "string") return "Image must be a string";
  if (image === "" || image === DEFAULT_USER_IMAGE) return null;
  if (image.length > MAX_IMAGE_LENGTH) return "Image is too large (max 1.5MB)";
  if (DATA_URL.test(image) || /^https?:\/\/\S+$/.test(image)) return null;
  return "Image must be a png, jpeg, webp or gif";
};

// "" means: go back to the default picture
const normalizeImage = (image) => image || DEFAULT_USER_IMAGE;

module.exports = { DEFAULT_USER_IMAGE, validateImage, normalizeImage };
