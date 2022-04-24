require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const { DEV_DATABASE_URL } = require('./config/devEnvConfig');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const router = require('./routes/index');

const { PORT = 3000, MONGO_URL = DEV_DATABASE_URL } = process.env;
const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use(limiter);
app.use(router); // роуты

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Запуск сервера на порту: ${PORT}`);
});
