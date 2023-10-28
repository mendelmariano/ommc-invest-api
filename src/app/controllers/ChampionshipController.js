// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';
import Championship from '../models/Championship';
import Mode from '../models/Mode';
import Classification from '../models/Classification';
import Team from '../models/Team';

const { Op } = require('sequelize');

class ChampionshipController {
    async index(req, res) {
        const championships = await Championship.findAll({
            include: {
                model: Mode,
                as: 'mode', // Defina o alias corretamente aqui
            },
        });

        return res.json(championships);
    }

    async forCheck(req, res) {
        const { check } = req.body;
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
            where: { check },
        });

        return res.json(classifications);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            mode_id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        const { name, mode_id } = req.body;

        const championshipStore = await Championship.create({
            name,
            mode_id,
            active: true,
        });

        const championship = await Championship.findByPk(championshipStore.id, {
            include: {
                model: Mode,
                as: 'mode', // Certifique-se de que o alias esteja definido corretamente
            },
        });

        return res.json(championship);
    }

    async update(req, res) {
        const { id } = req.params;

        const championship = await Championship.findByPk(id, {
            include: {
                model: Mode,
                as: 'mode',
            },
        });

        if (!championship) {
            return res.status(400).json({ error: 'Time não existe. ' });
        }

        await championship.update(req.body);

        const championshipUp = await Championship.findByPk(id, {
            include: {
                model: Mode,
                as: 'mode',
            },
        });

        return res.json(championshipUp);
    }

    async searchById(req, res) {
        const { id } = req.params;

        const championship = await Championship.findByPk(id);

        if (!championship) {
            return res.status(400).json({ error: 'Time não existe. ' });
        }

        return res.json(championship);
    }

    async delete(req, res) {
        const { id } = req.params;

        const championship = await Championship.findByPk(id);

        if (!championship) {
            return res.status(400).json({ error: 'Tarefa não existe. ' });
        }

        await championship.destroy();
        return res.status(200).send();
    }

    async participate(req, res) {
        const { id } = req.params;
        const { team_id } = req.body;

        const classification = await Classification.findOne({
            where: { championship_id: id, team_id },
        });

        if (classification) {
            return res
                .status(400)
                .json({ error: 'Você já participa deste campeonato. ' });
        }

        const classificationCreate = await Classification.create({
            team_id,
            championship_id: id,
        });

        return res.json(classificationCreate);
    }

    async participateCheck(req, res) {
        const { user_id } = req.params;

        try {
            // Encontre todos os times associados ao usuário
            const myTeams = await Team.findAll({
                where: { user_id },
            });

            // Crie um array para armazenar os times encontrados na tabela Classification

            const teamsInClassification = await Classification.findAll({
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
                where: {
                    team_id: {
                        [Op.in]: myTeams.map((team) => team.id),
                    },
                },
            });

            return res.json(teamsInClassification);
        } catch (error) {
            console.error('Erro:', error);
            return res
                .status(500)
                .json({ error: 'Ocorreu um erro ao buscar os times.' });
        }
    }
}

export default new ChampionshipController();
