const mssql = require('mssql')
const poolManager = require('./pool-manager')

const dataAccess = (poolName) => {
    let pool = poolManager.get(poolName)
    
    return {
        run: async function (name, command, inputs = [], outputs = []) {
            await this.connect();
            const request = pool.request();
            assignParams(request, inputs, outputs);
            return request[name](command);
        },
        connect: async () => {
            if (!pool) {
                pool = new mssql.ConnectionPool(poolConfig());
            }
            if (!pool.connected) {
                await pool.connect();
            }
        },
        query: async function (command, inputs = [], outputs = []) {
            return this.run('query', command, inputs, outputs);
        },
        queryEntity: async function (command, entity, outputs = []) {
            const inputs = fetchParams(entity);
            return this.run('query', command, inputs, outputs);
        },
        execute: async function (command, inputs = [], outputs = []) {
            return this.run('execute', command, inputs, outputs);
        },
        executeEntity: async function (command, entity, outputs = []) {
            const inputs = fetchParams(entity);
            return this.run('execute', command, inputs, outputs);
        }
    }
}

const fetchParams = entity => {
    const params = [];
    for (const key in entity) {
        if (entity.hasOwnProperty(key)) {
            const value = entity[key];
            params.push({
                name: key,
                value
            });
        }
    }
    return params;
};

const assignParams = (request, inputs, outputs) => {
    [inputs, outputs].forEach((params, index) => {
        const operation = index === 0 ? 'input' : 'output';
        params.forEach(param => {
            if (param.type) {
                request[operation](param.name, param.type, param.value);
            } else {
                request[operation](param.name, param.value);
            }
        });
    });
};

const generateTable = (columns, entities) => {
    const table = new mssql.Table();

    columns.forEach(column => {
        if (column && typeof column === 'object' && column.name && column.type) {
            if (column.hasOwnProperty('options')) {
                table.columns.add(column.name, column.type, column.options);
            } else {
                table.columns.add(column.name, column.type);
            }
        }
    });

    entities.forEach(entity => {
        table.rows.add(...columns.map(i => entity[i.name]));
    });

    return table;
};

module.exports = dataAccess;