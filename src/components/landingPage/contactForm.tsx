import { useState } from "react"
import { motion } from "framer-motion"
import { ContactFormData } from "../../models/contactFormData"

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void
  onClose: () => void
}

export function ContactForm({ onSubmit, onClose }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    notes: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Installation location is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      console.log("Form submitted with data:", formData)
      onSubmit(formData)
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-gray-800 border ${
            errors.name ? "border-red-500" : "border-gray-700"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36916a] text-white`}
          placeholder="Your name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-gray-800 border ${
            errors.email ? "border-red-500" : "border-gray-700"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36916a] text-white`}
          placeholder="your.email@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36916a] text-white"
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
          Installation Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-gray-800 border ${
            errors.location ? "border-red-500" : "border-gray-700"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36916a] text-white`}
          placeholder="City, State or Full Address"
        />
        {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
          Additional Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36916a] text-white resize-none"
          placeholder="Tell us about your project or specific requirements..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <motion.button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-[#36916a] to-emerald-500 rounded-lg text-white font-medium hover:from-[#2d7a57] hover:to-emerald-600 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Submit Request
        </motion.button>
      </div>
    </form>
  )
}
