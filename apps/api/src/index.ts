import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://yojanamitra-neon.vercel.app/',
  ],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'YojanaMitra API', timestamp: new Date().toISOString() });
});

// Routes
import matchRouter from './routes/match';
import guideRouter from './routes/guide';

app.use('/api/match', matchRouter);
app.use('/api/guide', guideRouter);

app.listen(PORT, () => {
  console.log(`✅ YojanaMitra API running on http://localhost:${PORT}`);
});

export default app;