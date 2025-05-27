const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.use('client/public/uploads', express.static('client/public/uploads'));


// Rutas
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/historyRoutes'));
app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/questionRoutes'));
app.use('/api', require('./routes/gamePlayRoutes'));
app.use('/api', require('./routes/categoriesRoutes'));
app.use('/api', require('./routes/profileRoutes'));
app.use('/api', require('./routes/friendsRoutes'));
app.use('/api', require('./routes/externUserProfileRoutes'));
app.use('/api', require('./routes/clsssicModeRoutes'));
app.use('/api', require('./routes/communityRoutes'));
app.use('/api', require('./routes/communityPlayRoutes'));
app.use('/api', require('./routes/communityCategoriesJudgementRoutes'));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



