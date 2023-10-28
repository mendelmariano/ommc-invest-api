// eslint-disable-next-line import/no-extraneous-dependencies
import * as Yup from 'yup';
import Mode from '../models/Mode';

class ModeController {
    async index(req, res) {
        const modes = await Mode.findAll();

        return res.json(modes);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
        });

        const modeExist = await Mode.findOne({
            where: { name: req.body.name },
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'falha na validação' });
        }

        if (modeExist) {
            return res.status(400).json({ error: 'Modo de jogo já existe. ' });
        }

        const { id, name } = await Mode.create(req.body);

        return res.json({
            id,
            name,
        });
    }

    async update(req, res) {
        const { id } = req.params;

        const mode = await Mode.findByPk(id);

        if (!mode) {
            return res.status(400).json({ error: 'Time não existe. ' });
        }

        await mode.update(req.body);

        return res.json(mode);
    }

    async searchById(req, res) {
        const { id } = req.params;

        const mode = await Mode.findByPk(id);

        if (!mode) {
            return res.status(400).json({ error: 'Time não existe. ' });
        }

        return res.json(mode);
    }

    async delete(req, res) {
        const { id } = req.params;

        const mode = await Mode.findByPk(id);

        if (!mode) {
            return res.status(400).json({ error: 'Modo de jogo não existe. ' });
        }

        await mode.destroy();
        return res.status(200).send();
    }
}

export default new ModeController();
