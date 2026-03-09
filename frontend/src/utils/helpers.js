export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getYear = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).getFullYear();
};

export const truncate = (str, n) => {
  if (!str) return "";
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
};
