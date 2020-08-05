const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');
const { mustBeSignedIn } = require('./auth.js');

const PAGE_SIZE = 10;

//function for get a single ticket
async function get(_, { id }) {
  const db = getDb();
  const ticket = await db.collection('backlog').findOne({ id });
  return ticket;
}

//changed the filter from effort to priority
// async function list(_, {
//   status, priorityMin, priorityMax, search, page,
// }) {
//   const db = getDb();
//   const filter = {};
//   if (status) filter.status = status;
//   if (priorityMin !== undefined || priorityMax !== undefined) {
//     filter.effort = {};
//     if (priorityMin !== undefined) filter.priority.$gte = priorityMin;
//     if (priorityMax !== undefined) filter.priority.$lte = priorityMax;
//   }
//   if (search) filter.$text = { $search: search };
//   const cursor = db.collection('backlog').find(filter)
//     .sort({ id: 1 })
//     .skip(PAGE_SIZE * (page - 1))
//     .limit(PAGE_SIZE);
//   const totalCount = await cursor.count(false);
//   const tickets = cursor.toArray();
//   const pages = Math.ceil(totalCount / PAGE_SIZE);
//   return { tickets, pages };
// }

async function list() {
  const db = getDb();
  const ticket = db.collection('backlog').find().toArray()
  return ticket;
}

//changed the second if statement
//if the status of a ticket is InProgress or Done
//it must have a owner
function validate(ticket) {
  const errors = [];
  if (ticket.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long.');
  }
  if (ticket.status !== 'ToDo' && !ticket.owner) {
    errors.push(`Field owner is required when status is ${ticket.status}.`);
  }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}

async function add(_, { ticket }) {
  const db = getDb();
  validate(ticket);
  const newTicket = Object.assign({}, ticket);
  newTicket.created = new Date();
  newTicket.id = await getNextSequence('backlog');

  const result = await db.collection('backlog').insertOne(newTicket);

  const savedTicket = await db.collection('backlog').findOne({ _id: result.insertedId });
  return savedTicket;
}

async function update(_, { id, changes }) {
  const db = getDb();
  if (changes.title || changes.status || changes.owner) {
    const ticket = await db.collection('backlog').findOne({ id });
    Object.assign(ticket, changes);
    validate(ticket);
  }
  await db.collection('backlog').updateOne({ id }, { $set: changes });
  const savedTicket = await db.collection('backlog').findOne({ id });
  return savedTicket;
}

async function remove(_, { id }) {
  const db = getDb();
  const ticket = await db.collection('backlog').findOne({ id });
  if (!ticket) return false;
  ticket.deleted = new Date();
  //insert deleted ticket to deleted_tickets collection first
  let result = await db.collection('deleted_tickets').insertOne(ticket);
  if (result.insertedId) {
    //remove deleted ticket from backlog
    result = await db.collection('backlog').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

//undo delete API
async function restore(_, { id }) {
  const db = getDb();
  const ticket = await db.collection('deleted_tickets').findOne({ id });
  if (!ticket) return false;
  ticket.deleted = new Date();
  let result = await db.collection('backlog').insertOne(ticket);
  if (result.insertedId) {
    result = await db.collection('deleted_tickets').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

//ticket counts API
//filtered by status
async function counts(_, { status }) {
  const db = getDb();
  const filter = {};
  if (status) filter.status = status;
  const results = await db.collection('backlog').aggregate([
    { $match: filter },
    {
      $group: {
        _id: { owner: '$owner', status: '$status' },
        count: { $sum: 1 },
      },
    },
  ]).toArray();
  const stats = {};
  results.forEach((result) => {
    // eslint-disable-next-line no-underscore-dangle
    const { owner, status: statusKey } = result._id;
    if (!stats[owner]) stats[owner] = { owner };
    stats[owner][statusKey] = result.count;
  });
  return Object.values(stats);
}


//deleted mustBeSignedIn() at this development stage for convenience
// module.exports = {
//   list,
//   add: mustBeSignedIn(add),
//   get,
//   update: mustBeSignedIn(update),
//   delete: mustBeSignedIn(remove),
//   restore: mustBeSignedIn(restore),
//   counts,
// };

module.exports = {
  list,
  add,
  get,
  update,
  delete: remove,
  restore,
  counts,
};