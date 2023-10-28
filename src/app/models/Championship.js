// eslint-disable-next-line import/no-extraneous-dependencies
import Sequelize, { Model } from 'sequelize';

class Championship extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                active: Sequelize.BOOLEAN,
            },
            {
                sequelize,
                timestamps: true,
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Mode, {
            foreignKey: 'mode_id',
            target: 'id',
            as: 'mode',
        });
    }
}

export default Championship;
