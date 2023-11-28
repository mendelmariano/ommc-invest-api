// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';

import Type from '../models/Type';
import Movement from '../models/Movement';

class TypeController {
    async index(req, res) {
        const types = await Type.findAll();

        return res.json(types);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
        });

        const typeExist = await Type.findOne({
            where: { name: req.body.name },
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        if (typeExist) {
            return res.status(400).json({ error: 'Tipo já existe. ' });
        }

        const { id, name } = await Type.create(req.body);

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

        const typeSelected = await Type.findByPk(req.id);

        // Verifica se o email já existe na base de dados

        const typeExist = await Type.findOne({
            where: { name: req.body.name, type: req.body.type },
        });

        if (typeExist) {
            return res.status(400).json({ error: 'Tipo já existe. ' });
        }

        const { id, name, type } = await typeSelected.update(req.body);
        return res.json({
            id,
            name,
            type,
        });
    }

    async searchById(req, res) {
        const { id } = req.params;

        const type = await Type.findByPk(id);

        if (!type) {
            return res.status(400).json({ error: 'Tipo não existe. ' });
        }

        return res.json(type);
    }

    async searchCategoriesForId(req, res) {
        const { id } = req.params;

        const type = await Type.findOne({
            where: { id },
            include: Movement,
        });

        if (!type) {
            return res.status(400).json({ error: 'Tipo não existe. ' });
        }

        return res.json(type);
    }

    async delete(req, res) {
        const { type_id } = req.params;

        const type = await Type.findByPk(type_id);

        if (!type) {
            return res.status(400).json({ error: 'Tipo não existe. ' });
        }

        await type.destroy();
        return res.status(200).send();
    }
}

export default new TypeController();
