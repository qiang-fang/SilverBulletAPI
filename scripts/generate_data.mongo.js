/* global db print */
/* eslint no-restricted-globals: "off" */
const owners = ['Ravan', 'Eddie', 'Pieta', 'Parvati', 'Victor'];
const statuses = ['ToDo', 'In progress', 'Done'];
const initialCount = db.backlog.count();
for (let i = 0; i < 100; i += 1) {
  const randomCreatedDate = (new Date())
    - Math.floor(Math.random() * 60) * 1000 * 60 * 60 * 24;
  const created = new Date(randomCreatedDate);
  const randomDueDate = (new Date())
    - Math.floor(Math.random() * 60) * 1000 * 60 * 60 * 24;
  const due = new Date(randomDueDate);
  const owner = owners[Math.floor(Math.random() * 5)];
  const priority = Math.ceil(Math.random() * 5);
  const dashboardId = Math.ceil(Math.random() * 3);
  const status = statuses[Math.floor(Math.random() * 3)];
  const title = `for product, create feature, ${i}`;
  const description = `the description of creating product and feature, ${i}`;
  const id = initialCount + i + 1;
  const ticket = {
    id, dashboardId, status, owner, priority, created, due, title, description,
  };
  db.backlog.insertOne(ticket);
}
const count = db.backlog.count();
db.counters.update({ _id: 'tickets' }, { $set: { current: count } });
print('New ticket count:', count);
