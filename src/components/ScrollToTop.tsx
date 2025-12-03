import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Custom smooth scroll with easing animation
    const scrollToTop = () => {
      const startPosition = window.pageYOffset;
      const duration = 800; // ms
      let startTime: number | null = null;

      // Easing function for smooth animation
      const easeOutCubic = (t: number): number => {
        return 1 - Math.pow(1 - t, 3);
      };

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        
        window.scrollTo(0, startPosition * (1 - easedProgress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    };

    scrollToTop();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
