// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';
import Team from '../models/Team';

import Mode from '../models/Mode';
import User from '../models/User';

class TeamController {
    async index(req, res) {
        const teams = await Team.findAll({
            include: {
                model: Mode,
                as: 'mode', // Defina o alias corretamente aqui
            },
        });

        return res.json(teams);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            team: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        const { team, mode_id, check } = req.body;

        const teams = await Team.create({
            user_id: req.userId,
            team,
            mode_id,
            check,
        });

        return res.json(teams);
    }

    async update(req, res) {
        const { id } = req.params;

        const team = await Team.findByPk(id);

        if (!team) {
            return res.status(400).json({ error: 'Time não existe. ' });
        }

        await team.update(req.body);

        const teamUpdate = await Team.findByPk(id, {
            include: {
                model: Mode,
                as: 'mode', // Defina o alias corretamente aqui
            },
        });

        return res.json(teamUpdate);
    }

    async searchById(req, res) {
        const { id } = req.params;

        const team = await Team.findByPk(id, {
            include: [
                {
                    model: Mode,
                    as: 'mode', // Certifique-se de que o alias esteja definido corretamente
                },
                {
                    model: User,
                    as: 'user', // Certifique-se de que o alias esteja definido corretamente
                    attributes: ['id', 'email', 'name', 'whatsapp'],
                },
            ],
        });

        if (!team) {
            return res.status(400).json({ error: 'Time não existe. ' });
        }

        return res.json(team);
    }

    async findByUser(req, res) {
        const { id } = req.params;

        const teams = await Team.findAll({
            where: { user_id: id },
            include: {
                model: Mode,
                as: 'mode', // Defina o alias corretamente aqui
            },
        });

        return res.json(teams);
    }

    async findCheckedByUser(req, res) {
        const { id } = req.params;

        const teams = await Team.findAll({
            where: { user_id: id, check: true },
            include: {
                model: Mode,
                as: 'mode', // Defina o alias corretamente aqui
            },
        });

        return res.json(teams);
    }

    async delete(req, res) {
        const { id } = req.params;

        const team = await Team.findByPk(id);

        if (!team) {
            return res.status(400).json({ error: 'Tarefa não existe. ' });
        }

        await team.destroy();
        return res.status(200).send();
    }

    async updateCheck(req, res) {
        const { id } = req.params;

        const team = await Team.findByPk(id, {
            include: {
                model: Mode,
                as: 'mode', // Certifique-se de que o alias esteja definido corretamente
            },
        });

        if (!team) {
            return res.status(400).json({ error: 'Time não existe. ' });
        }

        // Define o campo 'check' como true
        team.check = !team.check;

        // Salva as mudanças no banco de dados
        await team.save();

        return res.json(team);
    }
}

export default new TeamController();
