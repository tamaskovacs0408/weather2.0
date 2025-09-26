import { useState, useRef, useCallback } from "react";
import { type AccordionProps } from "../type";
import "../styles/Accordion.scss";

function Accordion({
  children,
  date,
  tempMin,
  tempMax,
  className = "",
  defaultOpen = false,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    const el = panelRef.current;
    if (!el) return;

    const newState = !isOpen;

    if (newState) {
      el.style.height = "0px";
      el.offsetHeight;
      el.style.height = el.scrollHeight + "px";

      const handleTransitionEnd = () => {
        el.style.height = "auto";
        el.removeEventListener("transitionend", handleTransitionEnd);
      };
      el.addEventListener("transitionend", handleTransitionEnd);
    } else {
      el.style.height = el.scrollHeight + "px";
      el.offsetHeight;
      el.style.height = "0px";
    }

    setIsOpen(newState);
  }, [isOpen]);

  return (
    <div className={`accordion ${className}`}>
      <button
        type='button'
        onClick={handleToggle}
        className={`accordion__trigger ${
          isOpen ? "accordion__trigger--open" : ""
        }`}
        aria-expanded={isOpen}
        aria-controls='accordion-panel'
      >
        <h2>{date.replaceAll("-", ".")}</h2>
        <div className='temp-wrapper'>
          <span>{tempMin}°C</span>/<span>{tempMax}°C</span>
        </div>
      </button>
      <div
        id='accordion-panel'
        ref={panelRef}
        className={`accordion__panel ${
          isOpen ? "accordion__panel--open" : "accordion__panel--closed"
        }`}
        aria-hidden={!isOpen}
      >
        <div className='accordion__content'>{children}</div>
      </div>
    </div>
  );
}

export default Accordion;
