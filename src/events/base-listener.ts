import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event> {

    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;

    private client: Stan;
    protected ackWait = 5 *1000;

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setManualAckMode(true) // Acknowledgement of event reception on the service must be done manually,
            // default behaviour does this automatically when the service receives the event.
            // This is wrong because when the service crashes the event is lost.
            // We only want to acknowledge the reception of the event when all the processing
            // inside the service is done.
            // When the acknowledgement didn't happen, NATS will resend the event
            // after 30 seconds, this will keep happening until it's acknowledged.
            .setAckWait(this.ackWait)
            .setDeliverAllAvailable()   // Upon creation of a completely new listener / queue-group
            // this function will send all the (processed & unprocessed) events
            // that are stored on the NATS Streaming Server.
            // This way, a totally new service (listener) / queue-group which always
            // represent, a new table/micro-service will process the full history
            // of emitted events from its initial creation.
            .setDurableName('orders-service')   // Takes all the events from a durable subscription group aka. history log
                                                // Once the service (listener) is (back) online it will start processing
                                                // unprocessed events from inside the history log.
                                                // This function tells the service (listener) to process the
                                                // unprocessed events from a specific durable subscription group
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(`Message received ${this.subject} / ${this.queueGroupName}`);

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        })
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf-8'));
    }
}