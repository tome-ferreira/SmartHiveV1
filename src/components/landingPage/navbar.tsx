import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, Menu, X } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useIsAdminHook, useIsClientHook } from "../../hooks/AuthHooks"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const { user, signOut } = useAuth();
  const { data: isAdmin } = useIsAdminHook();
  const { data: isClient } = useIsClientHook();

  var navLoc: string = "";
  var logBtnText: string = "";

  if (isAdmin) {
    logBtnText = "Administrative Area";
    navLoc = "/Admin/Dashboard";
  }else if(isClient){
    logBtnText = "Client Area";
    navLoc = "/Client/Dashboard";
  }else{
    logBtnText = "Login";
    navLoc = "/sign-in";   
  }

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800"
      style={{
        transform: `translateZ(0)`,
        backfaceVisibility: "hidden",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              whileHover={{
                rotateY: 360,
                rotateX: 15,
              }}
              transition={{ duration: 0.8 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <img src="/img/logos/SmartHiveLogoSml.png" alt="SmartHive logo" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#36916a] to-emerald-400 bg-clip-text text-transparent">
              SmartHive
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: "Services", href: "#services" },
              { name: "About", href: "#about" },
              { name: "Contact", href: "#contact" },
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="hover:text-[#36916a] transition-colors cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.1,
                  rotateX: 10,
                }}
                style={{ transformStyle: "preserve-3d" }}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.querySelector(item.href)
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                {item.name}
              </motion.a>
            ))}

            <motion.button
              className="bg-gradient-to-r from-[#36916a] to-emerald-500 hover:from-[#2d7a57] hover:to-emerald-600 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ml-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{
                scale: 1.05,
                rotateX: 10,
                rotateY: 5,
                boxShadow: "0 10px 20px rgba(54, 145, 106, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => {
                window.location.href = navLoc
              }}
            >
              {logBtnText}
            </motion.button>
          </div>

          <motion.button className="md:hidden" whileTap={{ scale: 0.95 }} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMenuOpen ? 1 : 0,
          height: isMenuOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 overflow-hidden"
      >
        <div className="px-4 py-4 space-y-4">
          {[
            { name: "Services", href: "#services" },
            { name: "About", href: "#about" },
            { name: "Contact", href: "#contact" },
          ].map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              className="block hover:text-[#36916a] transition-colors cursor-pointer"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={(e) => {
                e.preventDefault()
                const element = document.querySelector(item.href)
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" })
                }
                setIsMenuOpen(false)
              }}
            >
              {item.name}
            </motion.a>
          ))}

          <motion.button
            className="w-full bg-gradient-to-r from-[#36916a] to-emerald-500 hover:from-[#2d7a57] hover:to-emerald-600 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 mt-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              window.location.href = "/login"
              setIsMenuOpen(false)
            }}
          >
            Client Login
          </motion.button>
        </div>
      </motion.div>
    </motion.nav>
  )
}
