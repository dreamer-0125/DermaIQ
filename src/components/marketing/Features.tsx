const Features = () => {

  return (
    <section id="features" className="py-16 sm:py-20 bg-[#3681DE] relative">

      <div className="hidden lg:block absolute left-0 -top-10 z-10 w-1/4">
        <img
          src="/result/cross.png"
          alt="HealthCare"
          className="h-1/4 w-auto opacity-30"
        />
      </div>

      <div className="hidden lg:block absolute right-0 -bottom-10 z-10 w-1/4">
        <img
          src="/result/cross.png"
          alt="HealthCare"
          className="h-1/4 w-auto opacity-30"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        {/* Results Section */}
        <div className="sm:mb-18 text-center leading-loose lg:leading-normal">
          <h3 className="text-4xl sm:text-5xl font-bold mb-8">
            <p className="mb-4">Proven Results Across </p>
            <p>Healthcare Organizations</p>
          </h3>
          <p className="text-center sm:text-lg ">
            Join hundreds of healthcare organizations that have transformed their wound care programs with DermaIQ.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="text-3xl sm:text-5xl font-bold mb-2">95%</div>
            <div className="text-blue-100 text-sm sm:text-base">Measurement Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-5xl font-bold mb-2">40%</div>
            <div className="text-blue-100 text-sm sm:text-base">Faster Healing</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-5xl font-bold mb-2">60%</div>
            <div className="text-blue-100 text-sm sm:text-base">Time Savings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-5xl font-bold mb-2">500+</div>
            <div className="text-blue-100 text-sm sm:text-base">Organizations</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;