const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit').default;

require('dotenv').config();

const { PORT = 4040 } = process.env;
const app = express();

app.options('*', cors());
app.use(cors());

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // per 15 minutes
  max: 100,
});

// TODO: attach logger here
app.use(rateLimiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.get('/', (req, res) => {
  res.send('<h1>Hello there!</h1>');
});

app.listen(PORT, () => {});
