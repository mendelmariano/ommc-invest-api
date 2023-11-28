/** @type_id {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert(
            'categories',
            [
                {
                    name: 'Cartão de Crédito',
                    type_id: 2,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Moradia',
                    type_id: 2,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Alimentação',
                    type_id: 2,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Transporte',
                    type_id: 2,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Saúde',
                    type_id: 2,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Educação',
                    type_id: 2,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Lazer e Entretenimento',
                    type_id: 2,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Vestuário e Acessórios',
                    type_id: 2,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Outros',
                    type_id: 2,
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
