import Image from "next/image"

export default function DoctorCard({name, experience, fee, pets,}) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl max-w-2xl md:max-w-3xl">
      {/* Image */}
      <div className="w-70 h-60 bg-gray-200 flex items-center justify-center">
        <Image
          src="/placeholder.png" // replace with your actual image
          alt="Doctor"
          width={300}
          height={300}
          className="object-cover h-full w-full"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{name}</h2>
          <span className="text-black-600 font-medium">Fee</span>
        </div>

        <div className="flex justify-between text-gray-600 text-sm mt-1">
          <span>Experience: {experience}</span>
          <span className="font-medium">{fee}</span>
        </div>

        <div className="mt-3">
          <p className="font-semibold text-sm">Pets Treated:</p>
          <p className="text-gray-700 text-sm">
            {pets.join(", ")}
          </p>
        </div>
      </div>
    </div>
  )
}

