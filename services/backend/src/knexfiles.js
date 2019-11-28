module.exports = {

    development: {

        //migrations: { tableName: 'knex_migrations' },
        //seeds: { tableName: './seeds' },

        client: 'pg',
        connection: {

            host: 'postgres',

            user: 'postgres',
            password: 'postgres',

            database: 'postgres',
            charset: 'utf8',

        }

    }

};