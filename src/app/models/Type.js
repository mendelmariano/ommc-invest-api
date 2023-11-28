// eslint-disable-next-line import/no-extraneous-dependencies
import Sequelize, { Model } from 'sequelize';

class Type extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
        return this;
    }

    static associate(models) {
        this.hasMany(models.Category);
        this.hasMany(models.Movement);
        this.hasMany(models.Patrimony);
    }
}

export default Type;
