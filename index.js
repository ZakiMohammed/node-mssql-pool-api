const express = require('express')
const dotenv = require('dotenv')
const getConfigs = require('./data-access/data-config');
const poolManager = require('./data-access/pool-manager');

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const dataConfig = getConfigs()
poolManager.set(dataConfig.uk.name, dataConfig.uk.config)
poolManager.set(dataConfig.siberia.name, dataConfig.siberia.config)

app.get('/', (req, res) => {
    res.send('<h1>🤖 Pooling with NodeJS and SQL Server</h1>');
});

app.use('/api/employees', require('./api/employees'));

app.listen(process.env.PORT, () => {
    console.log(`Server started running on ${process.env.PORT} for ${process.env.NODE_ENV}`);
});
