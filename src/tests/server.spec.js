const express = require('express');
const request = require('supertest');

const app = express();

const API_URL = process.env.NODE_ENV === 'production' ? 'https://movieholic-api.herokuapp.com/api' : 'http://localhost:5000/api';

describe('server', () => {
    describe('user rest api', () => {
        it('should register user', done => {
            request(app)
                .post(`${API_URL}/user/register`)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end((error) => (error) ? done.fail(error) : done());
        });
    });
});