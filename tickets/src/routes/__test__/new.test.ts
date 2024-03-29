import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../NatsWrapper'

jest.mock("../../NatsWrapper")

it('Has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})

  expect(response.status).not.toEqual(404)
})

it('Can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)
})

it('Returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({})

  expect(response.status).not.toEqual(401)
})

it("returns an error if an invalid title is provided", async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ 
        title: "", 
        price: 11 
    })
      .expect(400)
    
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ 
        price: 11 
    })
      .expect(400)
});

it("Returns an error if an invalid price is provided", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ 
        title: "tile", 
        price: -10 
    })
      .expect(400);
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ 
        title: "title" 
    })
      .expect(400);
});

it('Creates a ticket with valid inputs', async () => {
    let tickets = await Ticket.find({});
  
    expect(tickets.length).toEqual(0);
  
    // add in a check to make sure a ticket was saved
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: "valid", price: 20 })
      .expect(201)
  
    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
    expect(tickets[0].price).toEqual(20)
})

it("Publishes an event", async () => {
    // create a ticket and then publish an event
    const title = "sddaskds"
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title, price: 20 })
      .expect(201)
  
    // we should figure out if publish function was called.
    console.log(natsWrapper);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
