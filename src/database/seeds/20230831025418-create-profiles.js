/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert(
            'profiles',
            [
                {
                    name: 'Registred',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Administrator',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('profiles', null, {});
    },
};
