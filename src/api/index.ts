import { Express, Router } from 'express';
import auth from './auth';

export interface Route {
  path: string;
  router: Router;
}

const routes: Route[] = [auth];

export default function createApi(app: Express) {
  routes.forEach((route) => {
    app.use(`/api${route.path}`, route.router);
  });
}
