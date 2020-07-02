import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string;
        version: number;
        status: OrderStatus;
        userId: string;
        expiresAt: string;  // We will manually convert it to a string because when Javascript
                            // does this the Date object will be converted to your own timezone.
                            // We only want to use UTC timezone, so we need to do the conversion our self.
        ticket: {
            id: string;
            price: number;
        }
    }
}