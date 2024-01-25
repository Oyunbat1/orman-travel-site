import Axios from "axios";
class ClientReport {
  constructor() {
    this.injectHTML();
    this.from = document.querySelector(".client-report__form");
    this.field = document.querySelector(".client-report__input");
    this.contentReport = document.querySelector(
      ".client-report__content-report"
    );
    this.events();
  }

  events() {
    this.from.addEventListener("submit", (e) => {
      e.preventDefault();
      this.sendRequest();
    });
  }

  sendRequest() {
    //cloud-functiontoi holbogdoh gol code. npm install axios
    Axios.post(
      "https://delightful-medovik-ab643b.netlify.app/.netlify/functions/cloud-function",
      { password: this.field.value }
    ) //postman ii link
      .then((response) => {
        this.from.remove();
        this.contentReport.innerHTML = response.data;
      })
      .catch(() => {
        this.contentReport.innerHTML = `<p class="client-report__error"Та 2-ын  оруулсан нууц үг буруу байна шүү дээ ээ хөөрхий .</p>`;
        this.field.value = "";
        this.field.focus();
      });
  }

  injectHTML() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="client-report">
      <div class="wrapper wrapper--medium">
        <h2 class="section-title section-title--blue">
          Хэрэглэгчдийн тусгай хуудас
        </h2>
        <form action="" class="client-report__form">
          <input
            type="text "
            class="client-report__input"
            placeholder="Нууц үгээ бичээрэй"
          />
          <button class="btn--orange">Нэвтрэх</button>
        </form>
        <div class="client-report__content-report"></div>
      </div>
    </div>
    `
    );
  }
}

export default ClientReport;
