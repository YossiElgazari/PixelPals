import request from 'supertest';
import app from '../app';

describe('POST /users/login', () => {
  it('should login the user', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'Password123!',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return 401 for incorrect credentials', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'incorrectpassword',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should return 401 for non-existent user', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        email: 'nonexistentuser@example.com',
        password: 'Password123!',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });
});
