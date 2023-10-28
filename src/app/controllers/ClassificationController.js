// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';
import Classification from '../models/Classification';
import Team from '../models/Team';
import Championship from '../models/Championship';

const { Op } = require('sequelize');

class ClassificationController {
    async index(req, res) {
        const classifications = await Classification.findAll({
            include: [
                {
                    model: Team,
                    as: 'team', // Defina o alias corretamente aqui
                },
                {
                    model: Championship,
                    as: 'championship', // Defina o alias corretamente aqui
                },
            ],
        });

        return res.json(classifications);
    }

    async classificationForChamp(req, res) {
        const { championship_id } = req.params;
        const classifications = await Classification.findAll({
            where: { championship_id },
            include: [
                { model: Team, attributes: ['team'], as: 'team' },
                {
                    model: Championship,
                    attributes: ['name'],
                    as: 'championship',
                },
            ],
        });

        return res.json(classifications);
    }

    async teamsHomeForResult(req, res) {
        const { championship_id, user_id } = req.params;

        // Busque todas as classificações que correspondem ao championship_id
        const classifications = await Classification.findAll({
            where: { championship_id, check: true },
            include: [{ model: Team, as: 'team' }],
        });

        // Busque todos os times do usuário com check igual a true
        const teams = await Team.findAll({
            where: { user_id, check: true },
        });

        // Extraia os IDs dos times da variável 'teams' para posterior comparação
        const teamIds = teams.map((team) => team.id);

        // Filtrar as classificações para incluir apenas as que têm team_id correspondente aos times na variável 'teams'
        const filteredClassifications = classifications.filter(
            (classification) => teamIds.includes(classification.team.id)
        );

        // Mapear os objetos filtrados para retornar apenas a propriedade 'team'
        const filteredTeams = filteredClassifications.map(
            (classification) => classification.team
        );

        return res.json(filteredTeams);
    }

    async teamsAwayForResult(req, res) {
        const { championship_id, user_id } = req.params;

        // Busque todas as classificações que correspondem ao championship_id
        const classifications = await Classification.findAll({
            attributes: [],
            where: { championship_id, check: true },
            include: [{ model: Team, as: 'team' }],
        });

        // Extraia os IDs dos times nas classificações
        const teamIdsInClassifications = classifications.map(
            (classification) => classification.team.id
        );

        // Busque todos os times que não pertencem ao usuário com o user_id recebido
        const teams = await Team.findAll({
            where: {
                id: {
                    [Op.in]: teamIdsInClassifications, // Filtra times que estão nas classificações
                },
                user_id: {
                    [Op.not]: user_id, // Filtra times que não têm o mesmo user_id
                },
                check: true, // Certifique-se de que check seja verdadeiro
            },
        });

        return res.json(teams);
    }

    async classificationForTeams(req, res) {
        const { teams_ids } = req.body;

        try {
            // Consulta a tabela de Classification para encontrar os championship_id
            const classificationsSearch = await Classification.findAll({
                where: {
                    team_id: teams_ids, // Procura pelos team_id no array
                },
                attributes: ['championship_id'], // Seleciona apenas o championship_id
                raw: true, // Retorna os resultados como objetos JS em vez de modelos Sequelize
            });

            // Extrai os championship_id dos resultados
            const championshipIdsFound = classificationsSearch.map(
                (item) => item.championship_id
            );
            // Usando forEach para iterar sobre os championshipIdsFound
            const classifications = [];
            await Promise.all(
                championshipIdsFound.map(async (championshipId) => {
                    try {
                        const classificationTable =
                            await Classification.findAll({
                                where: { championship_id: championshipId },
                                include: [
                                    {
                                        model: Team,
                                        attributes: ['team'],
                                        as: 'team',
                                    },
                                    {
                                        model: Championship,
                                        attributes: ['name'],
                                        as: 'championship',
                                    },
                                ],
                                order: [
                                    ['points', 'DESC'], // Ordena por 'points' em ordem decrescente
                                    ['wins', 'DESC'],
                                    ['goals_difference', 'DESC'], // Em caso de empate nos pontos, ordena por 'goals_difference'
                                    ['goals_pro', 'DESC'],
                                ],
                            });

                        classifications.push(classificationTable);
                    } catch (error) {
                        console.error(
                            `Erro ao buscar classificação para championship_id: ${championshipId}`,
                            error
                        );
                    }
                })
            );

            return res.json(classifications);
        } catch (error) {
            return res
                .status(500)
                .json({ error: 'Erro ao buscar as classificações.' });
        }
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            championship_id: Yup.number().required(),
            team_id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        const existingTeams = await Classification.findOne({
            where: {
                championship_id: req.body.championship_id,
                team_id: req.body.team_id,
            },
        });

        if (existingTeams) {
            return res
                .status(400)
                .json({ error: 'Time já cadastrado neste campeonato. ' });
        }

        const team_championship = await Classification.create(req.body);
        return res.status(200).json(team_championship);
    }

    async update(req, res) {
        const { id } = req.params;

        const team = await Classification.findByPk(id);

        if (!team) {
            return res.status(400).json({ error: 'Time não existe. ' });
        }

        await team.update(req.body);

        return res.json(team);
    }

    async checkChange(req, res) {
        const { id } = req.body;
        const classification = await Classification.findByPk(id);

        if (!classification) {
            return res.status(400).json({
                error: 'Time não existe na tabela de classificação. ',
            });
        }
        classification.check = !classification.check;
        await classification.save();
        return res.json(classification);
    }

    async searchById(req, res) {
        const { id } = req.params;

        const classification = await Classification.findByPk(id);

        if (!classification) {
            return res
                .status(400)
                .json({ error: 'Classification não existe. ' });
        }

        return res.json(classification);
    }

    async delete(req, res) {
        const { id } = req.params;

        const classification = await Classification.findByPk(id);

        if (!classification) {
            return res.status(400).json({ error: 'Tarefa não existe. ' });
        }

        await classification.destroy();
        return res.status(200).send();
    }
}

export default new ClassificationController();
