import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import Profile from '../app/models/Profile';
import Category from '../app/models/Category';
import Movement from '../app/models/Movement';
import Type from '../app/models/Type';
import Patrimony from '../app/models/Patrimony';

const models = [Profile, User, Category, Type, Movement, Patrimony];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models
            .map((model) => model.init(this.connection))
            .map(
                (model) =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
