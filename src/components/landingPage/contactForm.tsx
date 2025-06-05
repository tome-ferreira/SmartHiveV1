import { useState } from "react"
import { motion } from "framer-motion"
import { ContactFormData } from "../../models/contactFormData"
import { usePostContactFormHook } from "../../hooks/FormsHooks"
import { useNotifications } from "@toolpad/core"

interface ContactFormProps {
  onClose: () => void
}

export function ContactForm({ onClose }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    notes: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const { mutateAsync: submitForm } = usePostContactFormHook()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      await submitForm(formData)
      setSubmitted(true)

      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }

  return submitted ? (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="flex flex-col items-center justify-center p-6 bg-green-700 rounded-lg text-white"
    >
      <svg
        className="w-12 h-12 mb-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <p className="text-lg font-semibold">Submission Successful!</p>
      <p className="text-sm text-green-100 mt-1">We'll be in touch shortly.</p>
    </motion.div>
  ) : (
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
