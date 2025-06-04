import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, Sphere } from "@react-three/drei"
import { ArrowRight } from "lucide-react"
import { Suspense } from "react"
import type * as THREE from "three"
import { ContactFormData } from "../../models/contactFormData"
import { ContactModal } from "./contactModal"
import { ContactForm } from "./contactForm"

// 3D Components
function AnimatedSphere({
  position,
  color,
  speed = 1,
}: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[0.3]} position={position}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </Sphere>
    </Float>
  )
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 150

  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={pointsRef}>
        <bufferGeometry>
            <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]} // array and itemSize
            count={particleCount}
            />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#36916a" transparent opacity={0.6} />
    </points>
  )
}

function MouseFollowLight({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.x = (mouseX.get() / window.innerWidth) * 10 - 5
      lightRef.current.position.y = -(mouseY.get() / window.innerHeight) * 10 + 5
      lightRef.current.position.z = 2
    }
  })

  return <pointLight ref={lightRef} intensity={2} color="#36916a" distance={8} decay={2} />
}

export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const heroRef = useRef(null)
  const heroIsInView = useInView(heroRef, { once: true })

  // Mouse tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 })

  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

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

  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const handleFormSubmit = (data: ContactFormData) => {
    console.log("Contact form submitted:", data)
    // You can handle the form data here, e.g., send it to your API
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" ref={heroRef}>
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <Suspense fallback={null}>
            <Environment preset="night" />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={0.8} color="#36916a" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />

            {/* Mouse-following light */}
            <MouseFollowLight mouseX={smoothMouseX} mouseY={smoothMouseY} />

            <ParticleField />

            <AnimatedSphere position={[-4, 2, -2]} color="#36916a" speed={0.5} />
            <AnimatedSphere position={[4, -1, -1]} color="#10b981" speed={0.8} />
            <AnimatedSphere position={[0, 3, -3]} color="#3b82f6" speed={0.3} />
            <AnimatedSphere position={[-2, -2, -2]} color="#f59e0b" speed={0.6} />
            <AnimatedSphere position={[3, 2, -4]} color="#8b5cf6" speed={0.4} />
          </Suspense>
        </Canvas>
      </div>

      {/* Enhanced Mouse Light Effect Overlay */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${smoothMouseX}px ${smoothMouseY}px, rgba(54, 145, 106, 0.15), transparent 40%)`,
        }}
      />

      {/* Secondary light effect */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${smoothMouseX}px ${smoothMouseY}px, rgba(16, 185, 129, 0.1), transparent 60%)`,
        }}
      />

      {/* Tertiary glow effect */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `radial-gradient(200px circle at ${smoothMouseX}px ${smoothMouseY}px, rgba(54, 145, 106, 0.2), transparent 80%)`,
        }}
      />

      {/* Animated Background Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/70 to-gray-900/90 z-15"
        style={{ y: backgroundY }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#36916a]/10 to-emerald-400/10"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(54, 145, 106, 0.1), rgba(16, 185, 129, 0.1))",
              "linear-gradient(225deg, rgba(54, 145, 106, 0.15), rgba(16, 185, 129, 0.05))",
              "linear-gradient(45deg, rgba(54, 145, 106, 0.1), rgba(16, 185, 129, 0.1))",
            ],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial="hidden" animate={heroIsInView ? "visible" : "hidden"} variants={containerVariants}>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            variants={itemVariants}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.span
              className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform Your
            </motion.span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-[#36916a] to-emerald-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.5, rotateX: 90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Smart Home
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
            initial={{ opacity: 0, z: -100 }}
            animate={{ opacity: 1, z: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Professional design, installation, and maintenance of intelligent home automation systems. Experience the
            future of living today.
          </motion.p>

          <motion.div
            className="flex justify-center items-center"
            variants={itemVariants}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.button
              className="group bg-gradient-to-r from-[#36916a] to-emerald-500 hover:from-[#2d7a57] hover:to-emerald-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
              whileHover={{
                scale: 1.05,
                rotateX: 10,
                rotateY: 5,
                boxShadow: "0 20px 40px rgba(54, 145, 106, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => setIsModalOpen(true)}
            >
              Get Started Today
              <motion.div
                className="inline-block ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Enhanced 3D Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, rgba(54, 145, 106, 0.6), rgba(54, 145, 106, 0.1))`,
            filter: `blur(${Math.abs(smoothMouseX.get() - 100) / 50}px)`,
          }}
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-10 w-16 h-16 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.6), rgba(59, 130, 246, 0.1))`,
            filter: `blur(${Math.abs(smoothMouseX.get() - window.innerWidth + 100) / 50}px)`,
          }}
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full opacity-25"
          style={{
            background: `radial-gradient(circle, rgba(245, 158, 11, 0.6), rgba(245, 158, 11, 0.1))`,
            filter: `blur(${Math.abs(smoothMouseY.get() - window.innerHeight / 2) / 30}px)`,
          }}
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
      </div>

      {/* Contact Form Modal */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Request a Consultation">
        <ContactForm onSubmit={handleFormSubmit} onClose={() => setIsModalOpen(false)} />
      </ContactModal>
    </section>
  )
}
