const express = require('express')
const dotenv = require('dotenv')
const getDataConfig = require('./data-access/data-config')
const { dataAccess } = require('./data-access/data-access')

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const dataConfig = getDataConfig()

app.locals.db = {
    uk: dataAccess(dataConfig.uk),
    siberia: dataAccess(dataConfig.siberia)
}

app.get('/', (req, res) => {
    res.send('<h1>🤖 Pooling with NodeJS and SQL Server</h1>');
});

app.use('/api/employees', require('./api/employees'));
app.use('/api/users', require('./api/users'));

app.listen(process.env.PORT, () => {
    console.log(`Server started running on ${process.env.PORT} for ${process.env.NODE_ENV}`);
});
