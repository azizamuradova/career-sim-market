import express from 'express';
import requireUser from '#middleware/requireUser';
import requireBody from '#middleware/requireBody';
import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
} from '#db/queries/orders';

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
