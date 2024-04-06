import request from 'supertest';
import app from '../app';

describe('POST /users/login', () => {
    it('should login a user', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({
                email: 'yossi@example.com',
                password: '123',
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
