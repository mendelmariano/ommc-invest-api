// eslint-disable-next-line import/no-extraneous-dependencies
import Sequelize, { Model } from 'sequelize';

class Movement extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                description: Sequelize.STRING,
                data: Sequelize.DATE,
                category_id: Sequelize.NUMBER,
                price: Sequelize.NUMBER,
            },
            {
                sequelize,
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Category, {
            foreignKey: 'category_id',
            targetKey: 'id',
            as: 'category',
        });

        this.belongsTo(models.Type, {
            foreignKey: 'type_id',
            targetKey: 'id',
            as: 'type',
        });

        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            targetKey: 'id',
            as: 'user',
        });
    }
}

export default Movement;
