const express = require('express');
const app = express();
const connectDB = require('./config/db')

const userRoute = require('./routes/api/users')
const authRoute = require('./routes/api/auth')
const profileRoute = require('./routes/api/profile')
const postsRoute = require('./routes/api/posts')

//Connect Database
connectDB();

//INIT Middleware
app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('API running'))

//Define Routes
app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/profile', profileRoute)
app.use('/api/posts', postsRoute)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is listening on PORT ${PORT}`))