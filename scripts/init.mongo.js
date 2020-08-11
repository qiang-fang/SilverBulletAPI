// const { db } = require("mongodb");
/* global db print */
/* eslint no-restricted-globals: "off" */
db.backlog.remove({});
db.deleted_tickets.remove({});
db.dashboard.remove({});
db.counters.remove({});

const ticketDB = [
  {
    id: 1,
    dashboardId: 1,
    status: 'ToDo',
    owner: 'Ravan',
    priority: 1,
    effort: 5,
    created: new Date('2019-01-15'),
    due: undefined,
    title: 'Error in console when clicking Add',
    description: 'Steps to recreate the problem:'
      + '\n1. Refresh the browser.'
      + '\n2. Select "New" in the filter'
      + '\n3. Refresh the browser again. Note the warning in the console:'
      + '\n   Warning: Hash history cannot PUSH the same path; a new entry'
      + '\n   will not be added to the history stack'
      + '\n4. Click on Add.'
      + '\n5. There is an error in console, and add doesn\'t work.',
  },
  {
    id: 2,
    dashboardId: 2,
    status: 'InProgress',
    owner: 'Eddie',
    priority: 2,
    effort: 14,
    created: new Date('2019-01-16'),
    due: new Date('2019-02-01'),
    title: 'Missing bottom border on panel',
    description: 'There needs to be a border in the bottom in the panel'
      + ' that appears when clicking on Add',
  },
];

const dashboardDB = [
  {
    id: 1,
    title: 'Project1',
    label: 'Project test1: do something1',
  },
  {
    id: 2,
    title: 'Project2',
    label: 'Project test2: do something2',
  },
  {
    id: 3,
    title: 'Project3',
    label: 'Project test3: do something3',
  },
];

db.backlog.insertMany(ticketDB);
const countTickets = db.backlog.count();
print('Inserted', countTickets, 'backlog');

db.counters.remove({ _id: 'backlog' });
db.counters.insert({ _id: 'backlog', current: countTickets });

db.backlog.createIndex({ id: 1 }, { unique: true });
db.backlog.createIndex({ status: 1 });
db.backlog.createIndex({ owner: 1 });
db.backlog.createIndex({ priority: 1 });
db.backlog.createIndex({ created: 1 });
db.backlog.createIndex({ title: 'text', description: 'text' });
db.deleted_tickets.createIndex({ id: 1 }, { unique: true });

db.dashboard.createIndex({ id: 1 }, { unique: true });
db.dashboard.createIndex({ title: 1 }, { unique: true });
db.dashboard.insertMany(dashboardDB);
const countBoards = db.dashboard.count();
print('Inserted', countBoards, 'dashboard');

db.counters.remove({ _id: 'dashboard' });
db.counters.insert({ _id: 'dashboard', current: countBoards });

