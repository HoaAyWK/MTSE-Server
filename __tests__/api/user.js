require("dotenv").config();
const request = require("supertest");

const { connectDatabase, disconnectDatabase } = require('../../src/config/database');
const app = require('../../src/app');
const { FREELANCER } = require('../../src/constants/constants');

let token;

beforeAll(async () => {
    await connectDatabase();
    token = await request(app)
        .post('/api/v1/account/login')
        .send({ email: FREELANCER.EMAIL, password: FREELANCER.PASSWORD });
});

afterAll(async () => {
    await disconnectDatabase();
});

describe('User', () => {
    describe('GET /api/v1/users/profile', () => {
        test('it should return an user', async () => {
            const res = await request(app)
                .get('/api/v1/users/profile')
                .set({ Authorization: `Bearer ${token.body.accessToken}`});
    
            expect(res.statusCode).toBe(200);
            expect(res.body.user.email).toBe(FREELANCER.EMAIL);
        });
    });

    describe('PUT /api/v1/users/profile', () => {
        test('it should return an updated user', async () => {
            const data = {
                phone: "0987654321",
                address: "Q9, Ho Chi Minh, Viet Nam"
            };

            const res = await request(app)
                .put('/api/v1/users/profile')
                .set({ Authorization: `Bearer ${token.body.accessToken}`})
                .send(data);
    
            expect(res.statusCode).toBe(200);
            expect(res.body.user.phone).toBe(data.phone);
            expect(res.body.user.address).toBe(data.address);
        });
    });
});
