const express = require('express');
const morgan = require('morgan');
const taskRoutes = require('./routes/tasks.routes');
const app = express();

app.use(express.json());
app.use('/api', taskRoutes);

app.listen(4000)
console.log('Server on port', 4000);