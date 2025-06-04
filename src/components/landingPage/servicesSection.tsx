import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text3D, Box } from "@react-three/drei"
import { Suspense } from "react"
import { Shield, Lightbulb, Thermometer, Sparkles, Smartphone } from "lucide-react"
import type * as THREE from "three"


function ServiceIcon3D({ icon, position, color }: { icon: string; position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.5
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1
    }
  })

  return (
    <group ref={meshRef} position={position}>
      <Box args={[0.4, 0.4, 0.1]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </Box>
      <Text3D font="/fonts/Geist_Bold.json" size={0.1} height={0.02} position={[-0.05, -0.05, 0.06]}>
        {icon}
        <meshStandardMaterial color="white" />
      </Text3D>
    </group>
  )
}

export function ServicesSection() {
  const servicesRef = useRef(null)
  const servicesIsInView = useInView(servicesRef, { once: true })

  const services = [
    {
      icon: Shield,
      title: "Security",
      description:
        "Advanced security systems with smart cameras, sensors, and automated alerts to keep your property safe 24/7.",
      gradient: "from-red-500 to-pink-500",
      color: "#ef4444",
    },
    {
      icon: Lightbulb,
      title: "Lighting",
      description:
        "Intelligent lighting solutions that adapt to your lifestyle, save energy, and create the perfect ambiance.",
      gradient: "from-yellow-500 to-orange-500",
      color: "#f59e0b",
    },
    {
      icon: Thermometer,
      title: "Temperature",
      description: "Smart climate control systems that maintain optimal comfort while maximizing energy efficiency.",
      gradient: "from-blue-500 to-cyan-500",
      color: "#3b82f6",
    },
    {
      icon: Sparkles,
      title: "Cleaning",
      description: "Automated cleaning solutions including smart vacuums, air purifiers, and maintenance scheduling.",
      gradient: "from-purple-500 to-indigo-500",
      color: "#8b5cf6",
    },
    {
      icon: Smartphone,
      title: "Remote Control",
      description: "Centralized control of all your smart home devices through intuitive mobile and voice interfaces.",
      gradient: "from-green-500 to-teal-500",
      color: "#10b981",
    },
  ]

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      rotateX: -15,
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
    <section id="services" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative" ref={servicesRef}>
      {/* 3D Background for Services */}
        <div className="absolute inset-0 opacity-30">
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
                <Suspense fallback={null}>
                <ambientLight intensity={0.2} />
                <pointLight position={[5, 5, 5]} intensity={0.5} color="#36916a" />

                {services.map((service, index) => (
                    <ServiceIcon3D
                        key={service.title}
                        icon="●"
                        position={[(index - 2) * 2, Math.sin(index) * 2, -3]}
                        color={service.color}
                    />
                ))}
                </Suspense>
            </Canvas>
        </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={servicesIsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ scale: 0.5, opacity: 0, rotateX: -90 }}
            animate={servicesIsInView ? { scale: 1, opacity: 1, rotateX: 0 } : { scale: 0.5, opacity: 0, rotateX: -90 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <span className="bg-gradient-to-r from-[#36916a] to-emerald-400 bg-clip-text text-transparent">
              Our Expertise
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, z: -50 }}
            animate={servicesIsInView ? { opacity: 1, z: 0 } : { opacity: 0, z: -50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We specialize in five key areas of smart home automation, delivering comprehensive solutions tailored to
            your lifestyle and needs.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate={servicesIsInView ? "visible" : "hidden"}
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
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-[#36916a]/50 transition-all duration-500 cursor-pointer"
              variants={cardVariants}
              whileHover="hover"
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              <motion.div
                className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-6`}
                whileHover={{
                  rotateY: 360,
                  rotateX: 180,
                  scale: 1.1,
                }}
                transition={{ duration: 0.8 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <service.icon className="w-8 h-8 text-white" />
              </motion.div>

              <motion.h3
                className="text-2xl font-bold mb-4 group-hover:text-[#36916a] transition-colors"
                initial={{ opacity: 0, rotateX: -90 }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {service.title}
              </motion.h3>

              <motion.p
                className="text-gray-300 leading-relaxed"
                initial={{ opacity: 0, z: -20 }}
                animate={{ opacity: 1, z: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {service.description}
              </motion.p>

              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#36916a]/5 to-emerald-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0, rotateX: 90 }}
                whileHover={{ scale: 1, rotateX: 0 }}
                transition={{ duration: 0.3 }}
                style={{ transformStyle: "preserve-3d" }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
