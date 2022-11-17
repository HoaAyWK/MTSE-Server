require("dotenv").config();
const request = require("supertest");

const { connectDatabase, disconnectDatabase } = require('../../src/config/database');
const app = require('../../src/app');
const { FREELANCER, EMPLOYER, NO_CONFIRMED_EMAIL_USER, CONFIRMED_EMAIL_USER } = require('../../src/constants/constants');

let token;

beforeAll(async () => {
    await connectDatabase();
    token = await request(app)
        .post('/api/v1/account/login')
        .send({ email: CONFIRMED_EMAIL_USER.EMAIL, password: CONFIRMED_EMAIL_USER.PASSWORD });
});

afterAll(async () => {
    await disconnectDatabase();
});

describe('Account', () => {
    describe('POST /api/v1/account/login', () => {
        test('it should return an token', async () => {
            const res = await request(app)
                .post('/api/v1/account/login')
                .send({ email: EMPLOYER.EMAIL, password: EMPLOYER.PASSWORD });
    
            expect(res.statusCode).toBe(200);
            expect(typeof res.body.accessToken).toBe('string');
        });

        test('it should return message \'Invalid Email or Password\' when provide email does not exist', async () => {
            const res = await request(app)
                .post('/api/v1/account/login')
                .send({ email: 'test@mail.com', password: FREELANCER.PASSWORD });
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid Email or Password');
        });

        test('it should return message \'Invalid Email or Password\' when provide wrong password', async () => {
            const res = await request(app)
                .post('/api/v1/account/login')
                .send({ email: FREELANCER.EMAIL, password: 'abcdef' });
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid Email or Password');
        });

        test('it should return message \'Email is not been confirmed\'', async () => {
            const res = await request(app)
                .post('/api/v1/account/login')
                .send({ email: NO_CONFIRMED_EMAIL_USER.EMAIL, password: NO_CONFIRMED_EMAIL_USER.PASSWORD });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Email is not been confirmed');
        })
    });

    describe('PUT /api/v1/account/changePassword', () => {
        test('it should return message \'Invalid token\'', async () => {
            const data = {
                oldPassword: "123456",
                newPassowrd: "12345678"
            };

            const res = await request(app)
                .put('/api/v1/account/changePassword')
                .send(data);
            
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid token');
        });

        test('it should return message \'Password is Incorrect\'', async () => {
            const data = {
                oldPassword: "12345",
                newPassword: "12345678"
            };

            const res = await request(app)
                .put('/api/v1/account/changePassword')
                .set({ Authorization: `Bearer ${token.body.accessToken}`})
                .send(data);
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Password is Incorrect');
        });

        test('it should return message \'Change Password Successfully\'', async () => {
            const data = {
                oldPassword: "123456",
                newPassword: "12345678"
            };

            const res = await request(app)
                .put('/api/v1/account/changePassword')
                .set({ Authorization: `Bearer ${token.body.accessToken}`})
                .send(data);
    
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Change Password Successfully');
        });
    });
});
