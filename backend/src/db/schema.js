import {
  pgTable, serial, text, varchar,
  boolean, timestamp, integer, unique
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id:        serial("id").primaryKey(),
  name:      varchar("name", { length: 100 }).notNull(),
  email:     varchar("email", { length: 255 }).notNull().unique(),
  password:  text("password").notNull(),
  role:      varchar("role", { length: 10 }).notNull().default("user"),
  isBanned:  boolean("is_banned").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
  id:        serial("id").primaryKey(),
  userId:    integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  movieId:   integer("movie_id").notNull(),
  movieType: varchar("movie_type", { length: 10 }).notNull().default("movie"),
  title:     text("title").notNull(),
  poster:    text("poster"),
  addedAt:   timestamp("added_at").defaultNow(),
}, (t) => ({
  uniq: unique().on(t.userId, t.movieId, t.movieType),
}));

export const watchHistory = pgTable("watch_history", {
  id:        serial("id").primaryKey(),
  userId:    integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  movieId:   integer("movie_id").notNull(),
  movieType: varchar("movie_type", { length: 10 }).notNull().default("movie"),
  title:     text("title").notNull(),
  poster:    text("poster"),
  watchedAt: timestamp("watched_at").defaultNow(),
});

export const adminMovies = pgTable("admin_movies", {
  id:          serial("id").primaryKey(),
  tmdbId:      integer("tmdb_id").unique(),
  title:       text("title").notNull(),
  overview:    text("overview"),
  poster:      text("poster"),
  genre:       text("genre"),
  releaseDate: text("release_date"),
  trailerUrl:  text("trailer_url"),
  category:    text("category"),
  createdBy:   integer("created_by").references(() => users.id),
  createdAt:   timestamp("created_at").defaultNow(),
  updatedAt:   timestamp("updated_at").defaultNow(),
});
