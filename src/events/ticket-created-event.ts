import {Subjects} from "./subjects";

export interface TicketCreatedEvent {
    subject: Subjects.TicketCreated;
    verison: number;
    data: {
        id: string;
        title: string;
        price: number;
        userId: string;
    };
}