const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const logger = require('./config/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(globalRateLimiter);
app.use('/api/auth', authRateLimiter);

// Routes
app.use('/api/docs', require('./routes/docs.routes'));
app.use('/api/triggers', require('./routes/trigger.routes'));
/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Confirm that the API process is running and able to serve requests.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is healthy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        logger.info('Connected to MongoDB');
        app.listen(PORT, () => {
            logger.info('Server started', { port: PORT });
        });
    })
    .catch(err => {
        logger.error('MongoDB connection error', { error: err.message, stack: err.stack });
    });

// TODO: Initialize Workers
// const eventPoller = require('./worker/poller');
// eventPoller.start();

// Error handling middleware (should be last)
app.use(errorLogger);
