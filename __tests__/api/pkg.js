require("dotenv").config();
const request = require("supertest");

const { connectDatabase, disconnectDatabase } = require('../../src/config/database');
const app = require('../../src/app');
const { ADMIN } = require('../../src/constants/constants');

let token;
let newPackageId;

beforeAll(async () => {
    await connectDatabase();
    token = await request(app)
        .post('/api/v1/account/login')
        .send({ email: ADMIN.EMAIL, password: ADMIN.PASSWORD });
});

afterAll(async () => {
    await disconnectDatabase();
});

describe('Package', () => {
    let pkg = {
        description: 'Test 1',
        price: 100,
        canPost: 10,
        point: 10
    };

    describe('GET /api/v1/packages', () => {
        test('it should return all packages', async () => {
            const res = await request(app).get('/api/v1/packages');
    
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.packages)).toBe(true);
        });
    });

    describe('POST /api/v1/packages/admin/create', () => {
        test('it should create a new package', async () => {
            const res = await request(app)
                .post('/api/v1/packages/admin/create')
                .set({ Authorization: `Bearer ${token.body.accessToken}`})
                .send(pkg);

            newPackageId = res.body.package.id;
            
            expect(res.statusCode).toBe(201);
            expect(res.body.package.description).toBe(pkg.description);
        });
    });

    describe(`PUT /api/v1/packages/admin/:id`, () => {
        pkg.description = "Test update";
        test('it should update skill name', async () => {
            
            const res = await request(app)
                .put(`/api/v1/packages/admin/${newPackageId}`)
                .set({ Authorization: `Bearer ${token.body.accessToken}`})
                .send(pkg);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.package.description).toBe(pkg.description);
        });
    });

    describe(`DELETE /api/v1/packages/admin/:id`, () => {
        test('it should delete skill', async () => {
            
            const res = await request(app)
                .delete(`/api/v1/packages/admin/${newPackageId}`)
                .set({ Authorization: `Bearer ${token.body.accessToken}`});
            
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Deleted successfully");
        });
    });
});
