import { motion } from "framer-motion"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      content:
        "The team transformed our house into a futuristic smart home. The security system gives us peace of mind, and the automated lighting is incredible!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      content:
        "Professional installation and ongoing support have been exceptional. Our office building's smart systems have reduced energy costs by 30%.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Tech Enthusiast",
      content:
        "Finally found a company that understands both technology and user experience. The integration is seamless and the app is intuitive.",
      rating: 5,
    },
  ]

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      rotateX: -45,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      scale: 1.05,
      y: -10,
      rotateX: 5,
      rotateY: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ rotateX: -90 }}
            whileInView={{ rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <span className="bg-gradient-to-r from-[#36916a] to-emerald-400 bg-clip-text text-transparent">
              Client Success Stories
            </span>
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          style={{ perspective: "1000px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-gradient-to-br from-gray-700 to-gray-800 p-8 rounded-2xl border border-gray-600 hover:border-[#36916a]/50 transition-all duration-300"
              variants={cardVariants}
              whileHover="hover"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                className="flex mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: index * 0.2 + i * 0.1 }}
                    whileHover={{
                      scale: 1.2,
                      rotateZ: 360,
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </motion.div>
                ))}
              </motion.div>

              <motion.p
                className="text-gray-300 mb-6 leading-relaxed"
                initial={{ opacity: 0, z: -20 }}
                animate={{ opacity: 1, z: 0 }}
                transition={{ delay: index * 0.2 + 0.3 }}
              >
                "{testimonial.content}"
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20, rotateX: 45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.2 + 0.5 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-[#36916a] text-sm">{testimonial.role}</div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
