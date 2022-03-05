const express = require('express')

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const command = `SELECT * FROM [User] ORDER BY Id DESC`

        const uk = (await req.app.locals.db.uk.query(command)).recordset;
        const siberia = (await req.app.locals.db.siberia.query(command)).recordset;

        res.json({ uk, siberia });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;