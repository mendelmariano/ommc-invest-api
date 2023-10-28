// eslint-disable-next-line import/no-extraneous-dependencies
import Sequelize, { Model } from 'sequelize';

class Classification extends Model {
    static init(sequelize) {
        super.init(
            {
                points: Sequelize.INTEGER,
                goals_pro: Sequelize.INTEGER,
                goals_conceded: Sequelize.INTEGER,
                goals_difference: Sequelize.INTEGER,
                wins: Sequelize.INTEGER,
                loses: Sequelize.INTEGER,
                ties: Sequelize.INTEGER,
                check: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Team, {
            foreignKey: 'team_id',
            targetKey: 'id',
            as: 'team',
        });
        this.belongsTo(models.Championship, {
            foreignKey: 'championship_id',
            targetKey: 'id',
            as: 'championship',
        });
    }
}

export default Classification;
