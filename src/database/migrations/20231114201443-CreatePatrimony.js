/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('patrimonies', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            type_id: {
                type: Sequelize.INTEGER,
                references: { model: 'types', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false,
            },
            price: {
                type: Sequelize.DECIMAL(10, 2), // Representa um número decimal com 10 dígitos totais e 2 dígitos decimais
                allowNull: true,
            },
            data: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            category_id: {
                type: Sequelize.INTEGER,
                references: { model: 'categories', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false,
            },
            user_id: {
                type: Sequelize.UUID,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false,
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('patrimonies');
    },
};
