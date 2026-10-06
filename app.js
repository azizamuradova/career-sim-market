import express from 'express';
import getUserFromToken from '#middleware/getUserFromToken';
import usersRouter from '#api/users';
import productsRouter from 'api/products';

const app = express();

app.use(express.json());
app.use(getUserFromToken);
app.use('/users', usersRouter);
app.use('/products', productsRouter);

export default app;
