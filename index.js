const express = require('express')
const dotenv = require('dotenv')
const getConfigs = require('./data-access/pool-configs');
const poolManager = require('./data-access/pool-manager');

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const poolConfig = getConfigs()
poolManager.set(poolConfig.uk.name, poolConfig.uk.config)
poolManager.set(poolConfig.siberia.name, poolConfig.siberia.config)

app.get('/', (req, res) => {
    res.send('<h1>🤖 Pooling with NodeJS and SQL Server</h1>');
});

app.use('/api/employees', require('./api/employees'));

app.listen(process.env.PORT, () => {
    console.log(`Server started running on ${process.env.PORT} for ${process.env.NODE_ENV}`);
});
