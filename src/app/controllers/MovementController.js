// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';

import { Op } from 'sequelize';
import Movement from '../models/Movement';
import User from '../models/User';
import Category from '../models/Category';
import Type from '../models/Type';

class MovementController {
    async index(req, res) {
        const movements = await Movement.findAll({
            include: [
                {
                    model: Category,
                    as: 'category', // Defina o alias corretamente aqui
                    attributes: ['id', 'name'],
                },
                {
                    model: Type,
                    as: 'type', // Defina o alias corretamente aqui
                    attributes: ['id', 'name'],
                },
                {
                    model: User,
                    as: 'user', // Defina o alias corretamente aqui
                    attributes: ['id', 'name', 'email'],
                },
            ],
            where: [{ user_id: req.userId }],
        });

        return res.json(movements);
    }

    async indexStart(req, res) {
        const movements = await Movement.findAll({
            include: [
                {
                    model: Category,
                    as: 'category', // Defina o alias corretamente aqui
                    attributes: ['id', 'name'],
                },
                {
                    model: Type,
                    as: 'type', // Defina o alias corretamente aqui
                    attributes: ['id', 'name'],
                },
                {
                    model: User,
                    as: 'user', // Defina o alias corretamente aqui
                    attributes: ['id', 'name', 'email'],
                },
            ],
            where: { type_id: req.params.type_id, user_id: req.userId },
        });

        return res.json(movements);
    }

    async indexStartPeriod(req, res) {
        let { startDate, endDate } = req.body.periodo || {};

        if (!startDate || !endDate) {
            // Configura automaticamente para o período do mês atual
            const currentDate = new Date();
            const firstDayOfMonth = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                1
            );
            const lastDayOfMonth = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                0
            );

            req.body.periodo = {
                startDate: firstDayOfMonth.toISOString(),
                endDate: lastDayOfMonth.toISOString(),
            };

            startDate = req.body.periodo.startDate;
            endDate = req.body.periodo.endDate;
        } else {
            // Se pelo menos uma das datas não for nula, verifica e ajusta conforme necessário
            if (startDate) {
                req.body.periodo.startDate = new Date(endDate).toISOString();
            }

            if (endDate) {
                req.body.periodo.endDate = new Date(startDate).toISOString();
            }
        }

        const dateFilter = {};

        if ((startDate && endDate) || (!startDate && !endDate)) {
            dateFilter.data = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        } else if (startDate) {
            dateFilter.data = {
                [Op.gte]: new Date(startDate),
            };
        } else if (endDate) {
            dateFilter.data = {
                [Op.lte]: new Date(endDate),
            };
        }

        const movements = await Movement.findAll({
            include: [
                {
                    model: Category,
                    as: 'category', // Defina o alias corretamente aqui
                    attributes: ['id', 'name'],
                },
                {
                    model: Type,
                    as: 'type', // Defina o alias corretamente aqui
                    attributes: ['id', 'name'],
                },
                {
                    model: User,
                    as: 'user', // Defina o alias corretamente aqui
                    attributes: ['id', 'name', 'email'],
                },
            ],
            where: {
                type_id: req.params.type_id,
                user_id: req.userId,
                ...dateFilter,
            },
        });

        return res.json(movements);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            description: Yup.string(),
            price: Yup.number(), // Ou Yup.number() se desejar validar como número
            data: Yup.date().required(),
            type_id: Yup.number().required(),
            category_id: Yup.number().required(),
            user_id: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        req.body.user_id = req.userId;

        const { id } = await Movement.create(req.body);

        const movement = await Movement.findOne({
            include: [
                {
                    model: Category,
                    as: 'category', // Defina o alias corretamente aqui
                    attributes: ['id', 'name'],
                },
                {
                    model: Type,
                    as: 'type', // Defina o alias corretamente aqui
                    attributes: ['id', 'name'],
                },
                {
                    model: User,
                    as: 'user', // Defina o alias corretamente aqui
                    attributes: ['id', 'name', 'email'],
                },
            ],
            where: { id },
        });

        return res.json(movement);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            price: Yup.number(), // Ou Yup.number() se desejar validar como número
            data: Yup.date(),
            type_id: Yup.number(),
            category_id: Yup.number(),
            user_id: Yup.string(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        const movement = await Movement.findByPk(req.params.id);

        // Verifica se o email já existe na base de dados

        const { id } = await movement.update(req.body);
        const movementNew = await Movement.findOne({
            include: [
                {
                    model: Category,
                    as: 'category', // Defina o alias corretamente aqui
                    attributes: ['id', 'name'],
                },
                {
                    model: Type,
                    as: 'type', // Defina o alias corretamente aqui
                    attributes: ['id', 'name'],
                },
                {
                    model: User,
                    as: 'user', // Defina o alias corretamente aqui
                    attributes: ['id', 'name', 'email'],
                },
            ],
            where: { id },
        });

        return res.json(movementNew);
    }

    async searchById(req, res) {
        const { id } = req.params;

        const movement = await Movement.findByPk(id);

        if (!movement) {
            return res.status(400).json({ error: 'Movimentação não existe. ' });
        }

        return res.json(movement);
    }

    async searchUsersForId(req, res) {
        const { id } = req.params;

        const movement = await Movement.findOne({
            where: { id },
            include: User,
        });

        if (!movement) {
            return res.status(400).json({ error: 'Movimentação não existe. ' });
        }

        return res.json(movement);
    }

    async delete(req, res) {
        const { id } = req.params;

        const movement = await Movement.findByPk(id);

        if (!movement) {
            return res.status(400).json({ error: 'Movimentação não existe. ' });
        }

        await movement.destroy();
        return res.status(200).send();
    }
}

export default new MovementController();
