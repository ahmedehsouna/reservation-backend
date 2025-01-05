import knex from 'knex';

import knexfile from './knexfile';

// @ts-ignore
export default knex(knexfile.development);