import request from 'supertest';
import app from '../app';

describe('POST /users/register', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/users/register')
            .send({
                username: 'yossi',
                email: 'yossi@example.com',
                password: '123',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });
});
