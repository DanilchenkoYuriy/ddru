export function OrderSteps() {
  return (
    <section className="container order-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">07 / Как заказать</p>
          <h2>От выбора — к тренировке.</h2>
        </div>
        <p>
          Детали согласуем лично.
          <br />
          На каждом шаге можно задать вопрос.
        </p>
      </div>
      <ol className="order-steps">
        {[
          ["Выбор", "Модель или подбор под задачу"],
          ["Заявка", "Ваши пожелания и состав группы"],
          ["Общение", "Наличие, комплект и доставка"],
          ["Счёт / договор", "Согласованные условия"],
          ["Отправка", "Инвентарь едет к вам"],
        ].map(([title, description], index) => (
          <li key={title}>
            <span>0{index + 1}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
