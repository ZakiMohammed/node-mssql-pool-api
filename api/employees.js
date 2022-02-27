const express = require('express')
const dataAccess = require('../data-access/data-access')
const getConfigs = require('../data-access/pool-configs')

const router = express.Router();
const poolConfig = getConfigs()
const db1 = dataAccess(poolConfig.uk.name)
const db2 = dataAccess(poolConfig.siberia.name)

router.get('/', async (req, res) => {
    try {
        const result1 = await db1.query(`SELECT * FROM Employee ORDER BY Id DESC`);
        const employees1 = result1.recordset;

        const result2 = await db2.query(`SELECT * FROM Employee ORDER BY Id DESC`);
        const employees2 = result2.recordset;

        res.json({
            employees1,
            employees2
        });
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result1 = await db1.query(`SELECT * FROM Employee WHERE Id = @Id`, [
            { name: 'Id', value: req.params.id }
        ]);
        const employee1 = result1.recordset.length ? result1.recordset[0] : null;

        const result2 = await db2.query(`SELECT * FROM Employee WHERE Id = @Id`, [
            { name: 'Id', value: req.params.id }
        ]);
        const employee2 = result2.recordset.length ? result2.recordset[0] : null;

        res.json({
            employee1, 
            employee2
        })
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;