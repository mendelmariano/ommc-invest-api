// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import * as admin from 'firebase-admin';
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

    async storeGoogle(req, res) {
        const { idToken } = req.params;

        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);

            const { email } = decodedToken;

            // Verificando se esse email existe
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(401).json({ error: 'Usuário não existe. ' });
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
        } catch (error) {
            // O token é inválido ou ocorreu um erro na verificação.
            console.error('Erro na verificação do token:', error);
            return res.status(401).json({ message: 'Token inválido' });
        }
    }
}

export default new SessionController();
