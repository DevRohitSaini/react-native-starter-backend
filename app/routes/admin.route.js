import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import AdminController from '../controllers/admin.controller';

const routes = new Router();

routes.route('/')
    .post(authenticate, AdminController.create)
    .get(authenticate, AdminController.search);

routes.route('/:id')
    .get(authenticate, AdminController._populate, AdminController.fetch)
    .put(authenticate, AdminController._populate, AdminController.update)
    .delete(authenticate, AdminController._populate, AdminController.delete);

export default routes;
