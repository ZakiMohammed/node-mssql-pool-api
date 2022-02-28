const express = require('express')
const dataAccess = require('../data-access/data-access')
const getConfigs = require('../data-access/pool-configs')

const router = express.Router();
const poolConfig = getConfigs()
const dbUk = dataAccess(poolConfig.uk.name)
const dbSiberia = dataAccess(poolConfig.siberia.name)

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

module.exports = router;