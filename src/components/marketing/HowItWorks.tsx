import { useState, useRef, useCallback } from 'react';

const HowItWorks = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      title: "",
      description: "",
    },
    {
      title: "Capture",
      description: "Take a wound photo with a ruler or calibration sticker visible for accurate measurement.",
    },
    {
      title: "Analyze",
      description: "AI automatically measures wound dimensions and area with clinical-grade precision.",
    },
    {
      title: "Recommend",
      description: "Treatment and billing suggestions tailored to the specific wound type and condition.",
    },
    {
      title: "Coordinate",
      description: "Share results and care plans securely with your healthcare team and patients.",
    }, {
      title: "",
      description: "",
    },

  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      // Max index is steps.length - 2 (since last item is empty)
      const maxIndex = steps.length - 2;
      return prevIndex >= maxIndex ? maxIndex : prevIndex + 1;
    });
  }, [steps.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      // Min index is 0 (since first item is empty)
      return prevIndex <= 1 ? 1 : prevIndex - 1;
    });
  }, [steps.length]);


  // Touch and mouse event handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const diff = startX - currentX;
    const threshold = 50; // Minimum distance to trigger slide change

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide(); // Swipe left
      } else {
        prevSlide(); // Swipe right
      }
    }

    setIsDragging(false);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };



  return (
    <section id="how-it-works" className="bg-[#F6F6F6] py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:px-8">
          <div className="text-[#B3B3B3] mb-2">
            Simple Process
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Better Strategy Meets Smarter Technology in
            <span className="text-[#3681DE]"> 4 simple steps</span>
          </h2>
          <p className="text-sm">
            Transform your wound care workflow with AI-powered precision and real collaboration — from strategy to reality in minutes, not hours.
          </p>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Navigation Buttons */}
        {/* <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button> */}

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="relative overflow-hidden rounded-2xl mt-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="flex transition-transform duration-500 ease-out relative"
            style={{
              transform: window.innerWidth >= 640 // sm breakpoint ~640px
                ? `translateX(-${(currentIndex - 1) * 33.33}%)`
                : `translateX(-${currentIndex * 100}%)`
            }}>
            {steps.map((_, stepIndex) => {
              return (
                <div
                  key={stepIndex}
                  className="w-full sm:w-1/3 flex-shrink-0 px-4 flex flex-row select-none pointer-events-none my-8"
                >
                  <div key={stepIndex} className={`py-4 text-center group relative flex-1 mx-2 select-none pointer-events-none transition-all duration-500 ease-out ${
                    currentIndex === stepIndex 
                      ? "opacity-100 shadow-lg border rounded-2xl scale-105" 
                      : "opacity-10 scale-80"
                  }`}>
                    <div className="text-3xl font-bold mb-4 select-none pointer-events-none">
                      {stepIndex > 0 && stepIndex < steps.length-1 ? `${stepIndex}. ` : ""}
                      {steps[stepIndex].title}
                    </div>
                    <div className="text-sm px-4 select-none pointer-events-none mx-8">
                      {steps[stepIndex].description}
                    </div>
                    <div className="items-center mx-auto select-none pointer-events-none">
                      {stepIndex > 0 && stepIndex < steps.length-1 && <img
                        src={`/slide/slide${stepIndex}.png`}
                        className={`h-auto w-auto transition-opacity duration-300 select-none pointer-events-none `}
                        alt={`Slide ${stepIndex}`}
                        draggable="false"
                      />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Dots Indicator */}
        {/* <div className="flex justify-center mt-8 space-x-2">
          {steps.slice(1, -1).map((_, index) => {
            const actualIndex = index + 1; // Skip the first empty slide
            return (
              <button
                key={actualIndex}
                onClick={() => goToSlide(actualIndex)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  actualIndex === currentIndex 
                    ? 'bg-blue-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${actualIndex}`}
              />
            );
          })}
        </div> */}

        {/* Slide Counter */}
        {/* <div className="text-center mt-4 text-sm text-gray-600">
          {currentIndex === 0 ? 1 : currentIndex} of {steps.length - 2}
        </div> */}
      </div>
    </section>
  );
};

export default HowItWorks;