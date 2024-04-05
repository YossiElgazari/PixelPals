import request from 'supertest';
import app from '../app';

describe('POST /users/register', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/users/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'Password123!',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should return an error for duplicate user', async () => {
        const res = await request(app)
            .post('/users/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'Password123!',
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should return an error for invalid input', async () => {
        const res = await request(app)
            .post('/users/register')
            .send({
                username: '',
                email: 'testuser@example.com',
                password: 'Password123!',
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Invalid input');
    });

  
});
