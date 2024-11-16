import createField from './createField/createField';
import TicketService from './TicketService/TicketService';
import changeTicket from './changeTicket/chageTicket';

const body = document.querySelector('body');
createField(body);
changeTicket();

const container = document.querySelector('.container');
const formContainer = document.querySelector('.form-widget');
const changeFormContainer = document.querySelector('.change-form-widget');

const ticketService = new TicketService(container, formContainer, changeFormContainer);
ticketService.init();
