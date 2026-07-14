import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import customerRoutes from './routes/customerRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Configure CORS to allow connection from the Vite Dev server (normally port 5173)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Mount the customer API endpoints
app.use('/api', customerRoutes);

// Root route display check
app.get('/', (req, res) => {
  res.status(200).json({
    status: "Healthy",
    service: "Customer 360 AI Dashboard backend server API layer"
  });
});

// Fallback error handler for 404 Route Not Found
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint route not found on this API service." });
});

// Global internal express exception handler
app.use((err, req, res, next) => {
  console.error("Global internal exception caught:", err);
  res.status(500).json({ error: "Internal server error occurred on API backend." });
});

app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}`);
});
