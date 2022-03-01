const express = require('express')
const dataAccess = require('../data-access/data-access')
const getConfigs = require('../data-access/data-config')
const poolManager = require('../data-access/pool-manager')

const router = express.Router();
const dataConfig = getConfigs()
const dbUk = dataAccess(dataConfig.uk.name)
const dbSiberia = dataAccess(dataConfig.siberia.name)

router.get('/', async (req, res) => {
    try {
        const command = `SELECT * FROM Employee ORDER BY Id DESC`

        const uk = (await dbUk.query(command)).recordset;
        const siberia = (await dbSiberia.query(command)).recordset;

        res.json({ uk, siberia });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const command = `SELECT * FROM Employee WHERE Id = @Id`
        const inputs = [
            { name: 'Id', value: req.params.id }
        ]

        const resultUk = await dbUk.query(command, inputs);
        const [uk = null] = resultUk.recordset;

        const resultSiberia = await dbSiberia.query(command, inputs);
        const [siberia = null] = resultSiberia.recordset;

        res.json({ uk, siberia })
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/close/:name', async (req, res) => {
    try {
        await poolManager.close(req.params.name)
        const keys = Array.from(poolManager.getAll().keys())
        res.json(keys)
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;