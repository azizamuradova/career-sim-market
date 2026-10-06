import express from 'express';
import { getProducts, getProductById } from '#db/queries/products';

const router = express.Router();
export default router;

router.get('/', async (req, res) => {
  const products = await getProducts();
  res.send(products);
});

router.get('/:id', async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).send('Product not found');
  res.send(product);
});
