import buildingStatsRouter from './api/building-stats.js';

// API routes
app.use('/api', priceStatsRouter);
app.use('/api', regionDetailsRouter);
app.use('/api', transactionStatsRouter);
app.use('/api', buildingStatsRouter); 