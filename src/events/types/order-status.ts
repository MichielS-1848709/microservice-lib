export enum OrderStatus {
    // Ticket has been created, but not yet reserved
    Created = 'created',

    // Ticket has already been reserved, user canceled the order or order expired
    Cancelled = 'cancelled',

    // Order has successfully reserved the ticket
    AwaitingPayment = 'awaiting:payment',

    // Order has reserved and user payed successfully
    Complete = 'complete'
}