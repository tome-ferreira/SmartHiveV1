import { motion } from "framer-motion"

export function CTASection() {
  return (
    <motion.section
      id="contact"
      className="py-20 bg-gradient-to-r from-[#36916a] to-emerald-500 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      style={{ perspective: "1000px" }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-4xl md:text-6xl font-bold mb-6 text-white"
          initial={{ scale: 0.5, opacity: 0, rotateX: -90 }}
          whileInView={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ transformStyle: "preserve-3d" }}
        >
          Ready to Get Started?
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed"
          initial={{ y: 50, opacity: 0, rotateX: 45 }}
          whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          style={{ transformStyle: "preserve-3d" }}
        >
          Transform your space with intelligent automation. Contact us today for a free consultation and discover how
          smart home technology can enhance your lifestyle.
        </motion.p>

        <motion.div
          className="flex justify-center items-center"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.button
            className="bg-white text-[#36916a] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300"
            whileHover={{
              scale: 1.05,
              rotateX: 10,
              rotateY: 5,
              boxShadow: "0 20px 40px rgba(255, 255, 255, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            Schedule Consultation
          </motion.button>
        </motion.div>
      </div>

      {/* 3D Decorative elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          rotateX: [0, 180, 360],
          rotateY: [0, 180, 360],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ transformStyle: "preserve-3d" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full"
        animate={{
          y: [-20, 20, -20],
          opacity: [0.1, 0.3, 0.1],
          rotateZ: [0, 360],
          rotateX: [0, 180],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ transformStyle: "preserve-3d" }}
      />
    </motion.section>
  )
}
