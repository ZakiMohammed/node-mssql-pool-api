const options = {
    encrypt: false,
    enableArithAbort: false
}

const getDataConfig = () => ({
    uk: {
        name: process.env.SQL_UK_NAME,
        config: {
            driver: process.env.SQL_UK_DRIVER,
            server: process.env.SQL_UK_SERVER,
            database: process.env.SQL_UK_DATABASE,
            user: process.env.SQL_UK_UID,
            password: process.env.SQL_UK_PWD,
            options: options
        }
    },
    siberia: {
        name: process.env.SQL_SIBERIA_NAME,
        config: {
            driver: process.env.SQL_SIBERIA_DRIVER,
            server: process.env.SQL_SIBERIA_SERVER,
            database: process.env.SQL_SIBERIA_DATABASE,
            user: process.env.SQL_SIBERIA_UID,
            password: process.env.SQL_SIBERIA_PWD,
            options: options
        }
    },
})

module.exports = getDataConfig