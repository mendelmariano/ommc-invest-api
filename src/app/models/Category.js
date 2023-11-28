import Sequelize, { Model } from 'sequelize';

class Category extends Model {
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
        this.hasMany(models.Movement);
        this.hasMany(models.Patrimony);
        this.belongsTo(models.Type, {
            foreignKey: 'type_id',
            targetKey: 'id',
            as: 'type',
        });
    }
}

export default Category;
