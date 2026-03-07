import axios from "axios";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "1a2913a190c70701da5c418c8fbcbbf3";
const BASE_URL = "https://api.themoviedb.org/3";

export const IMG_BASE = "https://image.tmdb.org/t/p";

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getTrending = async (type: "movie" | "tv" = "movie") => {
  const { data } = await tmdb.get(`/trending/${type}/week`);
  return data.results;
};

export const getPopular = async (type: "movie" | "tv" = "movie") => {
  const { data } = await tmdb.get(`/${type}/popular`);
  return data.results;
};

export const getMovieDetails = async (id: string, type: "movie" | "tv" = "movie") => {
  const { data } = await tmdb.get(`/${type}/${id}`);
  return data;
};

export const getMovieVideos = async (id: string, type: "movie" | "tv" = "movie") => {
  const { data } = await tmdb.get(`/${type}/${id}/videos`);
  return data.results;
};

export const searchMulti = async (query: string) => {
  const { data } = await tmdb.get("/search/multi", {
    params: { query },
  });
  return data.results;
};

export default tmdb;
