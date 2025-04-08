export const formatFileSize = (size: number | string | undefined | null) => {
  if (size === undefined || size === null) return "Undefined size";
  if (typeof size === "string") {
    size = parseInt(size)
  }
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};
