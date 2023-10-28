/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert(
            'teams',
            [
                {
                    team: 'maquinaTricolor',
                    mode_id: 1,
                    user_id: 999,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('teams', null, {});
    },
};
