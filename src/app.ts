import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import { notFound, errorHandler } from './routes/middlewares';
import root from './routes';
import compression from 'compression';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 'uniquelocal');
app.use(
  process.env.NODE_ENV === 'production'
    ? morgan('combined', { skip: (req, res) => res.statusCode < 400 })
    : morgan('dev'),
);
app.use(helmet());
// app.use(cors()); // temporary disable CORS
app.use(compression());
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.set('json spaces', 2);
}

app.use('/', root);

app.use(notFound);
app.use(errorHandler);

export { app };
export default app;
