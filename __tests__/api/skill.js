require("dotenv").config();
const request = require("supertest");

const { connectDatabase, disconnectDatabase } = require('../../src/config/database');
const app = require('../../src/app');
const { ADMIN } = require('../../src/constants/constants');

let token;
let newSkillId;

beforeAll(async () => {
    await connectDatabase();
    token = await request(app)
        .post('/api/v1/account/login')
        .send({ email: ADMIN.EMAIL, password: ADMIN.PASSWORD });
});

afterAll(async () => {
    await disconnectDatabase();
});

describe('Skill', () => {
    describe('GET /api/v1/skills', () => {
        test('it should return all skills', async () => {
            const res = await request(app).get('/api/v1/skills');
    
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.skills)).toBe(true);
        });
    });

    describe('POST /api/v1/skills/admin/create', () => {
        const name = "Skill test 1";
        test('it should create a new skill', async () => {
            
            const res = await request(app)
                .post('/api/v1/skills/admin/create')
                .set({ Authorization: `Bearer ${token.body.accessToken}`})
                .send({
                    name
                });

            newSkillId = res.body.skill.id;
            
            expect(res.statusCode).toBe(201);
            expect(res.body.skill.name).toBe(name);
        });
    });

    describe(`PUT /api/v1/skills/admin/:id`, () => {
        const name = "test update skill";
        test('it should update skill name', async () => {
            
            const res = await request(app)
                .put(`/api/v1/skills/admin/${newSkillId}`)
                .set({ Authorization: `Bearer ${token.body.accessToken}`})
                .send({
                    name
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.skill.name).toBe(name);
        });
    });

    describe(`DELETE /api/v1/skills/admin/:id`, () => {
        test('it should delete skill', async () => {
            
            const res = await request(app)
                .delete(`/api/v1/skills/admin/${newSkillId}`)
                .set({ Authorization: `Bearer ${token.body.accessToken}`});
            
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Deleted successfully");
        });
    });
});
