export default function changeTicket() {
  const markup = `
        <div class="change-form-widget hidden">
            <div class="change-container">
              <span class="title">Изменить Тикет</span>
                <form class="ticket-changer" name="from2" method="PATCH">
                    <div class="form-group">
                        <label for="label-name">Краткое описание</label>
                        <input class="change-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="label-description">Подробное описание</label>
                        <input class="change-description" name="description">
                    </div>
                    <div class="form-btns">
                        <button class="cancel-change" type="reset">Отмена</button>
                        <button class="change" type="submit">Изменить</button>
                    </div>
                </form>
            </div>
        </div>
    `;
  document.body.insertAdjacentHTML('beforeend', markup);
}
