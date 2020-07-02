import { Subjects } from "./subjects";

export interface TicketUpdatedEvent {
    subject: Subjects.TicketUpdated;
    version: number;
    data: {
        id: string;
        title: string;
        price: number;
        userId: string;
    }
}