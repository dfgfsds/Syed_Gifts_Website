import porcess1 from "../../public/img/process1.jpeg"
import porcess2 from "../../public/img/process2.jpeg"
import porcess3 from "../../public/img/process3.jpeg"
import porcess4 from "../../public/img/process4.jpeg"
import porcess5 from "../../public/img/process5.webp"

export default function OurProcess() {
  const steps = [
    {
      id: 1,
      title: "Select Your Gift",
      description: "Browse our curated collection for every occasion.",
      image: porcess1
    },
    {
      id: 2,
      title: "Personalize It",
      description: "Add names, dates, or messages — our team brings your idea to life.",
      image: porcess2
    },
    {
      id: 3,
      title: "Quality Crafting",
      description: "Each gift is handmade or printed with premium materials.",
      image: porcess3
    },
    {
      id: 4,
      title: "Beautiful Packaging",
      description: "Wrapped with elegance — ready to impress.",
      image: porcess4
    },
    {
      id: 5,
      title: "On-Time Delivery",
      description: "Delivered safely and promptly to your loved ones.",
      image: porcess5
    }
  ];

  return (
    <section className="py-20 bg-secBgImage bg-cover bg-center bg-no-repeat w-full">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl text-[#3529d9] font-bold mb-4">Our Process</h2>
          <p className="text-black max-w-2xl mx-auto ">
            Crafted with Care from Start to Finish.
          </p>
        </div>

        <div className="flex flex-col space-y-24">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className={`w-full md:w-1/2 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl">
                    <img
                      src={step.image?.src}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-[#4D8B31] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold z-10">
                    {step.id}
                  </div>
                  <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#4D8B31] rounded-xl z-0"></div>
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold mb-4 text-[#3529d9]">{step.title}</h3>
                <p className="text-lg text-black">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}