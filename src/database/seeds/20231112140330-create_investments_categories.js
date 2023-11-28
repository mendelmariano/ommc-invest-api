/** @type_id {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert(
            'categories',
            [
                {
                    name: 'CDI',
                    type_id: 3,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'CDB',
                    type_id: 3,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'IPCA+',
                    type_id: 3,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Criptomoedas',
                    type_id: 3,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Outros',
                    type_id: 3,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('categories', null, {});
    },
};
