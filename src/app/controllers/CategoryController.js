// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';

import Category from '../models/Category';
import Movement from '../models/Movement';

class CategoryController {
    async index(req, res) {
        const categories = await Category.findAll();

        return res.json(categories);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            type: Yup.string().required(),
        });

        const categoryExist = await Category.findOne({
            where: { name: req.body.name, type: req.body.type },
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        if (categoryExist) {
            return res.status(400).json({ error: 'Categoria já existe. ' });
        }

        const { id, name, type } = await Category.create(req.body);

        return res.json({
            id,
            name,
            type,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            type: Yup.string(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        const category = await Category.findByPk(req.categoryId);

        // Verifica se o email já existe na base de dados

        const categoryExist = await Category.findOne({
            where: { name: req.body.name, type: req.body.type },
        });

        if (categoryExist) {
            return res.status(400).json({ error: 'Categoria já existe. ' });
        }

        const { id, name, type } = await category.update(req.body);
        return res.json({
            id,
            name,
            type,
        });
    }

    async searchById(req, res) {
        const { id } = req.params;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(400).json({ error: 'Categoria não existe. ' });
        }

        return res.json(category);
    }

    async searchCategoriesForId(req, res) {
        const { id } = req.params;

        const category = await Category.findOne({
            where: { id },
            include: Movement,
        });

        if (!category) {
            return res.status(400).json({ error: 'Categoria não existe. ' });
        }

        return res.json(category);
    }

    async delete(req, res) {
        const { category_id } = req.params;

        const category = await Category.findByPk(category_id);

        if (!category) {
            return res.status(400).json({ error: 'Categoria não existe. ' });
        }

        await category.destroy();
        return res.status(200).send();
    }
}

export default new CategoryController();
