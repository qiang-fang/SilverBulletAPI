// const { db } = require("mongodb");
/* global db print */
/* eslint no-restricted-globals: "off" */
db.backlog.remove({});
db.deleted_tickets.remove({});
db.dashboard.remove({});

const ticketDB = [
  {
    id: 1,
    dashboardId: 1,
    status: 'New',
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
    status: 'Assigned',
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
    title: 'Project 1',
    label: 'Project test1: do something',
  },
  {
    id: 2,
    title: 'Project 2',
    label: 'Project test2: do something',
  },
];

db.backlog.insertMany(ticketDB);
const count = db.backlog.count();
print('Inserted', count, 'backlog');
db.backlog.createIndex({ id: 1 }, { unique: true });
db.backlog.createIndex({ status: 1 });
db.backlog.createIndex({ owner: 1 });
db.backlog.createIndex({ priority: 1 });
db.backlog.createIndex({ created: 1 });
db.backlog.createIndex({ title: 'text', description: 'text' });
db.deleted_tickets.createIndex({ id: 1 }, { unique: true });

db.dashboard.insertMany(dashboardDB);
const dashboardCount = db.dashboard.count();
print('Inserted', dashboardCount, 'dashboard');

db.counters.remove({ _id: 'tickets' });
db.counters.insert({ _id: 'tickets', current: count });
