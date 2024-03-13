import { Publisher, OrderCancelledEvent, Subjects } from "@rallycoding/common"

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}