import { motion } from "framer-motion"
import { Shield } from "lucide-react"

export function FooterSection() {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <motion.footer
      className="bg-gray-900 py-12 border-t border-gray-800"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          style={{ perspective: "1000px" }}
        >
          <motion.div
            className="col-span-1 md:col-span-2"
            variants={{
              hidden: { opacity: 0, rotateX: -45 },
              visible: { opacity: 1, rotateX: 0 },
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <motion.div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                whileHover={{
                  rotateY: 360,
                  rotateX: 180,
                }}
                transition={{ duration: 0.8 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <img src="/img/logos/SmartHiveLogoSml.png" alt="SmartHive logo" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#36916a] to-emerald-400 bg-clip-text text-transparent">
                SmartHive
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Leading provider of smart home automation solutions. We design, install, and maintain intelligent systems
              that make your life easier, safer, and more efficient.
            </p>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, rotateY: -45 },
              visible: { opacity: 1, rotateY: 0 },
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-2 text-gray-400">
              {["Security Systems", "Smart Lighting", "Climate Control", "Automated Cleaning", "Remote Control"].map(
                (service, index) => (
                  <motion.li
                    key={service}
                    initial={{ opacity: 0, x: -20, rotateX: -45 }}
                    whileInView={{ opacity: 1, x: 0, rotateX: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                      x: 5,
                      color: "#36916a",
                      rotateY: 5,
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {service}
                  </motion.li>
                ),
              )}
            </ul>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, rotateY: 45 },
              visible: { opacity: 1, rotateY: 0 },
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              {[
                "Phone: 955 555 555",
                "Email: info@smarthive.pt",
                "Address: Rua Direita nº165",
                "Barcelos, Braga 4750-111",
              ].map((contact, index) => (
                <motion.li
                  key={contact}
                  initial={{ opacity: 0, x: -20, rotateX: 45 }}
                  whileInView={{ opacity: 1, x: 0, rotateX: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    x: 5,
                    rotateY: -5,
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {contact}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
          initial={{ opacity: 0, rotateX: 90 }}
          whileInView={{ opacity: 1, rotateX: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <p>&copy; 2025 SmartHive. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  )
}
