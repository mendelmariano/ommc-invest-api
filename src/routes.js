import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProfileController from './app/controllers/ProfileController';

import authMiddleware from './app/middlewares/auth';
import TeamController from './app/controllers/TeamController';
import ChampionshipController from './app/controllers/ChampionshipController';
import ResultController from './app/controllers/ResultController';
import ClassificationController from './app/controllers/ClassificationController';
import ModeController from './app/controllers/ModeController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.delete('/users/:user_id', UserController.delete);
routes.post('/sessions', SessionController.store);

// Todas as rotas abaixo precisam estar autenticadas
routes.use(authMiddleware);
routes.put('/users', UserController.update);
routes.put('/users/:id', UserController.updateSomeone);
routes.get('/users/:id', UserController.searchById);
routes.get('/users/paginate/index/:page', UserController.index);
routes.post('/users/paginate/search', UserController.indexSearch);

// Resource de modos de jogo
routes.post('/modes', ModeController.store);
routes.get('/modes', ModeController.index);
routes.get('/modes/:id', ModeController.searchById);
routes.put('/modes/:id', ModeController.update);
routes.delete('/modes/:id', ModeController.delete);

// Resource de times
routes.post('/teams', TeamController.store);
routes.get('/teams', TeamController.index);
routes.patch('/teams/check/:id', TeamController.updateCheck);
routes.get('/teams/user/checked/:id', TeamController.findCheckedByUser);
routes.get('/teams/user/:id', TeamController.findByUser);
routes.get('/teams/:id', TeamController.searchById);
routes.put('/teams/:id', TeamController.update);
routes.delete('/teams/:id', TeamController.delete);

// Resource de perfis
routes.get('/profiles', ProfileController.index);
routes.get('/profiles/users/:id', ProfileController.searchUsersForId);
routes.get('/profiles/:id', ProfileController.searchById);
routes.delete('/profiles/:id', ProfileController.delete);

// Resources de Campeonatos
routes.get('/championships', ChampionshipController.index);
routes.post('/championships', ChampionshipController.store);
routes.post('/championships/forCheck', ChampionshipController.forCheck);
routes.get('/championships/:id', ChampionshipController.searchById);
routes.put('/championships/:id', ChampionshipController.update);
routes.delete('/championships/:id', ChampionshipController.delete);
routes.get(
    '/championships/check/:user_id',
    ChampionshipController.participateCheck
);

routes.patch('/championships/:id', ChampionshipController.participate);

// Resource de Resultados
routes.get('/results', ResultController.index);
routes.post('/results', ResultController.store);
routes.patch('/results/check', ResultController.updateCheck);
routes.patch('/results/decline', ResultController.declineResult);
routes.get('/results/user/:user_id', ResultController.loadResultUser);
routes.get('/results/:id', ResultController.searchById);
routes.delete('/results/:id', ResultController.delete);

// Resources de classificações
routes.get('/classifications', ClassificationController.index);
routes.patch(
    '/classification/team/check',
    ClassificationController.checkChange
);
routes.get(
    '/classifications/result/listHomeTeams/:user_id/:championship_id',
    ClassificationController.teamsHomeForResult
);

routes.get(
    '/classifications/result/listAwayTeams/:user_id/:championship_id',
    ClassificationController.teamsAwayForResult
);

routes.post(
    '/classifications/championship/forTeams',
    ClassificationController.classificationForTeams
);

routes.get(
    '/classifications/championship/:championship_id',
    ClassificationController.classificationForChamp
);

export default routes;
