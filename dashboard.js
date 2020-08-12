// const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');
const { mustBeSignedIn } = require('./auth.js');

async function list() {
  // return dashboard;
  const db = getDb();
  const cursor = db.collection('dashboard').find({}).sort({ id: 1 });
  const dashboards = cursor.toArray();
  return dashboards;
}

async function get(_, { id }) {
  const db = getDb();
  const dashboard = await db.collection('dashboard').findOne({ id });
  return dashboard;
}

// async function list() {
//   const db = getDb();
//   const dashboardList = await db.collection('dashboard').find({}).toArray();
//   return dashboardList;
// }

async function add(_, { dashboard }) {
  const db = getDb();
  const newDashboard = Object.assign({}, dashboard);
  newDashboard.id = await getNextSequence('dashboard');
  const result = await db.collection('dashboard').insertOne(newDashboard);
  const savedDashboard = await db.collection('dashboard').findOne({ _id: result.insertedId });
  return savedDashboard;
}

module.exports = {
  list,
  get,
  add: mustBeSignedIn(add),
};
