import { useEffect, useRef, useState } from 'react';

const ScrollFloat = ({ 
  children, 
  animationDuration = 1, 
  ease = 'back.inOut(2)', 
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03 
}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-${Math.round(animationDuration * 1000)} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{
        transitionDuration: `${animationDuration}s`,
        transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollFloat;

