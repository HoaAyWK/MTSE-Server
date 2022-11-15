require("dotenv").config();
const request = require("supertest");

let token;
let newCategoryId;

const { connectDatabase, disconnectDatabase } = require('../../src/config/database');
const app = require('../../src/app');
const { ADMIN } = require('../../src/constants/constants');


beforeAll(async () => {
    await connectDatabase();
    token = await request(app)
        .post('/api/v1/account/login')
        .send({ email: ADMIN.EMAIL, password: ADMIN.PASSWORD });
});

afterAll(async () => {
    await disconnectDatabase();
});

describe('Category', () => {
    const num = 2;
    describe(`GET /api/v1/categories?num=${num}`, () => {
        test(`it should return categories with limit ${num}`, async () => {
            const res = await request(app).get(`/api/v1/categories?num=${num}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.categories)).toBe(true);
            expect(res.body.categories.length).toBe(num);
        });
    })

    describe('GET /api/v1/categories', () => {
        test('it should return all categories', async () => {
            const res = await request(app).get('/api/v1/categories');
    
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.categories)).toBe(true);
        });
    });

    describe('POST /api/v1/categories/admin/create', () => {
        const name = "Jest test 2";
        test('it should create a new category', async () => {
            
            const res = await request(app)
                .post('/api/v1/categories/admin/create')
                .set({ Authorization: `Bearer ${token.body.accessToken}`})
                .send({
                    name
                });

            newCategoryId = res.body.category.id;
            
            expect(res.statusCode).toBe(201);
            expect(res.body.category.name).toBe(name);
        });
    });

    describe(`PUT /api/v1/categories/admin/:id`, () => {
        const name = "Jest test Update";
        test('it should update category name', async () => {
            
            const res = await request(app)
                .put(`/api/v1/categories/admin/${newCategoryId}`)
                .set({ Authorization: `Bearer ${token.body.accessToken}`})
                .send({
                    name
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.category.name).toBe(name);
        });
    });

    describe(`DELETE /api/v1/categories/admin/:id`, () => {
        test('it should delete category', async () => {
            
            const res = await request(app)
                .delete(`/api/v1/categories/admin/${newCategoryId}`)
                .set({ Authorization: `Bearer ${token.body.accessToken}`});
            
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Deleted successfully");
        });
    });
});
