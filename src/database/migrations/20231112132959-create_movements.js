/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('movements', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('gen_random_uuid()'), // Gera automaticamente um UUID
                primaryKey: true,
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            data: {
                type: Sequelize.DATE,
                allowNull: false,
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
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('movements');
    },
};
