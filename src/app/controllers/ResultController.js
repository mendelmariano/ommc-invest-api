// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';
import Result from '../models/Result';
import Classification from '../models/Classification';
import Team from '../models/Team';
import Championship from '../models/Championship';

const { Op } = require('sequelize');

class ResultController {
    async index(req, res) {
        const results = await Result.findAll({
            include: [
                { model: Team, as: 'home', attributes: ['team'] },
                { model: Team, as: 'away', attributes: ['team'] },
            ],
        });

        return res.json(results);
    }

    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                home_goals: Yup.number().required(),
                away_goals: Yup.number().required(),
                home_team: Yup.number().required(),
                away_team: Yup.number().required(),
                status: Yup.number(),
                championship_id: Yup.number().required(),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: 'falha na validação' });
            }

            const verifyResultsExistsInChamp = await Result.findAll({
                where: {
                    championship_id: req.body.championship_id,
                    [Op.or]: [
                        {
                            [Op.and]: [
                                { home_team: req.body.home_team },
                                { away_team: req.body.away_team },
                            ],
                        },
                        {
                            [Op.and]: [
                                { home_team: req.body.away_team },
                                { away_team: req.body.home_team },
                            ],
                        },
                    ],
                    status: {
                        [Op.lt]: 2, // Adiciona a condição status < 2 para excluir os resultados rejeitados
                    },
                },
            });

            if (verifyResultsExistsInChamp.length >= 2) {
                return res.status(400).json({
                    error: 'Você só pode jogar duas vezes contra o mesmo adversário por campeonato',
                });
            }

            // Interceptando para pegar o id do usuário logado e setar ele como proprietário deste resultado
            req.body.owner = req.userId;

            const resultCadastrado = await Result.create(req.body);

            if (!resultCadastrado) {
                return res
                    .status(400)
                    .json({ error: 'falha no registro de resultado' });
            }

            const { home_team, away_team, championship_id } = resultCadastrado;

            const existingTeams = await Classification.findAll({
                where: {
                    championship_id,
                    team_id: [home_team, away_team],
                },
            });

            const teamsToCreate = [home_team, away_team].filter(
                (teamId) =>
                    !existingTeams.some((team) => team.team_id === teamId)
            );

            await Classification.bulkCreate(
                teamsToCreate.map((teamId) => ({
                    team_id: teamId,
                    championship_id,
                    check: true, // Defina como 'true' ou outro valor adequado
                }))
            );

            return res.json(resultCadastrado);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Erro interno do servidor na criação do resultado',
            });
        }
    }

    async update(req, res) {
        const { id } = req.params;

        const result = await Result.findByPk(id);

        if (!result) {
            return res.status(400).json({ error: 'Resultado não existe. ' });
        }

        await result.update(req.body);

        return res.json(result);
    }

    async searchById(req, res) {
        const { id } = req.params;

        const result = await Result.findByPk(id);

        if (!result) {
            return res.status(400).json({ error: 'Resultado não existe. ' });
        }

        return res.json(result);
    }

    async loadResultUser(req, res) {
        const { user_id } = req.params;

        const teams = await Team.findAll({
            where: {
                user_id,
                check: true, // Certifique-se de que check seja verdadeiro
            },
        });

        const teamIds = teams.map((team) => team.id);

        const results = await Result.findAll({
            where: {
                [Op.or]: [
                    {
                        home_team: {
                            [Op.in]: teamIds, // Verifica se está na equipe da casa
                        },
                    },
                    {
                        away_team: {
                            [Op.in]: teamIds, // Verifica se está na equipe visitante
                        },
                    },
                ],
            },
            include: [
                { model: Team, as: 'home', attributes: ['team'] },
                { model: Team, as: 'away', attributes: ['team'] },
                {
                    model: Championship,
                    as: 'championship',
                    attributes: ['id', 'name'],
                },
            ],
        });

        return res.json(results);
    }

    async delete(req, res) {
        const { id } = req.params;

        const result = await Result.findByPk(id);

        if (!result) {
            return res.status(400).json({ error: 'Resultado não existe. ' });
        }

        await result.destroy();
        return res.status(200).send();
    }

    async declineResult(req, res) {
        const { id, motivo_cancelamento } = req.body;

        const result = await Result.findByPk(id, {
            include: [
                { model: Team, as: 'home', attributes: ['team'] },
                { model: Team, as: 'away', attributes: ['team'] },
                {
                    model: Championship,
                    as: 'championship',
                    attributes: ['id', 'name'],
                },
            ],
        });

        if (!result) {
            return res.status(400).json({ error: 'Resultado não existe. ' });
        }

        // Define o campo 'status' como 2
        result.status = 2;
        result.motivo_cancelamento = motivo_cancelamento;

        await result.save();
        return res.json(result);
    }

    async updateCheck(req, res) {
        const { id } = req.body;

        const result = await Result.findByPk(id, {
            include: [
                { model: Team, as: 'home', attributes: ['team'] },
                { model: Team, as: 'away', attributes: ['team'] },
                {
                    model: Championship,
                    as: 'championship',
                    attributes: ['id', 'name'],
                },
            ],
        });

        if (!result) {
            return res.status(400).json({ error: 'Resultado não existe. ' });
        }

        if (result.owner === req.userId) {
            return res.status(400).json({
                error: 'Você não pode confirmar um resultado contra seu próprio time.',
            });
        }

        // Define o campo 'check' como true
        result.status = 1;

        // Salva as mudanças no banco de dados
        await result.save();

        if (result.home_goals > result.away_goals) {
            const homeTeamClassification = await Classification.findOne({
                where: {
                    championship_id: result.championship_id,
                    team_id: result.home_team,
                },
            });

            homeTeamClassification.wins += 1;
            homeTeamClassification.points += 3;
            homeTeamClassification.goals_pro += result.home_goals;
            homeTeamClassification.goals_conceded += result.away_goals;
            homeTeamClassification.goals_difference =
                homeTeamClassification.goals_pro -
                homeTeamClassification.goals_conceded;

            homeTeamClassification.save();

            const awayTeamClassification = await Classification.findOne({
                where: {
                    championship_id: result.championship_id,
                    team_id: result.away_team,
                },
            });

            awayTeamClassification.loses += 1;
            awayTeamClassification.goals_pro += result.away_goals;
            awayTeamClassification.goals_conceded += result.home_goals;
            awayTeamClassification.goals_difference =
                awayTeamClassification.goals_pro -
                awayTeamClassification.goals_conceded;

            awayTeamClassification.save();
        }

        if (result.home_goals < result.away_goals) {
            const awayTeamClassification = await Classification.findOne({
                where: {
                    championship_id: result.championship_id,
                    team_id: result.home_team,
                },
            });

            awayTeamClassification.wins += 1;
            awayTeamClassification.points += 3;
            awayTeamClassification.goals_pro = +result.home_goals;
            awayTeamClassification.goals_conceded += result.away_goals;
            awayTeamClassification.goals_difference =
                awayTeamClassification.goals_pro -
                awayTeamClassification.goals_conceded;

            awayTeamClassification.save();

            const homeTeamClassification = await Classification.findOne({
                where: {
                    championship_id: result.championship_id,
                    team_id: result.away_team,
                },
            });

            homeTeamClassification.loses += 1;
            homeTeamClassification.goals_pro = +result.away_goals;
            homeTeamClassification.goals_conceded += result.home_goals;
            homeTeamClassification.goals_difference =
                homeTeamClassification.goals_pro -
                homeTeamClassification.goals_conceded;

            homeTeamClassification.save();
        }

        if (result.home_goals === result.away_goals) {
            const homeTeamClassification = await Classification.findOne({
                where: {
                    championship_id: result.championship_id,
                    team_id: result.home_team,
                },
            });

            homeTeamClassification.ties += 1;
            homeTeamClassification.points += 1;
            homeTeamClassification.goals_pro = +result.home_goals;
            homeTeamClassification.goals_conceded += result.away_goals;

            homeTeamClassification.save();

            const awayTeamClassification = await Classification.findOne({
                where: {
                    championship_id: result.championship_id,
                    team_id: result.away_team,
                },
            });

            awayTeamClassification.ties += 1;
            awayTeamClassification.points += 1;
            awayTeamClassification.goals_pro = +result.away_goals;
            awayTeamClassification.goals_conceded += result.home_goals;

            awayTeamClassification.save();
        }

        return res.json(result);
    }
}

export default new ResultController();
