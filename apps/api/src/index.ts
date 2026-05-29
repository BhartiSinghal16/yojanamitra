import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: '*', credentials: false }));
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'YojanaMitra API', timestamp: new Date().toISOString() });
});

import smartMatchRouter from './routes/smartmatch';
import searchRouter from './routes/search';

app.use('/api/smartmatch', smartMatchRouter);
app.use('/api/search', searchRouter);

app.listen(PORT, () => {
  console.log(`✅ YojanaMitra API running on http://localhost:${PORT}`);
});

export default app;