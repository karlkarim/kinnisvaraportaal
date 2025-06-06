import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import priceStatsRouter from './api/price-stats.js';
import regionDetailsRouter from './api/region-details.js';
import transactionStatsRouter from './api/transaction-stats.js';
import buildingStatsRouter from './api/building-stats.js';
import priceStatsChartRouter from './api/price-stats-chart.js';
import hpiRouter from './api/hpi.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', priceStatsRouter);
app.use('/api', regionDetailsRouter);
app.use('/api', transactionStatsRouter);
app.use('/api', buildingStatsRouter);
app.use('/api', priceStatsChartRouter);
app.use('/api', hpiRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 