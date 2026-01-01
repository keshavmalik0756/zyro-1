export const formatTimeAgo = (
  input: string | number | Date
): string => {
  const date = new Date(input);
  const now = new Date();

  const diffInSeconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec ago`;
  }

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
};
