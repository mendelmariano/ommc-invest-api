import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProfileController from './app/controllers/ProfileController';

import authMiddleware from './app/middlewares/auth';
import CategoryController from './app/controllers/CategoryController';
import MovementController from './app/controllers/MovementController';
import TypeController from './app/controllers/TypeController';
import PatrimonyController from './app/controllers/PatrimonyController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.delete('/users/:id', UserController.delete);
routes.post('/sessions', SessionController.store);
routes.get('/sessions/google/:idToken', SessionController.storeGoogle);
routes.put('/users/google/:id', UserController.updateGoogle);

// Todas as rotas abaixo precisam estar autenticadas
routes.use(authMiddleware);
routes.put('/users', UserController.update);
routes.put('/users/:id', UserController.updateSomeone);
routes.get('/users/:id', UserController.searchById);
routes.get('/users/paginate/index/:page', UserController.index);
routes.post('/users/paginate/search', UserController.indexSearch);

// Resource de perfis
routes.get('/profiles', ProfileController.index);
routes.get('/profiles/users/:id', ProfileController.searchUsersForId);
routes.get('/profiles/:id', ProfileController.searchById);
routes.delete('/profiles/:id', ProfileController.delete);

// Resource de categorias
routes.get('/categories', CategoryController.index);
routes.get(
    '/categories/movements/:id',
    CategoryController.searchCategoriesForId
);
routes.get('/categories/:id', CategoryController.searchById);
routes.delete('/categories/:id', CategoryController.delete);

// Resource de Movimentações
routes.get('/movements', MovementController.index);
routes.post('/movements', MovementController.store);
routes.put('/movements/:id', MovementController.update);
routes.delete('/movements/:id', MovementController.delete);
routes.get('/movements/start/:type_id', MovementController.indexStart);
routes.post('/movements/start/:type_id', MovementController.indexStartPeriod);

// Resource de Patrimonios
routes.get('/patrimonies', PatrimonyController.index);
routes.get('/patrimonies/forMonth', PatrimonyController.forMonth);
routes.post('/patrimonies', PatrimonyController.store);
routes.post('/patrimonies/period', PatrimonyController.patrimonyForPeriod);
routes.put('/patrimonies/desative/:id', PatrimonyController.desactive);
routes.delete('/patrimonies/:id', PatrimonyController.delete);
routes.put('/patrimonies/part/:id', PatrimonyController.createDuplicatePart);
routes.put('/patrimonies/:id', PatrimonyController.update);

// Resource de Tipos de entradas
routes.get('/types', TypeController.index);
routes.post('/types', TypeController.store);

export default routes;
