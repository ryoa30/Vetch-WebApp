import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="bg-[#F5F5F5] dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="bg-[#A3D1C6] dark:bg-teal-800 flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 gap-8">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
            Caring for Your Pets, <br />
            <span className="italic font-normal text-gray-700 dark:text-gray-300">
              Anytime, Anywhere
            </span>
          </h1>
          <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-md">
            Connect with certified veterinarians for expert advice and treatment
            for your pet&apos;s health.
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="/img/about-us.png"
            alt="Pet Hero"
            width={300}
            height={300}
            className="rounded-lg"
          />
        </div>
      </section>

      {/* About Us */}
      <section className="bg-[#EAF4F2] dark:bg-gray-800 flex flex-col md:flex-row items-center px-6 md:px-20 py-12 gap-8">
        <div className="flex-1 flex justify-center">
          <Image
            src="/img/about-us.png"
            alt="About Us"
            width={250}
            height={250}
            className="rounded-lg"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            About Us
          </h2>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Vetch is an innovative e-application developed by Computer Science
            students Aryo Prasetyo, Gabriel Setroeno Gunawan, and Lorensius
            Bernard Gani from Binus University, Jakarta, in 2025. It is designed
            as a web-based platform for booking veterinary services.
          </p>
        </div>
      </section>

      {/* Our Vision */}
      <section className="bg-[#A3D1C6] dark:bg-teal-800 flex flex-col md:flex-row items-center px-6 md:px-20 py-12 gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Our Vision
          </h2>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Vetch aims to address the significant challenges in Indonesian
            veterinary care, including a shortage of veterinarians (only around
            15,500 available against an estimated need for 50,000 in 2023), and
            difficult access to facilities, which results in only 2.9% of pets
            visiting a vet. <br />
            <br />
            We envision Vetch as an innovative platform that simplifies the
            process of finding, booking, and consulting with veterinarians
            efficiently, significantly easing pet owners’ access to vital
            services and enhancing the overall quality of animal care.
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="/img/about-us.png"
            alt="Our Vision"
            width={250}
            height={250}
            className="rounded-lg"
          />
        </div>
      </section>

      {/* Our Mission */}
      <section className="bg-[#EAF4F2] dark:bg-gray-800 flex flex-col md:flex-row items-center px-6 md:px-20 py-12 gap-8">
        <div className="flex-1 flex justify-center">
          <Image
            src="/img/about-us.png"
            alt="Our Mission"
            width={250}
            height={250}
            className="rounded-lg"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Our Mission
          </h2>
          <ul className="list-disc ml-5 mt-4 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <b>Enhancing Accessibility and Convenience</b> - Providing pet
              owners with easy and practical access to veterinary health
              services anytime and anywhere through a digital application.
            </li>
            <li>
              <b>Facilitating Comprehensive Pet Health Management</b> - Our goal
              is to improve access and simplify the tracking of animal health
              information such as vaccination schedules, treatments, and
              behavioral changes, by providing digital medical records to ensure
              accurate diagnosis and effective monitoring.
            </li>
            <li>
              <b>Empowering Veterinarians and Building Trust</b> - Assisting
              veterinarians in managing practice schedules efficiently,
              accepting and processing service bookings, and supporting their
              work with ongoing conditions, enabling them to reach more owners
              and run more organized services.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
