import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as crypto from "crypto";
import pino from 'pino';
import pinoPretty from 'pino-pretty';
import moment from "moment";

const app = express();
const logger = pino(pinoPretty());

let tickets = [];

app.use(cors());

app.use(
  bodyParser.json({
    type(req) {
      return true;
    },
  })
);

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.use(async (request, response) => {
  const { method } = request.query;

  switch (method) {

    case 'allTickets':
      response.send(JSON.stringify(tickets)).end();
      break;

    case 'ticketById':
      const ticketById = tickets.find((tick) => tick.id === id);
      if (!ticketById) {
        response.status = 404;
        response.send(JSON.stringify({ error: "Ticket dosen't exist" }))
        break;
      }
      response.send(JSON.stringify(ticketById)).end();
      break;

    case 'createTicket':
      try {
        const { ticketName, description } = request.body;

        const ticketCreated = {
          id: crypto.randomUUID(),
          ticketName: ticketName,
          description: description ? description : '',
          status: false,
          created: moment().format('DD.MM.YY hh:mm')
        };

        tickets.push(ticketCreated);
        response.send(JSON.stringify(ticketCreated)).end()
      } catch(e) {
        logger.error(e.message)
        response.status = 500;
      }
      break;

    case 'deleteTicket':
      const { id } = request.body;

      if (tickets.every(ticket => ticket.id !== id)) {
        logger.warn(`No ticket with such id: ${id}`)
        response.status(404).send(JSON.stringify({ message: 'Ticket not found' })).end()
      }

      tickets = tickets.filter((ticket) => ticket.id !== id);
      response.send(JSON.stringify(tickets)).end()

      break;

    case 'getDescription':
      const { descId } = request.query;
      const ticket = tickets.find((ticket) => ticket.id === descId);
      if (!ticket) {
        response.status(404).send(JSON.stringify({ message: 'Ticket not found' })).end()
      }

      if (ticket.description != '') {
        response.send(JSON.stringify({ description: ticket.description })).end();
      } else {
        response.send(JSON.stringify({ description: 'No description' }));
      }

      break;

    case 'changeTicket':
      try {
        const { id, ticketName, description } = request.body;
        const ticket = tickets.find((tick) => tick.id === id);
        
        ticket.description = description;
        ticket.ticketName = ticketName;
        ticket.created = moment().format('DD.MM.YY hh:mm');
        response.send(JSON.stringify(ticket)).end()
      } catch(e) {
        logger.error(e.message)
        response.status = 500;
      }
      break;

    default:
      logger.warn(`Unknown method: ${method}`);
      response.status = 404;
      break;
  }
})


const port = process.env.PORT || 7070;

const bootstrap = async () => {
  try {
    app.listen(port, () =>
        logger.info(`Server has been started on http://localhost:${port}`)
    );
  } catch (error) {
    console.error(error);
  }
};

bootstrap();