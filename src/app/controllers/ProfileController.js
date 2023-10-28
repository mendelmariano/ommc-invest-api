// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';

import Profile from '../models/Profile';
import User from '../models/User';

class ProfileController {
    async index(req, res) {
        const profiles = await Profile.findAll();

        return res.json(profiles);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
        });

        const profileExist = await Profile.findOne({
            where: { name: req.body.name },
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        if (profileExist) {
            return res.status(400).json({ error: 'Perfil já existe. ' });
        }

        const { id, name } = await Profile.create(req.body);

        return res.json({
            id,
            name,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        const profile = await Profile.findByPk(req.profileId);

        // Verifica se o email já existe na base de dados

        const profileExist = await Profile.findOne({
            where: { name: req.body.name },
        });

        if (profileExist) {
            return res.status(400).json({ error: 'Perfil já existe. ' });
        }

        const { id, name } = await profile.update(req.body);
        return res.json({
            id,
            name,
        });
    }

    async searchById(req, res) {
        const { id } = req.params;

        const profile = await Profile.findByPk(id);

        if (!profile) {
            return res.status(400).json({ error: 'Perfil não existe. ' });
        }

        return res.json(profile);
    }

    async searchUsersForId(req, res) {
        const { id } = req.params;

        const profile = await Profile.findOne({
            where: { id },
            include: User,
        });

        if (!profile) {
            return res.status(400).json({ error: 'Perfil não existe. ' });
        }

        return res.json(profile);
    }

    async delete(req, res) {
        const { profile_id } = req.params;

        const profile = await Profile.findByPk(profile_id);

        if (!profile) {
            return res.status(400).json({ error: 'Perfil não existe. ' });
        }

        await profile.destroy();
        return res.status(200).send();
    }
}

export default new ProfileController();
