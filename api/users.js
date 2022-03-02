const express = require('express')
const { dataAccess } = require('../data-access/data-access')
const getDataConfig = require('../data-access/data-config')

const router = express.Router();
const dataConfig = getDataConfig()
const dbUk = dataAccess(dataConfig.uk)
const dbSiberia = dataAccess(dataConfig.siberia)

router.get('/', async (req, res) => {
    try {
        const command = `SELECT * FROM [User] ORDER BY Id DESC`

        const uk = (await dbUk.query(command)).recordset;
        const siberia = (await dbSiberia.query(command)).recordset;

        res.json({ uk, siberia });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;