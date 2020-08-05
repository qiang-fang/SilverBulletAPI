let aboutMessage = 'Silver Bullet Scrumboard v1.0';
const { mustBeSignedIn } = require('./auth.js');

function setMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

function getMessage() {
  return aboutMessage;
}

//deleted mustBeSignedIn() at this development stage for convenience
//module.exports = { getMessage, setMessage: mustBeSignedIn(setMessage) };
module.exports = { getMessage, setMessage };