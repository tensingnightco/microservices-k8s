import request from 'supertest'
import { app } from '../../app'

it(`Fails when an email that doesn't exist is applied`, async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)
})

it(`Fails when an incorrect password is provided`, async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'bigsur'
        })
        .expect(201)
    
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'monterey'
        })
        .expect(400)
})

it(`Responds with a cookie when given valid credentials`, async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'montserrat'
        })
        .expect(201)
    
    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'montserrat'
        })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
})

