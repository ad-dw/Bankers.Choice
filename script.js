"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const scrollBtn = document.querySelector(".btn--scroll-to");
const headerElement = document.querySelector(".header");
const navElement = document.querySelector("nav");
const navLinksContainer = document.querySelector(".nav__links");

const operationsTabContainer = document.querySelector(
  ".operations__tab-container"
);

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const scrollToSection = function () {
  const sectionElement = document.querySelector("#section--1");
  sectionElement?.scrollIntoView({ behavior: "smooth" });
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

scrollBtn.addEventListener("click", scrollToSection);

const handleScroll = function (entries) {
  let entry = entries[0];
  if (entry.isIntersecting) navElement.classList.remove("sticky");
  else navElement.classList.add("sticky");
};

const headerObserver = new IntersectionObserver(handleScroll, {
  root: null,
  rootMargin: `-${navElement.getBoundingClientRect().height}px`,
  threshold: 0,
});

headerObserver.observe(headerElement);

const handleTabClick = (e) => {
  let target = e.target.closest(".operations__tab");
  let tabElements = document.querySelectorAll(".operations__tab");
  let tabContent = document.querySelectorAll(".operations__content");
  let activeTab = document.querySelector(
    `.operations__content--${target.dataset.tab}`
  );
  tabElements.forEach((tab) => tab.classList.remove("operations__tab--active"));
  target.classList.add("operations__tab--active");
  tabContent.forEach((tabContent) =>
    tabContent.classList.remove("operations__content--active")
  );
  activeTab.classList.add("operations__content--active");
};

const handleHoverAndOut = function (e, opacity) {
  let target = e.target;
  if (!target.classList.contains("nav__link")) return;
  let targetSiblings = navLinksContainer.querySelectorAll(".nav__link");
  targetSiblings.forEach((sibling) => {
    if (sibling !== target) {
      sibling.style.opacity = opacity;
    }
  });
};

operationsTabContainer.addEventListener("click", handleTabClick);
navLinksContainer.addEventListener("mouseover", (e) =>
  handleHoverAndOut(e, 0.5)
);
navLinksContainer.addEventListener("mouseout", (e) => handleHoverAndOut(e, 1));
