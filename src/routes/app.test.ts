import request from 'supertest';
import app from '../app';

// TODO:
// * tests for compression
// * tests for caching
// * tests for errors handling

describe('app', () => {
    it('correctly responds with a not found message', (done) => {
        request(app)
        .get('/definitely-not-found-path')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
});

describe('GET /test', () => {
    it('responds with a test json message', (done) => {
        request(app)
        .get('/test')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
            expect(res.body).toHaveProperty('hello');
            expect(res.body.hello).toBe('world');
            done();
        });
    });
});
