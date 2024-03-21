import express from 'express';
import UserRoutes from './routers/user.js';
import AuthRouter from './routers/auth.js';

const app = express();

//middleware
app.use(express.json())

//rout
app.use('/users', UserRoutes)
app.use('/auth', AuthRouter)

app.listen(8000, () => {
    console.log(`running on http://localhost:8000`);
})