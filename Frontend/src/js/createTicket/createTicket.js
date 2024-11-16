export default function createTicket(list, ticket) {
  const template = `
        <div class="task" id="${ticket.id}">
            <div class="container-main">
                <div class="round">
                    <input type="checkbox" id="checkbox" class="check-mark"/>
                    <label for="checkbox" class="label-mark"></label>
                </div>
                <span class="task-text">${ticket.ticketName}</span>
                <span class="task-date">${ticket.created}</span>
                <div class="task-actions">
                    <button class="attachment"></button>
                    <button class="delete"></button>
                </div>
            </div>
            <span class="task-info"></span>
        </div>
    `;
  list.insertAdjacentHTML('afterbegin', template);
}
