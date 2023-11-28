/** @type_id {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert(
            'categories',
            [
                {
                    name: 'Salário',
                    type_id: 1,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Renda Extra',
                    type_id: 1,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Investimentos',
                    type_id: 1,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Outros',
                    type_id: 1,
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
