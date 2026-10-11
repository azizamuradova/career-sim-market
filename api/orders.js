import express from 'express';
import requireUser from '#middleware/requireUser';
import requireBody from '#middleware/requireBody';
import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
} from '#db/queries/orders';
import { getProductById, getProductsByOrderId } from '#db/queries/products';
import { createOrderProduct } from '#db/queries/orders_products';

const router = express.Router();
export default router;

router.use(requireUser);

router.post('/', requireBody(['date']), async (req, res) => {
  const { date, note } = req.body;
  const order = await createOrder(date, note, req.user.id);
  res.status(201).send(order);
});

router.get('/', async (req, res) => {
  const orders = await getOrdersByUserId(req.user.id);
  res.send(orders);
});

router.get('/:id', async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order) return res.status(404).send('Order not found');
  if (order.user_id !== req.user.id)
    return res.status(403).send('This is not your order.');
  res.send(order);
});

router.post(
  '/:id/products',
  requireBody(['productId', 'quantity']),
  async (req, res) => {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send('Order not found.');
    if (order.user_id !== req.user.id)
      return res.status(403).send('This is not your order.');
    const { productId, quantity } = req.body;
    const product = await getProductById(productId);
    if (!product) return res.status(400).send('Product not found.');
    const orderProduct = await createOrderProduct(
      order.id,
      product.id,
      quantity,
    );
    res.status(201).send(orderProduct);
  },
);

router.get('/:id/products', async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order) return res.status(404).send('Order not found.');
  if (order.user_id !== req.user.id)
    return res.status(403).send('This is not your order.');

  const products = await getProductsByOrderId(order.id);
  res.send(products);
});
