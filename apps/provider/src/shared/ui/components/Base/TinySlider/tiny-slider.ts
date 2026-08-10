import { tns } from "tiny-slider/src/tiny-slider";
import { TinySliderElement, TinySliderProps } from "./index";

const init = (el: TinySliderElement, props: TinySliderProps) => {
  el.tns = tns({
    container: el,
    slideBy: "page",
    mouseDrag: true,
    autoplay: true,
    controls: false,
    nav: false,
    speed: 500,
    ...props.options,
  });
};

const restoreAttributes = (
  target: HTMLElement,
  source: HTMLElement,
) => {
  for (const attribute of Array.from(target.attributes)) {
    target.removeAttribute(attribute.name);
  }
  for (const attribute of Array.from(source.attributes)) {
    target.setAttribute(attribute.name, attribute.value);
  }
};

const destroy = (el: TinySliderElement) => {
  const instance = el.tns;
  if (!instance || instance.version === null) return;

  const outerWrapper = el.closest(".tns-outer");
  const parent = outerWrapper?.parentNode;
  if (!outerWrapper || !parent) {
    instance.destroy();
    el.tns = undefined;
    return;
  }

  const marker = document.createComment("tiny-slider");
  parent.insertBefore(marker, outerWrapper);
  instance.destroy();

  const restoredElement = marker.nextElementSibling;
  if (restoredElement instanceof HTMLElement && restoredElement !== el) {
    restoreAttributes(el, restoredElement);

    const originalSlides = Array.from(el.children).filter(
      (slide) => !slide.classList.contains("tns-slide-cloned"),
    );
    const restoredSlides = Array.from(restoredElement.children);
    originalSlides.forEach((slide, index) => {
      const restoredSlide = restoredSlides[index];
      if (
        slide instanceof HTMLElement &&
        restoredSlide instanceof HTMLElement
      ) {
        restoreAttributes(slide, restoredSlide);
      }
    });
    for (const clonedSlide of Array.from(
      el.querySelectorAll(":scope > .tns-slide-cloned"),
    )) {
      clonedSlide.remove();
    }

    restoredElement.replaceWith(el);
  }

  marker.remove();
  el.tns = undefined;
};

export { destroy, init };
