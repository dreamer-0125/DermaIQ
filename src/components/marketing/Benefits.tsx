const Benefits = () => {
  const benefits = [
    {
      title: "95% Accuracy",
      description: "Clinical-grade wound measurement precision that matches or exceeds traditional methods"
    },
    {
      title: "60% Time Savings",
      description: "Streamlined documentation and automated billing reduce administrative burden"
    },
    {
      title: "HIPAA Compliant",
      description: "Enterprise-grade security ensures patient data protection and regulatory compliance"
    },
    {
      title: "Real-time Analytics",
      description: "Track healing progress and outcomes with comprehensive reporting dashboards"
    },
    {
      title: "Seamless Integration",
      description: "Works with existing EMR systems and telehealth platforms without disruption"
    },
    {
      title: "24/7 Support",
      description: "Dedicated clinical and technical support team available around the clock"
    }
  ];

  return (
    <section id="benefits" className="bg-[#F6F6F6] py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="sm:w-1/2 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12">
          <div className="text-[#B3B3B3] mb-2">
            Competitive Advantages
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Why Choose <span className="text-[#3681DE]">DermaIQ?</span>
          </h2>
          <p className="text-base text-[#304460]">
            Experience the advantages that make DermaIQ the preferred choice for healthcare professionals worldwide.
          </p>
        </div>

        <div className="flex flex-col">
          {benefits.map((benefit, index) => (
            <div key={index} className="mb-4">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">{benefit.title}</h3>
              <h3 className="mb-2 text-sm">
                {benefit.description}
              </h3>
              <hr className="border-t border-gray-300 my-4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;