/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert(
            'modes',
            [
                {
                    name: 'Ultimate Team',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Pro Clubs',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('modes', null, {});
    },
};
