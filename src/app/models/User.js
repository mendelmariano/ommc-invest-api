// eslint-disable-next-line import/no-extraneous-dependencies
import Sequelize, { Model } from 'sequelize';
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcryptjs';

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                uuid: Sequelize.STRING,
                whatsapp: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
            },
            {
                sequelize,
                timestamps: true,
            }
        );

        this.addHook('beforeSave', async (user) => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 8);
            }
        });

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Profile, {
            foreignKey: 'profile_id',
            targetKey: 'id',
            as: 'profile',
        });

        this.hasMany(models.Movement);
        this.hasMany(models.Patrimony);
    }

    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;
