/** @name {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert(
            'types',
            [
                {
                    name: 'Entry',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Out',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Investment',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Patrimony',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('type', null, {});
    },
};
