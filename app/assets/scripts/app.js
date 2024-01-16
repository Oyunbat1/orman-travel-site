import "../styles/styles.css";
import MobileMenu from "./modules/MobileMenu";
import RevealOnScroll from "./modules/RevealOnScroll";

new RevealOnScroll(document.querySelectorAll(".feature-items"), 75);
new RevealOnScroll(document.querySelectorAll(".testimonials"), 50);

let MobileMenuIn = new MobileMenu();

if (module.hot) {
  module.hot.accept();
}
