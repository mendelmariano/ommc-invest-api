module.exports = {
    dialect: 'postgres',
    port: process.env.DB_PORT || '5432',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgresql',
    database: process.env.DB_DATABASE || 'ultimateprofifa',
    dialectOptions: {
        // Defina ssl apenas se DB_SSL for true
        ...(process.env.DB_SSL === 'true'
            ? {
                  ssl: {
                      ssl: true,
                      require: true,
                      rejectUnauthorized: false,
                  },
              }
            : {}),
    },
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};
