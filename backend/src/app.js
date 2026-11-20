const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded resumes statically
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Mount API Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;

