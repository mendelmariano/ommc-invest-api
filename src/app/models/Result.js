// eslint-disable-next-line import/no-extraneous-dependencies
import Sequelize, { Model } from 'sequelize';

class Result extends Model {
    static init(sequelize) {
        super.init(
            {
                home_goals: Sequelize.INTEGER,
                away_goals: Sequelize.INTEGER,
                owner: Sequelize.INTEGER,
                status: Sequelize.NUMBER,
                motivo_cancelamento: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Championship, {
            foreignKey: 'championship_id',
            as: 'championship',
        });
        this.belongsTo(models.Team, {
            foreignKey: 'home_team',
            targetKey: 'id',
            as: 'home',
        });
        this.belongsTo(models.Team, {
            foreignKey: 'away_team',
            targetKey: 'id',
            as: 'away',
        });
    }
}

export default Result;
