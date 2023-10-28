// eslint-disable-next-line import/no-extraneous-dependencies
import Sequelize, { Model } from 'sequelize';

class Mode extends Model {
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
        this.hasMany(models.Team);
        this.hasMany(models.Championship);
    }
}

export default Mode;
