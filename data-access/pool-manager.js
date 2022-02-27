const mssql = require('mssql')
const pools = new Map()

const get = (name) => {
    if (!pools.has(name)) {
        throw new Error(`Pool ${name} does not exist`)
    }
    return pools.get(name)
}

const set = (name, config) => {
    if (!name || !config) {
        throw new Error(`Missing configuration details`)
    }

    const pool = new mssql.ConnectionPool(config)
    const close = pool.close.bind()
    pool.close = (...args) => {
        pools.delete(name)
        return close(...args)
    }
    pools.set(name, pool)
}

const close = async (name) => {
    const pool = pools.get(name)
    if (!pool) {
        throw new Error(`Pool ${name} does not exist`)
    }
    await pool.close()
}

const closeAll = async () => {
    const promises = Array.from(pools.values()).map(pool => pool.close())
    await Promise.all(promises)
}

module.exports = {
    pools,
	get,
	set,
	close,
	closeAll
};