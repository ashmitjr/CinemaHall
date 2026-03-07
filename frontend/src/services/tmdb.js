import axios from "axios";

const TMDB_BASE = "https://api.themoviedb.org/3";
export const IMG_BASE = "https://image.tmdb.org/t/p";

const tmdb = axios.create({
  baseURL: TMDB_BASE,
  params: { api_key: import.meta.env.VITE_TMDB_API_KEY || "1a2913a190c70701da5c418c8fbcbbf3" },
});

export const getTrending     = ()              => tmdb.get("/trending/all/week");
export const getPopularMovies = (page = 1)     => tmdb.get("/movie/popular", { params: { page } });
export const getPopularTV    = (page = 1)      => tmdb.get("/tv/popular", { params: { page } });
export const getTrendingMovies = (page = 1)    => tmdb.get("/trending/movie/week", { params: { page } });
export const getMovieById    = (id, type)      => tmdb.get(`/${type}/${id}`);
export const getVideos       = (id, type)      => tmdb.get(`/${type}/${id}/videos`);
export const getCredits      = (id, type)      => tmdb.get(`/${type}/${id}/credits`);
export const getSimilar      = (id, type)      => tmdb.get(`/${type}/${id}/similar`);
export const searchMulti     = (query, page=1) => tmdb.get("/search/multi", { params: { query, page } });
export const getGenres       = (type)          => tmdb.get(`/genre/${type}/list`);
export const getByGenre      = (type, genreId, page=1) => tmdb.get(`/discover/${type}`, { params: { with_genres: genreId, page } });
export const getTopRated     = (type, page=1)  => tmdb.get(`/${type}/top_rated`, { params: { page } });
export const getUpcoming     = (page=1)        => tmdb.get("/movie/upcoming", { params: { page } });
export const getPerson       = (id)            => tmdb.get(`/person/${id}`);
export const getPersonMovies = (id)            => tmdb.get(`/person/${id}/combined_credits`);

export default tmdb;
