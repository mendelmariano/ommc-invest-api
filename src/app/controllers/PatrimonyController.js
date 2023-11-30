// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';

import { Op } from 'sequelize';
import Patrimony from '../models/Patrimony';
import User from '../models/User';
import Category from '../models/Category';
import Type from '../models/Type';

class PatrimonyController {
    async index(req, res) {
        try {
            const patrimonys = await Patrimony.findAll({
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: Type,
                        as: 'type',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email'],
                    },
                ],
                where: { user_id: req.userId },
                order: [
                    ['name', 'ASC'],
                    ['data', 'DESC'],
                ],
            });

            const latestPatrimonysMap = new Map();

            patrimonys.forEach((patrimony) => {
                const key = `${patrimony.name}-${patrimony.user_id}`;
                if (
                    !latestPatrimonysMap.has(key) ||
                    patrimony.data > latestPatrimonysMap.get(key).data
                ) {
                    latestPatrimonysMap.set(key, patrimony);
                }
            });

            const uniquePatrimonys = Array.from(latestPatrimonysMap.values());
            // Filtra apenas os patrimônios com status 1
            const filteredPatrimonys = uniquePatrimonys.filter(
                (patrimony) => patrimony.status === 1
            );

            return res.json(filteredPatrimonys);
        } catch (error) {
            console.error('Error in index method:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async patrimonyForPeriod(req, res) {
        try {
            const { startDate, endDate } = req.body.periodo || {};

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
            } else {
                // Se pelo menos uma das datas não for nula, verifica e ajusta conforme necessário
                if (startDate) {
                    req.body.periodo.startDate = new Date(
                        endDate
                    ).toISOString();
                }

                if (endDate) {
                    req.body.periodo.endDate = new Date(
                        startDate
                    ).toISOString();
                }
            }

            const dateFilter = {};

            if (endDate) {
                dateFilter.data = {
                    [Op.lte]: new Date(endDate),
                };
            }

            const patrimonys = await Patrimony.findAll({
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: Type,
                        as: 'type',
                        attributes: ['id', 'name'],
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email'],
                    },
                ],
                where: { user_id: req.userId, ...dateFilter },
                order: [
                    ['name', 'ASC'],
                    ['data', 'DESC'],
                ],
            });

            const latestPatrimonysMap = new Map();

            patrimonys.forEach((patrimony) => {
                const key = `${patrimony.name}-${patrimony.user_id}`;
                if (
                    !latestPatrimonysMap.has(key) ||
                    patrimony.data > latestPatrimonysMap.get(key).data
                ) {
                    latestPatrimonysMap.set(key, patrimony);
                }
            });

            const uniquePatrimonys = Array.from(latestPatrimonysMap.values());
            // Filtra apenas os patrimônios com status 1
            const filteredPatrimonys = uniquePatrimonys.filter(
                (patrimony) => patrimony.status === 1
            );

            return res.json(filteredPatrimonys);
        } catch (error) {
            console.error('Error in patrimonyForPeriod method:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async indexStart(req, res) {
        const patrimonys = await Patrimony.findAll({
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
            where: { type_id: req.params.type_id },
        });

        return res.json(patrimonys);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            description: Yup.string(),
            price: Yup.string(), // Ou Yup.number() se desejar validar como número
            data: Yup.date().required(),
            type_id: Yup.number().required(),
            status: Yup.number().required(),
            category_id: Yup.number().required(),
            user_id: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        req.body.user_id = req.userId;

        const { id } = await Patrimony.create(req.body);

        const patrimonyCreated = await Patrimony.findOne({
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

        return res.json(patrimonyCreated);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            price: Yup.string(), // Ou Yup.number() se desejar validar como número
            type_id: Yup.number().required(),
            status: Yup.number().required(),
            category_id: Yup.number().required(),
            user_id: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        const patrimony = await Patrimony.findByPk(req.params.id);

        // Verifica se o email já existe na base de dados

        const { id } = await patrimony.update(req.body);
        const patrimonyUpdated = await Patrimony.findOne({
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

        return res.json(patrimonyUpdated);
    }

    async createDuplicatePart(req, res) {
        const originalPatrimony = await Patrimony.findByPk(req.params.id);

        if (!originalPatrimony) {
            return res.status(404).json({ error: 'Patrimônio não encontrado' });
        }

        // Cria um novo registro com os valores atualizados
        const newPatrimony = await Patrimony.create({
            ...req.body,
            id: null,
            data: req.body.data || originalPatrimony.data, // Use a nova data se fornecida, senão mantenha a original
            price: req.body.price || originalPatrimony.price, // Use o novo preço se fornecido, senão mantenha o original
        });

        const patrimonyCreated = await Patrimony.findOne({
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                },
                {
                    model: Type,
                    as: 'type',
                    attributes: ['id', 'name'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email'],
                },
            ],
            where: { id: newPatrimony.id },
        });

        return res.json(patrimonyCreated);
    }

    async searchById(req, res) {
        const { id } = req.params;

        const patrimony = await Patrimony.findByPk(id);

        if (!patrimony) {
            return res.status(400).json({ error: 'Perfil não existe. ' });
        }

        return res.json(patrimony);
    }

    async searchUsersForId(req, res) {
        const { id } = req.params;

        const patrimony = await Patrimony.findOne({
            where: { id },
            include: User,
        });

        if (!patrimony) {
            return res.status(400).json({ error: 'Perfil não existe. ' });
        }

        return res.json(patrimony);
    }

    async delete(req, res) {
        const { id } = req.params;

        const patrimony = await Patrimony.findByPk(id);

        if (!patrimony) {
            return res.status(400).json({ error: 'Patrimonio não existe. ' });
        }

        await patrimony.destroy();
        return res.status(200).send();
    }

    async desactive(req, res) {
        const { id } = req.params;

        const patrimony = await Patrimony.findByPk(id);

        if (!patrimony) {
            return res.status(400).json({ error: 'Patrimonio não existe. ' });
        }

        await patrimony.update({ status: 0, data: new Date() });
        return res.status(200).send();
    }
}

export default new PatrimonyController();
