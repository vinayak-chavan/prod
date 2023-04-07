require('./src/db/connection');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const userRoutes = require('./src/routes/userRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const calculationRoutes = require('./src/routes/calculationRoutes');

const app = express();
const port = 8000;

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/src/public'));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(cookieParser());

app.use("/", userRoutes);
app.use("/", attendanceRoutes);
app.use("/", calculationRoutes);

app.listen(port, () => {
    console.log(`connection is live at port ${port}`);
});