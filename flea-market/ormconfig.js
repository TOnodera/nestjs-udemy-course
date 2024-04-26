module.exports = {
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    autoLoadEntities: true,
    entities: ['dist/entities/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    cli: {
        entitiesDir: "../entities",
        migrationsDir: "../migrations"
    }
};