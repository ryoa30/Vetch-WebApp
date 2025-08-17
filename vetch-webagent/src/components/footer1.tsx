import { FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="flex flex-col">
      {/* Top Section */}
      <div className="bg-[#B3D8A8] px-8 py-10 flex flex-col md:flex-row justify-between items-start">
        {/* Logo + Tagline */}
        <div className="mb-8 md:mb-0 max-w-xs">
          <div className="flex items-center mb-2">
            <img src="/images/logo.png" alt="Vetch Logo" className="w-10 h-10 mr-2" />
            <h2 className="text-2xl font-bold text-[#3D8D7A]">Vetch</h2>
          </div>
          <p className="text-[#3D8D7A] italic">
            Caring for Your Pets, <br /> Anytime, Anywhere
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-[#3D8D7A]">
          <nav>
            <h3 className="font-bold text-blue-700 mb-2">For Pet Parents</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Consultation</a></li>
              <li><a href="#" className="hover:underline">Homecare</a></li>
            </ul>
          </nav>

          <nav>
            <h3 className="font-bold text-blue-700 mb-2">For Vets</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Register as Vets</a></li>
            </ul>
          </nav>

          <nav>
            <h3 className="font-bold text-blue-700 mb-2">Blog</h3>
          </nav>

          <nav>
            <h3 className="font-bold text-blue-700 mb-2">About Us</h3>
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-[#3D8D7A] text-white py-6 text-center">
        <h3 className="font-bold mb-3">Our Socials</h3>
        <div className="flex justify-center space-x-6 text-xl">
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaFacebook /></a>
          <a href="#"><FaLinkedin /></a>
          <a href="#"><FaYoutube /></a>
        </div>
      </div>
    </footer>
  );
}

