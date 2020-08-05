const fs = require('fs');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');

const GraphQLDate = require('./graphql_date.js');
const about = require('./about.js');
const ticket = require('./ticket.js');
const auth = require('./auth.js');

// define handlers or functions that can be called when the above fields are accessed
const resolvers = {
  Query: {
    about: about.getMessage,
    user: auth.resolveUser,
    backlog: ticket.list,
    ticket: ticket.get,
    ticketCounts: ticket.counts,
  },
  Mutation: {
    setAboutMessage: about.setMessage,
    ticketAdd: ticket.add,
    ticketUpdate: ticket.update,
    ticketDelete: ticket.delete,
    ticketRestore: ticket.restore,
  },
  GraphQLDate,
};

function getContext({ req }) {
  const user = auth.getUser(req);
  return { user };
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  context: getContext,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCors);

  let cors;
  if (enableCors) {
    const origin = process.env.UI_SERVER_ORIGIN || 'http://localhost:8000';
    const methods = 'POST';
    cors = { origin, methods, credentials: true };
  } else {
    cors = 'false';
  }

  // install the middleware in the Express application
  server.applyMiddleware({ app, path: '/graphql', cors });
}

module.exports = { installHandler };
