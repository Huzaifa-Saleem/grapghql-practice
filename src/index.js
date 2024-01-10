import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// mock db
import db from "./mock/_db.js";

import { typeDefs } from "./schema.js";

const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    game(_, { id }) {
      return db.games.find((game) => game.id === id);
    },
    reviews() {
      return db.reviews;
    },
    review(_, { id }) {
      return db.reviews.find((review) => review.id === id);
    },
    authors() {
      return db.authors;
    },
    author(_, { id }) {
      return db.authors.find((author) => author.id === id);
    },
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter((r) => r.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((r) => r.author_id === parent.id);
    },
  },
  Review: {
    game(parent) {
      return db.games.find((g) => g.id === parent.game_id);
    },
    author(parent) {
      return db.authors.find((a) => a.id === parent.author_id);
    },
  },
  Mutation: {
    deleteGame(_, args) {
      const game = db.games.find((game) => game.id === args.id);
      if (!game) {
        throw new Error("Game not found");
      }
      db.games = db.games.filter((game) => game.id !== args.id);
      return game;
    },
    addGame(_, args) {
      const game = {
        id: (Math.random() * 100000).toFixed(0),
        title: args.game.title,
        platform: args.game.platform,
      };
      db.games.push(game);
      return game;
    },
    editGame(_, args) {
      const game = db.games.find((game) => game.id === args.id);
      game.title = args.game?.title || game.title;
      game.platform =
        args.game?.platform && args.game?.platform?.length > 0
          ? args.game?.platform
          : args.game.platform || game.platform;
      return game;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
