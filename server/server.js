const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
dotenv.config();
const connectDB = require('./src/config/db');
connectDB();
const updatePrices = require('./src/jobs/cronJobs');
updatePrices.start();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
app.set('io', io);
const authRoutes = require('./src/routes/authRoutes');
const marketRoutes = require('./src/routes/marketRoutes');
const priceRoutes = require('./src/routes/priceRoutes');
const listingRoutes = require('./src/routes/listingRoutes');
const recommendationRoutes = require('./src/routes/recommendationRoutes');
const warehouseRoutes = require('./src/routes/warehouseRoutes');
const weatherRoutes = require('./src/routes/weatherRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/transactions', transactionRoutes);
app.get('/', (req, res) => {
    res.send('Agri Market Intelligence API is running');
});
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});
const cron = require('node-cron');
const MarketDataService = require('./src/services/marketDataService');
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily market data sync...');
    await MarketDataService.syncDatabase();
});
if (process.env.DATA_GOV_API_KEY && false) { // Disabled startup sync to avoid 429 errors
    setTimeout(async () => {
        try {
            await MarketDataService.syncDatabase();
        } catch (error) {
            console.error('Initial market data sync failed:', error.message);
        }
    }, 5000);
}
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
