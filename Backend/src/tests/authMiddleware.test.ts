import request from 'supertest';
import app from '../app';
import { protect } from '../middlewares/authMiddleware';

// Mock a protected route
app.get('/protected-route', protect, (req, res) => {
  res.json({ message: 'You are authorized' });
});

describe('GET /protected-route', () => {
  it('should deny access without token', async () => {
    const res = await request(app).get('/protected-route');
    expect(res.statusCode).toEqual(401);
  });

  it('should allow access with valid token', async () => {
    // You'll need a way to generate or mock a valid token
    const validToken = '...'; // This should be replaced with a valid token
    const res = await request(app)
      .get('/protected-route')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.statusCode).toEqual(200);
  });

  it('should deny access with expired token', async () => {
    // You'll need a way to generate or mock an expired token
    const expiredToken = '...'; // This should be replaced with an expired token
    const res = await request(app)
      .get('/protected-route')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.statusCode).toEqual(401);
  });

  it('should deny access with invalid token', async () => {
    // You'll need a way to generate or mock an invalid token
    const invalidToken = '...'; // This should be replaced with an invalid token
    const res = await request(app)
      .get('/protected-route')
      .set('Authorization', `Bearer ${invalidToken}`);
    expect(res.statusCode).toEqual(401);
  });

  
});
