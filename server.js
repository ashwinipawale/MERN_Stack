const express = require('express');
const app = express();

const connectDB = require('./config/db')

const userRoute = require('./routes/api/users')
const authRoute = require('./routes/api/auth')
const profileRoute = require('./routes/api/profile')
const postsRoute = require('./routes/api/posts')

const PORT = process.env.PORT || 5000;

connectDB();

app.get('/', (req, res) => res.send('API running'))
app.use('/users', userRoute)
app.use('/auth', authRoute)
app.use('/profile', profileRoute)
app.use('/posts', postsRoute)

app.listen(PORT, () => console.log(`server is listening on PORT ${PORT}`))