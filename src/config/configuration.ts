export default () => ({
    app: {
        name: process.env.APP_NAME || 'Nest App',
        env: process.env.NODE_ENV || 'development',
        port: parseInt(process.env.PORT || '3000', 10),
        sessionSecret: process.env.SESSION_SECRET || 'defaultSecret',
        appKeySecret: process.env.APP_KEY_SECRET || '',

    },
    database: {
        url: process.env.DATABASE_URL,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        name: process.env.DB_NAME,
    },
});
