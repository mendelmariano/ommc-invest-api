/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert(
            'users',
            [
                {
                    id: 999,
                    name: 'Administator',
                    email: 'mendelbsi@gmail.com',
                    whatsapp: '62992111954',
                    password_hash:
                        '$2a$08$6cSNgbcNdX.QNC00JeT6tuWAUd8fjL81D6n3FI8pnGZz1a0e1nGB2',
                    profile_id: 2,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('users', null, {});
    },
};
