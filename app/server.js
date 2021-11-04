const { app } = require('./app');
require('dotenv').config();

const PORT = process.env.NODE_DOCKER_PORT || 3000;
app.listen(PORT, () => {
});
