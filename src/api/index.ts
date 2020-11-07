import { Express, Router } from 'express';
import auth from './auth';
import department from './department';
import faculty from './faculty';
import programs from './programs';

export interface Route {
  path: string;
  router: Router;
}

const routes: Route[] = [auth, faculty, department, programs];

export default function createApi(app: Express) {
  routes.forEach((route) => {
    app.use(`/api${route.path}`, route.router);
  });
}
