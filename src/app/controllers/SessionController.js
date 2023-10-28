// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
    async store(req, res) {
        const { email, password } = req.body;

        // Verificando se esse email existe
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Usuário não existe. ' });
        }

        // Verificar se a senha não bate

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Senha incorreta. ' });
        }

        const { id, name, whatsapp } = user;

        return res.json({
            user: {
                id,
                name,
                email,
                whatsapp,
            },
            token: jwt.sign({ id, user }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
