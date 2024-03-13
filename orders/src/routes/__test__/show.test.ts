import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models/ticket"
import mongoose from "mongoose"

it("Fetches the order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 32,
  })

  await ticket.save()
  const user = global.signin()
  // Make a request to build an order with this ticket

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // Make a request to fetch the order

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200)

  expect(fetchedOrder.id).toEqual(order.id)
})

it("Returns an error if one user tries to fetch another user's order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 32,
})

  await ticket.save()
  const user = global.signin()
  // Make a request to build an order with this ticket

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201)

  const userTwo = global.signin()

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userTwo)
    .send()
    .expect(401)
})
