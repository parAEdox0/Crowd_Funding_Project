import { useEffect, useRef } from "react";
import gsap from "gsap";

const Hero = () => {
  const heroRightRef = useRef(null);
  const heroImageRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      heroImageRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    )
      .fromTo(
        heroRightRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        headingRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power3.out" },
        "+=0.1"
      )
      .fromTo(
        paragraphRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power3.out" },
        "+=0.1"
      )
      .fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.8, x: 20 },
        { opacity: 1, scale: 1, x: 0, duration: 0.2, ease: "back.out(1.7)" },
        "+=0.1"
      );
  }, []);

  return (
    <section
      id="Hero"
      className="bg-cover bg-center flex flex-col md:flex-row pt-14 sm:pt-16 md:pt-20 lg:pt-[44px] px-4 sm:px-6 md:px-10 lg:px-16 min-h-[100vh] pb-6"
    >
      <div
        ref={heroImageRef}
        id="hero-left"
        className="w-full pt-4 md:w-1/2 flex justify-center md:justify-start mb-6 md:mb-0"
      >
        <img
          src="background1.png"
          className="w-full max-w-md md:max-w-full lg-h-[70vh] h-auto object-cover"
          alt="Hero Background"
        />
      </div>

      <div
        id="hero-right"
        ref={heroRightRef}
        className="w-full md:w-1/2 flex flex-col justify-center items-center text-center"
      >
        <h1
          ref={headingRef}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase leading-tight mb-4 md:mb-6 px-4"
        >
          The Best Ideas Start with You Make Them Happen!
        </h1>
        <p
          ref={paragraphRef}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-black mb-6 md:mb-8 max-w-lg px-4"
        >
          From passion projects to life-changing ventures, fund what matters
          most—whether it’s personal causes, creative ideas, or equity-based
          growth. Support, invest, and get rewarded while making an impact!
        </p>
        <button
          ref={buttonRef}
          className="bg-[#FFD37A] w-40 sm:w-48 md:w-56 h-12 rounded-full text-sm md:text-base font-semibold hover:bg-[#ffca5a] transition"
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;
