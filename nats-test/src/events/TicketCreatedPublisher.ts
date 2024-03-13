import { Publisher } from "./BasePublisher"
import type { TicketCreatedEvent } from "./TicketCreatedEvent"
import { Subjects } from "./Subjects"

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}