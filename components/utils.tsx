import { MutableRefObject, useEffect, useState } from "react";

export function useOnScreen<T extends HTMLElement>(
  ref: MutableRefObject<T>,
  rootMargin = "0px"
): boolean {
  const [isIntersecting, setIntersecting] = useState<boolean>(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current instanceof Element) observer?.unobserve(ref.current);
    };
  }, [ref]);

  return isIntersecting;
}

export function useOnTopScreen(minScroll: number = 300) {
  const [onTop, setOnTop] = useState<boolean>(true);
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > minScroll) {
      setOnTop(false);
    } else if (scrolled <= minScroll) {
      setOnTop(true);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
    return () => {
      window.removeEventListener("scroll", toggleVisible);
    };
  }, []);
  return onTop;
}
