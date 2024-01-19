import "../styles/styles.css";
import MobileMenu from "./modules/MobileMenu";
import RevealOnScroll from "./modules/RevealOnScroll";
import "lazysizes";
import StickyHeader from "./modules/StickyHeader";

new StickyHeader();

let RevealOnScrollIn = new RevealOnScroll(
  document.querySelectorAll(".feature-items"),
  75
);

new RevealOnScroll(document.querySelectorAll(".testimonials"), 50);

new MobileMenu();
let modal;

document.querySelectorAll(".open-modal").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    if (typeof modal == "undefined") {
      import(/* webpackChunckName : "modal" */ "./modules/Modal")
        .then((x) => {
          modal = new x.default();
          setTimeout(() => modal.openModal(), 20);
        })
        .catch(() => console.log("file-iig duudhad aldaa garlaa"));
    } else {
      modal.openModal();
    }
  });
});

if (module.hot) {
  module.hot.accept();
}
