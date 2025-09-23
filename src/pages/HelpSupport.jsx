import React, { useState } from "react";

export default function HelpSupport() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Add form submission logic here (API call, etc.)
  };

  return (<>
    <div className="flex flex-col min-h-screen">
      {/* Main Section */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-yellow-400 pl-2">
          Contact Us
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="border p-3 rounded w-full"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="border p-3 rounded w-full"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-3 rounded w-full"
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="border p-3 rounded w-full"
            required
          />

          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            className="border p-3 rounded w-full md:col-span-2 h-40"
            required
          ></textarea>

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded md:col-span-2 transition duration-300"
          >
            Send Message
          </button>
        </form>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-bold text-lg">Address</p>
          <p className="text-sm md:text-base leading-relaxed">
            TKR Engineering College <br />
            TKRCET, Meerpet, Balapur, Saroornagar, <br />
            Hyderabad - 500097, Telangana.
          </p>
          <p className="mt-2 text-sm md:text-base">Phone: 9949665436</p>
          <p className="text-sm md:text-base">Email: info@tkrcet.ac.in</p>
        </div>
      </footer>
    </div>
    </>
  );
}
