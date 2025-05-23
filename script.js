"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const scrollBtn = document.querySelector(".btn--scroll-to");
const headerElement = document.querySelector(".header");
const navElement = document.querySelector("nav");
const navLinksContainer = document.querySelector(".nav__links");

const sections = document.querySelectorAll(".section");

const operationsTabContainer = document.querySelector(
  ".operations__tab-container"
);

const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const slideRightButton = document.querySelector(".slider__btn--right");
const slideLeftButton = document.querySelector(".slider__btn--left");
let currentSlide = 0;

const images = document.querySelectorAll("img[data-src]");

//Observer callbacks
const handleLazyLoad = function (entries, observer) {
  const entry = entries[0];
  const target = entry.target;
  if (entry.isIntersecting) {
    target.src = target.getAttribute("data-src");
    target.classList.remove("lazy-img");
    observer.unobserve(target);
  }
};

const handleScroll = function (entries) {
  let entry = entries[0];
  if (entry.isIntersecting) navElement.classList.remove("sticky");
  else navElement.classList.add("sticky");
};

const handleSectionScroll = function (entries, observer) {
  let entry = entries[0];
  if (entry.isIntersecting) {
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  }
};

//Observers
const imageObserver = new IntersectionObserver(handleLazyLoad, {
  root: null,
  threshold: 0,
});

const headerObserver = new IntersectionObserver(handleScroll, {
  root: null,
  rootMargin: `-${navElement.getBoundingClientRect().height}px`,
  threshold: 0,
});

let sectionObserver = new IntersectionObserver(handleSectionScroll, {
  root: null,
  threshold: 0.15,
});

//Observing elements
images.forEach((img) => imageObserver.observe(img));

headerObserver.observe(headerElement);

sections.forEach((section) => {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  modalTarget?.focus();
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

const handleKeyboardInteraction = function (event) {
  event.stopPropagation();
  if (event.key === "ArrowRight") slideRight();
  if (event.key === "ArrowLeft") slideLeft();
};

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

let modalChildren;
let modalTarget;
const openModal = function (e) {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  btnCloseModal.focus();
  modalTarget = e.target;
  modalChildren = Array.from(modal.querySelectorAll("[data-focusable]"));
};

const scrollSlide = function () {
  slides.forEach((slide, idx) => {
    slide.style.transform = `translateX(${idx * 100 - 100 * currentSlide}%)`;
  });
  slider.ariaValueNow = currentSlide + 1;
};

const scrollToSection = function () {
  const sectionElement = document.querySelector("#section--1");
  sectionElement?.scrollIntoView({ behavior: "smooth" });
};

const initSlider = function () {
  scrollSlide();
};

const slideLeft = function () {
  currentSlide = currentSlide ? currentSlide - 1 : slides.length - 1;
  scrollSlide();
};

const slideRight = function () {
  currentSlide = (currentSlide + 1) % slides.length;
  scrollSlide();
};

const trapFocus = function (event) {
  event.preventDefault();
  let nextFocusableElement;
  let index = modalChildren.findIndex((ele) => ele === event.target);
  if (event.shiftKey && event.key === "Tab") {
    if (!event.target.previousElementSibling) {
      nextFocusableElement = modalChildren.findLast(
        (ele) => ele.dataset.focusable
      );
    } else {
      nextFocusableElement = modalChildren.findLast(
        (ele, idx) => ele.dataset.focusable && idx < index
      );
    }
  } else if (event.key === "Tab") {
    nextFocusableElement = modalChildren.find(
      (ele, idx) => ele.dataset.focusable && idx > index
    );
    if (!nextFocusableElement) {
      nextFocusableElement = modalChildren.find((ele) => ele.dataset.focusable);
    }
  }
  nextFocusableElement?.focus();
};

//registering Events
const registerEvents = function () {
  for (let i = 0; i < btnsOpenModal.length; i++)
    btnsOpenModal[i].addEventListener("click", openModal);

  btnCloseModal.addEventListener("click", closeModal);
  modal.addEventListener("keydown", trapFocus);
  overlay.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  scrollBtn.addEventListener("click", scrollToSection);

  operationsTabContainer.addEventListener("click", handleTabClick);
  navLinksContainer.addEventListener("mouseover", (e) =>
    handleHoverAndOut(e, 0.5)
  );
  navLinksContainer.addEventListener("mouseout", (e) =>
    handleHoverAndOut(e, 1)
  );
  slideRightButton.addEventListener("click", slideRight);
  slideLeftButton.addEventListener("click", slideLeft);
  slider.addEventListener("keydown", handleKeyboardInteraction);
};

registerEvents();
initSlider();
