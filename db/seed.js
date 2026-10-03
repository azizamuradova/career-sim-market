import db from '#db/client';
import { createUser } from '#db/queries/users';
import { createProduct } from '#db/queries/products';
import { createOrder } from '#db/queries/orders';
import { createOrderProduct } from '#db/queries/orders_products';

await db.connect();
await seed();
await db.end();
console.log('🌱 Database seeded.');

async function seed() {
  const user = await createUser('aziza', 'password123');

  const products = [];
  for (let i = 1; i <= 10; i++) {
    const product = await createProduct(
      'Product' + i,
      'Description of product' + i,
      i * 10,
    );
    products.push(product);
  }

  const order = await createOrder('2026-10-01', 'First order', user.id);
  for (let i = 0; i <= 5; i++) {
    await createOrderProduct(order.id, products[i].id, 1);
  }
}
