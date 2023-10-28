// eslint-disable-next-line import/no-extraneous-dependencies
import Sequelize, { Model } from 'sequelize';

class Team extends Model {
    static init(sequelize) {
        super.init(
            {
                team: Sequelize.STRING,
                check: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            target: 'id',
            as: 'user',
        });
        this.belongsTo(models.Mode, {
            foreignKey: 'mode_id',
            target: 'id',
            as: 'mode',
        });
    }
}

export default Team;
