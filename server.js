const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const uuid = require('uuid');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

const isValidEmail = email => email.includes('@');
const DB = ['tirli@test.com', 'test@test.com'];

app.post('/validate/email', function(req, res) {
  if (DB.includes(req.body.email)) {
    res.status(400).send({ isValid: false });
  }

  res.status(200).send({ isValid: true });
});

app.post('/signup', function(req, res) {
  const { email, password, passwordConfirm } = req.body;
  const errors = [];

  if (!email) errors.push({ field: 'email', error: 'Missing email' });
  if (!password) errors.push({ field: 'password', error: 'Missing password' });
  if (!passwordConfirm)
    errors.push({
      field: 'passwordConfirm',
      error: 'Missing password confirm',
    });

  if (errors.length) res.status(400).send({ isValid: false, errors });

  if (password !== passwordConfirm)
    errors.push({ field: 'passwordConfirm', error: "Passwords doesn't match" });
  if (!isValidEmail(email))
    errors.push({ field: 'email', error: 'Invalid email' });

  if (DB.includes(email))
    errors.push({ field: 'email', error: 'Such email already exist' });

  if (errors.length) res.status(400).send({ isValid: false, errors });

  res.status(200).send({ user: { email, id: uuid() } });
});

const server = app.listen(5000, function() {
  console.log('app running on port.', server.address().port);
});
