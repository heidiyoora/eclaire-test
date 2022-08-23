module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 3333),
      database: env('DATABASE_NAME', 'strapi_development'),
      user: env('DATABASE_USERNAME', 'heidikim'),
      password: env('DATABASE_PASSWORD', 'heidi123'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
