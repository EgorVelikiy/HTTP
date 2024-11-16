export default function createField(container) {
  const markup = `
        <div class="container">
            <button class="add-ticket">Добавить тикет</button>
            <div class="task-list"></div>
            <button class="show-tickets">показать все тикеты</button>
        </div>
        <div class="form-widget hidden">
            <div class="container-form">
                <span class="title">Добавить Тикет</span>
                    <form class="ticket-creatior" name="from1" method="POST">
                        <div class="form-group">
                            <label for="label-name">Краткое описание</label>
                            <input class="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="label-description">Подробное описание</label>
                            <input class="description" name="description">
                        </div>
                        <div class="form-btns">
                            <button class="cancel" type="reset">Отмена</button>
                            <button class="create" type="submit">OK</button>
                        </div>
                    </form>
            </div>
        </div>
    `;
  container.innerHTML = markup;
}
