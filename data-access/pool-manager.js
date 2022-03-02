const mssql = require('mssql')
const pools = new Map()

const set = ({ name, config }) => {
    if (!name || !config) {
        throw new Error(`Missing configuration details`)
    }

    const pool = new mssql.ConnectionPool(config)
    const close = pool.close.bind(pool)
    pool.close = (...args) => {
        pools.delete(name)
        return close(...args)
    }
    pools.set(name, pool)
}

const get = (options) => {
    if (!pools.has(options.name)) {
        set(options)
    }
    return pools.get(options.name)
}

const close = async (name) => {
    const pool = pools.get(name)
    if (!pool) {
        throw Error(`Pool ${name} does not exist`)
    }
    await pool.close()
}

const closeAll = async () => {
    const promises = Array.from(pools.values()).map(pool => pool.close())
    await Promise.all(promises)
}

module.exports = {
    get,
    close,
    closeAll
};