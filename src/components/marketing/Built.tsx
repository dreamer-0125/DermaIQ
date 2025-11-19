import { PersonStanding, FileText, Settings, SquareCode } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const Built = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative rounded-2xl m-8 py-8 sm:py-12 lg:py-12" >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center rounded-2xl z-0 filter dark:brightness-50"
      ></div>

      {/* Overlay: provides dark opacity effect */}
      <div className="absolute inset-0 bg-black opacity-50 rounded-2xl z-10"></div>

      {/* Content: above background, unaffected by dark mode filters */}
      <div className={`relative flex flex-col z-20 items-center text-white dark:text-white mb-8 transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <h1 className="w-full sm:w-1/2 text-center text-3xl sm:text-4xl lg:text-[42px] font-bold mb-4 sm:mb-6 leading-loose lg:leading-normal">
          Built for Healthcare Organizations 
          <span className="text-[#3681DE]"> Like Yours!</span>
        </h1>
        <p className="w-full sm:w-1/2 mx-2 text-center text-[#304460] text-xl sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed text-white dark:text-white">
          From small clinics to large health systems, <span className = "font-bold">DermaIQ adapts to your
          organization's unique needs and workflows.</span> Our co-design approach
          ensures seamless integration with your existing processes.        
        </p>
        <div className={`grid grid-cols-1 sm:grid-cols-4 sm:gap-3 text-xs sm:text-sm mx-8 mt-8 gap-4 transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '0.2s' }}>
          <div className="flex flex-col items-center text-white border shadow-lg p-4 text-center rounded-2xl border-white cursor-pointer bg-[rgba(255,255,255,0.1)] gap-2 hover:brightness-110 hover:bg-[rgba(255,255,255,0.15)] transition duration-300 ease-in-out">       
            <FileText className="mb-2 w-12 h-12 text-black mr-2 sm:mr-3 flex-shrink-0 text-white font-bold " />
            <span className = "text-xl sm:text-2xl">Customizable to your care protocols</span>
          </div>
          <div className="flex flex-col items-center text-white border shadow-lg p-4 text-center rounded-2xl border-white cursor-pointer bg-[rgba(255,255,255,0.1)] gap-2 hover:brightness-110 hover:bg-[rgba(255,255,255,0.15)] transition duration-300 ease-in-out">       
            <Settings className="mb-2 w-12 h-12 text-black mr-2 sm:mr-3 flex-shrink-0 text-white font-bold " />
            <span className = "text-xl sm:text-2xl">Integrates with existing EMR systems</span>
          </div>
          <div className="flex flex-col items-center text-white border shadow-lg p-4 text-center rounded-2xl border-white cursor-pointer bg-[rgba(255,255,255,0.1)] gap-2 hover:brightness-110 hover:bg-[rgba(255,255,255,0.15)] transition duration-300 ease-in-out">       
            <SquareCode className="mb-2 w-12 h-12 text-black mr-2 sm:mr-3 flex-shrink-0 text-white font-bold " />
            <span className = "text-xl sm:text-2xl">Dedicated implementation support</span>
          </div>
          <div className="flex flex-col items-center text-white border shadow-lg p-4 text-center rounded-2xl border-white cursor-pointer bg-[rgba(255,255,255,0.1)] gap-2 hover:brightness-110 hover:bg-[rgba(255,255,255,0.15)] transition duration-300 ease-in-out">       
            <PersonStanding className="mb-2 w-12 h-12 text-black mr-2 sm:mr-3 flex-shrink-0 text-white font-bold " />
            <span className = "text-xl sm:text-2xl">Ongoing clinical and technical support</span>
          </div>
        </div>
      </div>
    </section>

  );
};

export default Built;
