import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models/ticket"
import { Order, OrderStatus } from "../../models/order"
import { natsWrapper } from "../../__mocks__/NatsWrapper"

it('Marks an order as cancelled', async () => {
    // Create a ticket with Ticket model
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save()

    const user = global.signin()

    // Make a request to create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    // Make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    // Expectation to make sure the thing is cancelled
    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it("Emits a order cancelled event", async () => {
    const ticket = Ticket.build({
      title: "Concert",
      price: 32,
      id: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save()
    const user = global.signin()
  
    // Make a request to create an order
    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", user)
      .send({ ticketId: ticket.id })
    // Make a request to cancel the order
    await request(app).delete(`/api/orders/${order.id}`).set("Cookie", user)
  
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
  