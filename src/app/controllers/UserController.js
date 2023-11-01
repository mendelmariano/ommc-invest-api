// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';

import { Op } from 'sequelize';
import User from '../models/User';
import Profile from '../models/Profile';

class UserController {
    async index(req, res) {
        const { page, pageSize = 10 } = req.params;

        const offset = (page - 1) * pageSize;

        const users = await User.findAndCountAll({
            include: [
                {
                    model: Profile,
                    as: 'profile',
                    attributes: ['name', 'id'],
                },
            ],
            attributes: [
                'id',
                'name',
                'email',
                'whatsapp',
                'profile_id',
                'createdAt',
                'updatedAt',
            ],
            limit: pageSize,
            offset,
        });

        const totalPages = Math.ceil(users.count / pageSize);

        return res.json({
            currentPage: parseInt(page, 10),
            totalPages,
            totalCount: users.count,
            users: users.rows,
        });
    }

    async indexSearch(req, res) {
        const { page, pageSize = 10, search } = req.body;

        const offset = (page - 1) * pageSize;

        const whereClause = search
            ? {
                  [Op.or]: [
                      { name: { [Op.like]: `%${search}%` } },

                      { email: { [Op.like]: `%${search}%` } },

                      { '$profile.name$': { [Op.like]: `%${search}%` } },
                  ],
              }
            : {};

        try {
            const users = await User.findAndCountAll({
                include: [
                    {
                        model: Profile,
                        as: 'profile',
                        attributes: ['name'],
                    },
                ],
                attributes: [
                    'id',
                    'name',
                    'email',
                    'whatsapp',
                    'profile_id',
                    'createdAt',
                    'updatedAt',
                ],
                where: whereClause, // Aplica a lógica de busca dinâmica
                limit: pageSize,
                offset,
            });

            const totalPages = Math.ceil(users.count / pageSize);

            return res.json({
                currentPage: parseInt(page, 10),
                totalPages,
                totalCount: users.count,
                users: users.rows,
            });
        } catch (error) {
            // Trate qualquer erro que possa ocorrer durante a consulta ao banco de dados.
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            whatsapp: Yup.string(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            profile_id: Yup.number().required(),
        });

        const userExist = await User.findOne({
            where: { email: req.body.email },
        });

        const whatsappExist = await User.findOne({
            where: { whatsapp: req.body.whatsapp },
        });

        const profileExist = await Profile.findOne({
            where: { id: req.body.profile_id },
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        if (userExist) {
            return res.status(400).json({ error: 'Usuário já existe. ' });
        }

        if (whatsappExist) {
            return res.status(400).json({ error: 'Este contato já existe. ' });
        }

        if (!profileExist) {
            return res.status(400).json({ error: 'Perfil inválido. ' });
        }

        const { id, name, email, whatsapp, profile_id } = await User.create(
            req.body
        );

        return res.json({
            id,
            name,
            whatsapp,
            email,
            profile_id,
        });
    }

    async searchById(req, res) {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            include: [
                {
                    model: Profile,
                    as: 'profile',
                },
            ],
        });

        if (!user) {
            return res.status(400).json({ error: 'Usuário não existe. ' });
        }

        return res.json(user);
    }

    async update(req, res) {
        const { email, oldPassword, password, confirmPassword } = req.body;

        const user = await User.findByPk(req.userId);

        // Verifica se o email já existe na base de dados
        if (email && email !== user.email) {
            const userExist = await User.findOne({
                where: { email: req.body.email },
            });

            if (userExist) {
                return res.status(400).json({ error: 'Email já existe. ' });
            }
        }
        if (user.password_hash) {
            if (oldPassword && !(await user.checkPassword(oldPassword))) {
                return res.status(400).json({ error: 'Senha incorreta. ' });
            }
        }
        // Verifica se a propriedade oldPassword existe na requisição e se ela confere com a senha do usuário

        // Se password está definido, newPassword e confirmPassword também devem estar definidos
        if (password) {
            if (user.password_hash) {
                if (!oldPassword) {
                    return res.status(400).json({
                        error: 'A senha antiga é necessária para atualizar a senha. ',
                    });
                }
            }

            if (!confirmPassword) {
                return res.status(400).json({
                    error: 'O campo de confirmação de senha é obrigatório. ',
                });
            }

            if (password !== confirmPassword) {
                return res
                    .status(400)
                    .json({ error: 'As senhas não coincidem. ' });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    error: 'A nova senha deve ter pelo menos 6 caracteres. ',
                });
            }
        }

        const { id, name, whatsapp } = await user.update(req.body);
        return res.json({
            id,
            name,
            email,
            whatsapp,
        });
    }

    async updateGoogle(req, res) {
        const userExist = await User.findOne({
            where: { email: req.body.email },
        });

        // Verifica se o email já existe na base de dados
        if (!userExist) {
            const { id } = await User.create(req.body);
            const userCreated = await User.findOne({
                where: [{ id }],
                include: [
                    {
                        model: Profile,
                        as: 'profile',
                        attributes: ['name', 'id'],
                    },
                ],
                attributes: [
                    'id',
                    'name',
                    'email',
                    'whatsapp',
                    'profile_id',
                    'createdAt',
                    'updatedAt',
                ],
            });
            return res.status(200).json(userCreated);
        }

        const { id } = await userExist.update(req.body);
        const userEdited = await User.findOne({
            where: [{ id }],
            include: [
                {
                    model: Profile,
                    as: 'profile',
                    attributes: ['name', 'id'],
                },
            ],
            attributes: [
                'id',
                'name',
                'email',
                'whatsapp',
                'profile_id',
                'createdAt',
                'updatedAt',
            ],
        });
        return res.json(userEdited);
    }

    async updateSomeone(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            whatsapp: Yup.string(),
            password: Yup.string(),
            profile_id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        const { email } = req.body;

        const user = await User.findByPk(req.params.id);

        // Verifica se o email já existe na base de dados
        if (email !== user.email) {
            const userExist = await User.findOne({
                where: { email: req.body.email },
            });

            if (userExist) {
                return res.status(400).json({ error: 'Email já existe. ' });
            }
        }

        const { id } = await user.update(req.body);
        const userEdited = await User.findOne({
            where: [{ id }],
            include: [
                {
                    model: Profile,
                    as: 'profile',
                    attributes: ['name', 'id'],
                },
            ],
            attributes: [
                'id',
                'name',
                'email',
                'whatsapp',
                'profile_id',
                'createdAt',
                'updatedAt',
            ],
        });
        return res.json(userEdited);
    }

    async delete(req, res) {
        const { user_id } = req.params;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(400).json({ error: 'Usuário não existe. ' });
        }

        await user.destroy();
        return res.status(200).send();
    }
}

export default new UserController();
