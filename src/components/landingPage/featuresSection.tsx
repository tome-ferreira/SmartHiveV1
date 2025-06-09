import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { CheckCircle } from "lucide-react"

export function FeaturesSection() {
  const featuresRef = useRef(null)
  const featuresIsInView = useInView(featuresRef, { once: true })

  const features = [
    "Professional Design & Planning",
    "Expert Installation Services",
    "24/7 Maintenance Support",
    "Custom Integration Solutions",
    "Energy Efficiency Optimization",
    "Future-Proof Technology",
  ]

  return (
    <section id="about" className="py-20 bg-gray-800" ref={featuresRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={featuresIsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-8"
              initial={{ opacity: 0, y: 50, rotateX: -45 }}
              animate={featuresIsInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: -45 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Why Choose</span>
              <br />
              <span className="bg-gradient-to-r from-[#36916a] to-emerald-400 bg-clip-text text-transparent">
                SmartHive?
              </span>
            </motion.h2>

            <motion.p
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, z: -30 }}
              animate={featuresIsInView ? { opacity: 1, z: 0 } : { opacity: 0, z: -30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              We're not just installers – we're your partners in creating the perfect smart home ecosystem. From initial
              consultation to ongoing support, we ensure your investment delivers lasting value.
            </motion.p>

            <motion.div
              className="space-y-4"
              initial="hidden"
              animate={featuresIsInView ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.6,
                  },
                },
              }}
              style={{ perspective: "1000px" }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center space-x-3"
                  variants={{
                    hidden: { opacity: 0, x: -50, rotateY: -90 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      rotateY: 0,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                      },
                    },
                  }}
                  whileHover={{
                    x: 10,
                    rotateX: 5,
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.2,
                      rotateY: 360,
                      rotateZ: 180,
                    }}
                    transition={{ duration: 0.5 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <CheckCircle className="w-6 h-6 text-[#36916a] flex-shrink-0" />
                  </motion.div>
                  <span className="text-lg text-gray-200">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 100 }}
            animate={featuresIsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ perspective: "1000px" }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-700 to-gray-800 p-8 rounded-3xl border border-gray-600"
              whileHover={{
                scale: 1.02,
                rotateX: 5,
                rotateY: 5,
              }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: "500+", label: "Homes Automated", gradient: "from-[#36916a] to-emerald-400" },
                  { number: "24/7", label: "Support Available", gradient: "from-blue-500 to-cyan-500" },
                  { number: "98%", label: "Client Satisfaction", gradient: "from-purple-500 to-pink-500" },
                  { number: "5★", label: "Average Rating", gradient: "from-orange-500 to-red-500" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className={`bg-gradient-to-r ${stat.gradient} p-6 rounded-2xl text-center`}
                    initial={{ opacity: 0, scale: 0, rotateX: -90 }}
                    animate={
                      featuresIsInView ? { opacity: 1, scale: 1, rotateX: 0 } : { opacity: 0, scale: 0, rotateX: -90 }
                    }
                    transition={{
                      duration: 0.6,
                      delay: 0.8 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{
                      scale: 1.05,
                      rotateX: 10,
                      rotateY: 10,
                      rotateZ: [0, -2, 2, 0],
                      transition: { duration: 0.5 },
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <motion.div
                      className="text-3xl font-bold"
                      initial={{ opacity: 0, rotateY: 180 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      {stat.number}
                    </motion.div>
                    <motion.div
                      className="text-sm opacity-90"
                      initial={{ opacity: 0, rotateX: 90 }}
                      animate={{ opacity: 0.9, rotateX: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                    >
                      {stat.label}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 3D Floating decoration */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-[#36916a] to-emerald-400 rounded-full opacity-20"
              animate={{
                scale: [1, 1.2, 1],
                rotateX: [0, 180, 360],
                rotateY: [0, 180, 360],
                rotateZ: [0, 90, 180],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{ transformStyle: "preserve-3d" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
