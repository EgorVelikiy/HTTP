import createTicket from '../createTicket/createTicket';

export default class TicketService {
  constructor(container, formContainer, changeFormContainer) {
    this.mainContainer = container;
    this.formContainer = formContainer;
    this.changeFormContainer = changeFormContainer;

    this.ticketForm = this.formContainer.querySelector('.ticket-creatior');
    this.cancelCreation = this.formContainer.querySelector('.cancel');
    this.ticketName = this.ticketForm.querySelector('.name');
    this.ticketDescription = this.ticketForm.querySelector('.description');

    this.ticketChangeForm = this.changeFormContainer.querySelector('.ticket-changer');
    this.cancelChange = this.changeFormContainer.querySelector('.cancel-change');
    this.ticketChangeName = this.ticketChangeForm.querySelector('.change-name');
    this.ticketChangeDescription = this.ticketChangeForm.querySelector('.change-description');

    this.ticketlist = this.mainContainer.querySelector('.task-list');
    this.showTickets = this.mainContainer.querySelector('.show-tickets');
    this.addTicketBtn = this.mainContainer.querySelector('.add-ticket');

    this.idForChange;

    this.url = 'http://localhost:7070';
  }

  init() {
    this.addTicketBtn.addEventListener('click', () => {
      this.formContainer.classList.toggle('hidden');
    });

    this.ticketForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.post();
    });

    this.ticketChangeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.editTicket();
    });

    this.cancelCreation.addEventListener('click', () => {
      this.formContainer.classList.add('hidden');
    });

    this.cancelChange.addEventListener('click', () => {
      this.changeFormContainer.classList.add('hidden');
    });

    this.showTickets.addEventListener('click', () => {
      this.getTicketsList();
    });

    this.ticketlist.addEventListener('click', (e) => {
      if (e.target.classList == 'delete') {
        this.deleteTicket(e.target);
      } else if (
        e.target.classList == 'task' ||
        e.target.classList == 'container-main' ||
        e.target.classList == 'task-info'
      ) {
        this.fullTicketInfo(e.target);
      } else if (e.target.classList == 'attachment') {
        this.getInfoToChange(e.target.closest('.task'));
        this.changeFormContainer.classList.toggle('hidden');
      } else {
        return;
      }
    });
  }

  post() {
    const body = { ticketName: this.ticketName.value, description: this.ticketDescription.value };

    const xhr = new XMLHttpRequest();

    xhr.onloadend = () => {
      const result = xhr.response;

      createTicket(this.ticketlist, result);
      this.ticketForm.reset();
      this.formContainer.classList.add('hidden');
    };

    xhr.open('POST', `${this.url}/?method=createTicket`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';
    xhr.send(JSON.stringify(body));
  }

  getTicketsList() {
    const xhr = new XMLHttpRequest();

    xhr.onloadend = () => {
      const result = xhr.response;
      if (!result) {
        return;
      }

      if (this.ticketlist.childElementCount <= result.length) {
        this.ticketlist.replaceChildren();
      }

      for (const i in result) {
        createTicket(this.ticketlist, result[i]);
      }
    };

    xhr.open('GET', `${this.url}/?method=allTickets`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';
    xhr.send();
  }

  deleteTicket(target) {
    const xhr = new XMLHttpRequest();

    const id = { id: target.closest('.task').id };

    xhr.onloadend = () => {
      target.closest('.task').remove();
    };

    xhr.open('DELETE', `${this.url}/?method=deleteTicket`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(id));
  }

  fullTicketInfo(target) {
    if (target.classList == 'container-main' || target.classList == 'task-info') {
      target = target.closest('.task');
    }

    const xhr = new XMLHttpRequest();

    const { id } = target;

    xhr.onloadend = () => {
      const descr = JSON.parse(xhr.response).description;
      const element = target.querySelector('.task-info');
      element.textContent = descr;
      element.style.display = element.style.display === 'block' ? 'none' : 'block';
    };

    xhr.open('GET', `${this.url}/?method=getDescription&descId=${id}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
  }

  getInfoToChange(target) {
    const xhr = new XMLHttpRequest();

    const { id } = target;
    this.idForChange = id;
    const name = target.querySelector('.task-text').textContent;

    xhr.onloadend = () => {
      const descr = JSON.parse(xhr.response).description;
      this.ticketChangeName.value = name;
      this.ticketChangeDescription.value = descr;
      this.ticketInfo = { name, fullInfo: descr };
    };

    xhr.open('GET', `${this.url}/?method=getDescription&descId=${id}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
  }

  editTicket() {
    const xhr = new XMLHttpRequest();

    const body = {
      id: this.idForChange,
      ticketName: this.ticketChangeName.value,
      description: this.ticketChangeDescription.value,
    };

    xhr.onloadend = () => {
      const result = xhr.response;

      const ticketForChange = document.getElementById(this.idForChange);

      console.log(ticketForChange);
      const nameForChange = ticketForChange.querySelector('.task-text');
      nameForChange.textContent = result.ticketName;

      const dateForChange = ticketForChange.querySelector('.task-date');
      dateForChange.textContent = result.created;

      this.ticketChangeForm.reset();
      this.changeFormContainer.classList.add('hidden');
    };

    xhr.open('PATCH', `${this.url}/?method=changeTicket`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';
    xhr.send(JSON.stringify(body));
  }
}
