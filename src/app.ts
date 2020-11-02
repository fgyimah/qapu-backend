import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import createApi from './api';

export default function bootstrapApp(): express.Express {
  const app = express();

  // default middlewares
  app.use(helmet());
  app.use(compression());
  app.use(cors());
  app.use(morgan('dev'));

  // parse incoming requests
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // create api handlers
  createApi(app);

  return app;
}
