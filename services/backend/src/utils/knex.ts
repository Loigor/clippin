import * as Knex from 'knex';
export default Knex({
    client: 'pg',
    connection: {

        host: 'postgres',

        user: 'postgres',
        password: 'postgres',

        database: 'postgres',
        charset: 'utf8',

    }
})