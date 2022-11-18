const request = require('supertest');
const app = require('../../../app');
const {User} = require('../../../app/models');

describe('GET /auth/whoami', () => {
    const regCred = {
        name: 'Impostor',
        email: new Date().getDate() + '@amongus3.com',
        password: 'password',
    };
let token;

beforeAll(async () => {
    const res = await request(app)
        .post('/auth/register')
        .set('Content-Type', 'application/json')
        .send(regCred);
    token = res.body.accessToken;
});

afterAll(async () => {
    await User.destroy({
        where: {email: regCred.email},
    });
});

it('test for response code 200 and return user object if success', async () => {
    return request(app)
        .get('/auth/whoami')
        .set('Content-Type', 'application/json')
        .set('authorization', 'Bearer ' + token)
        .then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('name');
            expect(res.body).toHaveProperty('email');
        });
    });
});
