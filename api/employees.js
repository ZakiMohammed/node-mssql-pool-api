const express = require('express')

const router = express.Router();

const dbUk = req => req.app.locals.db.uk
const dbSiberia = req => req.app.locals.db.siberia

router.get('/', async (req, res) => {
    try {
        const command = `SELECT * FROM Employee ORDER BY Id DESC`

        const uk = (await dbUk(req).query(command)).recordset;
        const siberia = (await dbSiberia(req).query(command)).recordset;

        dbUk(req).close()
        dbSiberia(req).close()

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

        const resultUk = await dbUk(req).query(command, inputs);
        const [uk = null] = resultUk.recordset;

        const resultSiberia = await dbSiberia(req).query(command, inputs);
        const [siberia = null] = resultSiberia.recordset;

        res.json({ uk, siberia })
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;