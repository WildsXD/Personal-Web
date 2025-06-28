"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, useScroll, useTransform, useVelocity, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Download,
  Send,
} from "lucide-react"

// Enhanced Particle Background Component with Scroll Velocity Response
const ParticleBackground = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [isClient, setIsClient] = useState(false)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const [velocityFactor, setVelocityFactor] = useState(0)

  // Ensure client-side only rendering for particles
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Transform scroll velocity to a usable factor (0-1 range, with peaks for fast scrolling)
  const velocityTransform = useTransform(scrollVelocity, [-2000, -500, 0, 500, 2000], [1, 0.5, 0, 0.5, 1])

  // Update velocity factor for particle animations
  useEffect(() => {
    if (!isClient) return

    const unsubscribe = velocityTransform.onChange((latest) => {
      setVelocityFactor(Math.min(Math.abs(latest), 1))
    })
    return unsubscribe
  }, [velocityTransform, isClient])

  // Create different parallax speeds for layered depth effect
  const parallaxSlow = useTransform(scrollY, [0, 1000], [0, -100])
  const parallaxMedium = useTransform(scrollY, [0, 1000], [0, -200])
  const parallaxFast = useTransform(scrollY, [0, 1000], [0, -300])
  const parallaxRotation = useTransform(scrollY, [0, 1000], [0, 360])
  const parallaxScale = useTransform(scrollY, [0, 500], [1, 0.8])
  const parallaxOpacity = useTransform(scrollY, [0, 400], [1, 0.3])

  // Velocity-based transforms
  const velocityScale = useTransform(scrollVelocity, [-1000, 0, 1000], [1.3, 1, 1.3])
  const velocityRotation = useTransform(scrollVelocity, [-1000, 0, 1000], [-180, 0, 180])

  // Generate particles with deterministic values to avoid hydration mismatch
  const particles = useMemo(() => {
    if (!isClient) return []

    return Array.from({ length: 70 }, (_, i) => {
      // Use index-based seed for consistent generation
      const seed = i * 0.1
      return {
        id: i,
        x: ((seed * 9301 + 49297) % 233280) / 2332.8, // Pseudo-random based on index
        y: ((seed * 9301 + 49297) % 233280) / 2332.8,
        size: ((seed * 1301 + 9297) % 60) / 10 + 1,
        duration: ((seed * 2301 + 19297) % 250) / 10 + 15,
        delay: ((seed * 301 + 2297) % 80) / 10,
        layer: Math.floor(((seed * 301 + 297) % 30) / 10), // 0, 1, or 2
        type: (seed * 101 + 97) % 100 > 70 ? "glow" : "normal",
        velocityMultiplier: ((seed * 501 + 497) % 50) / 100 + 0.5,
      }
    })
  }, [isClient])

  const getParallaxTransform = (layer: number) => {
    switch (layer) {
      case 0:
        return parallaxSlow
      case 1:
        return parallaxMedium
      case 2:
        return parallaxFast
      default:
        return parallaxSlow
    }
  }

  // Don't render particles on server
  if (!isClient) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none" />
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background particles with velocity-responsive parallax */}
      {particles.map((particle) => {
        const parallaxY = getParallaxTransform(particle.layer)

        return (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full ${particle.type === "glow"
              ? isDarkMode
                ? "bg-gradient-to-r from-blue-400/40 to-purple-400/40 shadow-lg shadow-blue-500/20"
                : "bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/10"
              : isDarkMode
                ? "bg-gradient-to-r from-blue-400/20 to-purple-400/20"
                : "bg-gradient-to-r from-blue-500/10 to-purple-500/10"
              }`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              zIndex: particle.layer === 2 ? 2 : particle.layer === 1 ? 1 : 0,
            }}
            animate={{
              y: [0, -40 * (1 + velocityFactor * particle.velocityMultiplier), 0],
              x: [0, (((particle.id * 30) % 60) - 30) * (1 + velocityFactor * particle.velocityMultiplier), 0],
              opacity: [0.2, 0.8 * (1 + velocityFactor * 0.5), 0.2],
              scale: [1, 1.3 * (1 + velocityFactor * particle.velocityMultiplier * 0.5), 1],
              rotate: [0, 360 * velocityFactor * particle.velocityMultiplier, 0],
            }}
            transition={{
              duration: particle.duration * (1 - velocityFactor * 0.3),
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.delay,
              ease: velocityFactor > 0.3 ? "easeOut" : "easeInOut",
            }}
          >
            <motion.div
              style={{
                y: parallaxY,
                opacity: parallaxOpacity,
                scale: velocityScale,
                rotate: velocityRotation,
                filter: `blur(${velocityFactor * 2}px)`,
              }}
              className="w-full h-full rounded-full bg-inherit shadow-inherit"
            />
          </motion.div>
        )
      })}

      {/* Enhanced geometric shapes with velocity response */}
      {Array.from({ length: 15 }, (_, i) => {
        const seed = i * 0.2
        const layer = Math.floor(((seed * 301 + 297) % 30) / 10)
        const parallaxY = getParallaxTransform(layer)
        const velocityMultiplier = ((seed * 801 + 797) % 80) / 100 + 0.2

        return (
          <motion.div
            key={`shape-${i}`}
            className={`absolute ${isDarkMode ? "border border-blue-400/30 bg-blue-400/5" : "border border-blue-500/20 bg-blue-500/5"
              }`}
            style={{
              left: `${((seed * 8501 + 4297) % 850) / 10 + 5}%`,
              top: `${((seed * 8501 + 4297) % 850) / 10 + 5}%`,
              width: `${((seed * 501 + 497) % 50) + 25}px`,
              height: `${((seed * 501 + 497) % 50) + 25}px`,
              borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "0%" : "25%",
              zIndex: layer,
            }}
            animate={{
              rotate: [0, 360 * (1 + velocityFactor * velocityMultiplier)],
              y: [0, -25 * (1 + velocityFactor * velocityMultiplier), 0],
              opacity: [0.1, 0.4 * (1 + velocityFactor * 0.5), 0.1],
              scale: [1, 1.1 * (1 + velocityFactor * velocityMultiplier * 0.3), 1],
            }}
            transition={{
              duration: (((seed * 2001 + 1497) % 200) / 10 + 15) * (1 - velocityFactor * 0.4),
              repeat: Number.POSITIVE_INFINITY,
              ease: velocityFactor > 0.2 ? "easeOut" : "linear",
            }}
          >
            <motion.div
              style={{
                y: parallaxY,
                rotate: parallaxRotation,
                scale: parallaxScale,
                opacity: parallaxOpacity,
                filter: `blur(${velocityFactor * velocityMultiplier * 1.5}px)`,
              }}
              animate={{
                borderColor:
                  velocityFactor > 0.5
                    ? isDarkMode
                      ? "rgba(59, 130, 246, 0.6)"
                      : "rgba(59, 130, 246, 0.4)"
                    : isDarkMode
                      ? "rgba(59, 130, 246, 0.3)"
                      : "rgba(59, 130, 246, 0.2)",
              }}
              transition={{ duration: 0.3 }}
              className="w-full h-full border border-inherit rounded-inherit bg-inherit"
            />
          </motion.div>
        )
      })}

      {/* Velocity-responsive connecting lines */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: parallaxOpacity,
          filter: `blur(${velocityFactor * 1.5}px)`,
        }}
      >
        {Array.from({ length: 25 }, (_, i) => {
          const seed = i * 0.3
          const x1 = ((seed * 10001 + 4297) % 1000) / 10
          const y1 = ((seed * 10001 + 4297) % 1000) / 10
          const x2 = ((seed * 11001 + 5297) % 1000) / 10
          const y2 = ((seed * 11001 + 5297) % 1000) / 10
          const layer = Math.floor(((seed * 301 + 297) % 30) / 10)
          const velocityMultiplier = ((seed * 601 + 597) % 60) / 100 + 0.4

          return (
            <motion.g key={`line-group-${i}`}>
              <motion.line
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke={isDarkMode ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.08)"}
                strokeWidth={1 + velocityFactor * 2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1 * (1 + velocityFactor * velocityMultiplier), 0],
                  opacity: [0, 0.4 * (1 + velocityFactor * 0.8), 0],
                }}
                transition={{
                  duration: (((seed * 1001 + 597) % 100) / 10 + 6) * (1 - velocityFactor * 0.5),
                  repeat: Number.POSITIVE_INFINITY,
                  delay: ((seed * 401 + 397) % 40) / 10,
                  ease: velocityFactor > 0.3 ? "easeOut" : "easeInOut",
                }}
                style={{
                  y: getParallaxTransform(layer),
                }}
              />
              {/* Enhanced glowing effect during high velocity */}
              {((seed * 101 + 97) % 100 > 60 || velocityFactor > 0.4) && (
                <motion.line
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke={
                    velocityFactor > 0.5
                      ? isDarkMode
                        ? "rgba(59, 130, 246, 0.6)"
                        : "rgba(59, 130, 246, 0.4)"
                      : isDarkMode
                        ? "rgba(59, 130, 246, 0.3)"
                        : "rgba(59, 130, 246, 0.15)"
                  }
                  strokeWidth={2 + velocityFactor * 3}
                  filter={`blur(${1 + velocityFactor * 2}px)`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: [0, 1 * (1 + velocityFactor * velocityMultiplier * 1.5), 0],
                    opacity: [0, 0.6 * (1 + velocityFactor), 0],
                  }}
                  transition={{
                    duration: (((seed * 801 + 497) % 80) / 10 + 4) * (1 - velocityFactor * 0.6),
                    repeat: Number.POSITIVE_INFINITY,
                    delay: ((seed * 301 + 297) % 30) / 10,
                    ease: velocityFactor > 0.4 ? "easeOut" : "easeInOut",
                  }}
                  style={{
                    y: getParallaxTransform(layer),
                  }}
                />
              )}
            </motion.g>
          )
        })}
      </motion.svg>

      {/* Velocity-responsive gradient orbs */}
      {Array.from({ length: 8 }, (_, i) => {
        const seed = i * 0.4
        return (
          <motion.div
            key={`orb-${i}`}
            className={`absolute rounded-full blur-xl ${isDarkMode
              ? "bg-gradient-to-r from-blue-600/10 to-purple-600/10"
              : "bg-gradient-to-r from-blue-500/8 to-purple-500/8"
              }`}
            style={{
              left: `${((seed * 8001 + 1297) % 800) / 10 + 10}%`,
              top: `${((seed * 8001 + 1297) % 800) / 10 + 10}%`,
              width: `${((seed * 2001 + 997) % 200) + 100}px`,
              height: `${((seed * 2001 + 997) % 200) + 100}px`,
            }}
            animate={{
              scale: [1, 1.2 * (1 + velocityFactor * 0.5), 1],
              opacity: [0.1, 0.3 * (1 + velocityFactor * 0.7), 0.1],
              rotate: [0, 180 * velocityFactor, 0],
            }}
            transition={{
              duration: (((seed * 1501 + 997) % 150) / 10 + 10) * (1 - velocityFactor * 0.3),
              repeat: Number.POSITIVE_INFINITY,
              ease: velocityFactor > 0.3 ? "easeOut" : "easeInOut",
            }}
          >
            <motion.div
              style={{
                y: i % 2 === 0 ? parallaxSlow : parallaxMedium,
                scale: parallaxScale,
                opacity: parallaxOpacity,
                filter: `blur(${10 + velocityFactor * 5}px)`,
              }}
              animate={{
                background:
                  velocityFactor > 0.5
                    ? isDarkMode
                      ? "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))"
                      : "linear-gradient(to right, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15))"
                    : isDarkMode
                      ? "linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))"
                      : "linear-gradient(to right, rgba(59, 130, 246, 0.08), rgba(147, 51, 234, 0.08))",
              }}
              transition={{ duration: 0.5 }}
              className="w-full h-full rounded-full"
            />
          </motion.div>
        )
      })}

      {/* Enhanced shooting stars with velocity response */}
      <motion.div style={{ opacity: parallaxOpacity }} className="absolute inset-0">
        {Array.from({ length: 6 }, (_, i) => {
          const seed = i * 0.5
          return (
            <motion.div
              key={`star-${i}`}
              className={`absolute w-1 h-1 rounded-full ${isDarkMode ? "bg-blue-400" : "bg-blue-500"}`}
              style={{
                left: `${((seed * 10001 + 297) % 1000) / 10}%`,
                top: `${((seed * 10001 + 297) % 1000) / 10}%`,
              }}
              animate={{
                x: [0, 200 * (1 + velocityFactor * 2)],
                y: [0, 100 * (1 + velocityFactor * 1.5)],
                opacity: [0, 1 * (1 + velocityFactor * 0.5), 0],
                scale: [0, 1 * (1 + velocityFactor), 0],
              }}
              transition={{
                duration: 3 * (1 - velocityFactor * 0.5),
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 2 + ((seed * 501 + 497) % 50) / 10,
                ease: velocityFactor > 0.3 ? "easeOut" : "easeOut",
              }}
            >
              <motion.div
                className={`absolute h-0.5 ${isDarkMode
                  ? "bg-gradient-to-r from-blue-400 to-transparent"
                  : "bg-gradient-to-r from-blue-500 to-transparent"
                  } blur-sm`}
                style={{
                  width: `${20 + velocityFactor * 40}px`,
                  y: parallaxFast,
                  transformOrigin: "left center",
                }}
                animate={{
                  scaleX: [0, 1 * (1 + velocityFactor * 2), 0],
                  opacity: [0, 0.8 * (1 + velocityFactor), 0],
                  background:
                    velocityFactor > 0.5
                      ? isDarkMode
                        ? "linear-gradient(to right, rgba(59, 130, 246, 1), transparent)"
                        : "linear-gradient(to right, rgba(59, 130, 246, 0.8), transparent)"
                      : isDarkMode
                        ? "linear-gradient(to right, rgba(59, 130, 246, 0.8), transparent)"
                        : "linear-gradient(to right, rgba(59, 130, 246, 0.6), transparent)",
                }}
                transition={{
                  duration: 3 * (1 - velocityFactor * 0.5),
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 2 + ((seed * 501 + 497) % 50) / 10,
                  ease: velocityFactor > 0.3 ? "easeOut" : "easeOut",
                }}
              />
            </motion.div>
          )
        })}
      </motion.div>

      {/* Velocity indicator particles (appear during fast scrolling) */}
      <AnimatePresence>
        {velocityFactor > 0.3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {Array.from({ length: 20 }, (_, i) => {
              const seed = i * 0.6
              return (
                <motion.div
                  key={`velocity-particle-${i}`}
                  className={`absolute w-1 h-1 rounded-full ${isDarkMode ? "bg-blue-300" : "bg-blue-600"}`}
                  style={{
                    left: `${((seed * 10001 + 1297) % 1000) / 10}%`,
                    top: `${((seed * 10001 + 1297) % 1000) / 10}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, velocityFactor * 2, 0],
                    opacity: [0, velocityFactor, 0],
                    y: [0, -50 * velocityFactor],
                    x: [(((seed * 1001 + 497) % 200) - 100) * velocityFactor],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: ((seed * 201 + 197) % 20) / 10,
                    ease: "easeOut",
                  }}
                />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PersonalWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { scrollYProgress } = useScroll()

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const slideInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  }

  const slideInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  }

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
  }

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize dark mode from localStorage (client-side only)
  useEffect(() => {
    if (!isClient) return

    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDarkMode(true)
    }
  }, [isClient])

  // Apply dark mode class to document
  useEffect(() => {
    if (!isClient) return

    if (isDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDarkMode, isClient])

  // Scroll detection for active navigation
  useEffect(() => {
    if (!isClient) return

    const handleScroll = () => {
      const sections = ["home", "about", "skills", "portfolio", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isClient])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required"
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errors = validateForm()

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)
    setFormErrors({})

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert("Message sent successfully!")
    setFormData({ name: "", email: "", message: "" })
    setIsSubmitting(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const skills = [
    { name: "Web Development", icon: "🎨", description: "HTML, CSS, JavaScript,Python" },
    { name: "React Development", icon: "⚙️", description: "React, Redux, Hooks" },
    { name: "Next.js Development", icon: "📱", description: "Next.js, Tailwind CSS" },
    { name: "Backend Development", icon: "✨", description: "Node.js, Django" },
    { name: "Database", icon: "🗄️", description: "MongoDB, PostgreSQL" },
    { name: "Cloud Services", icon: "☁️", description: "AWS, Google Cloud" },
  ]

  const projects = [
    {
      title: "Personal Portfolio",
      description: "A personal portfolio website built with Next.js and Tailwind CSS.",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Next.js", "Tailwind CSS", "React"],
      link: "#",
    },
    {
      title: "E-commerce Website",
      description: "An e-commerce website built with React and Redux.",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["React", "Redux", "Node.js"],
      link: "#",
    },
  {
  title: "AI-Chatbot",
  description: "A chatbot application built with Python, enabling real-time conversations and smart responses.",
  image: "/placeholder.svg?height=200&width=300",
  tags: ["Python", "Chatbot", "AI"],
  link: "#",
},
    {
      title: "Blog Website",
      description: "A blog website built with Next.js and Markdown.",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Next.js", "Markdown", "React"],
      link: "#",
    },
  ]

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}
    >
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isDarkMode ? "bg-gray-900/95" : "bg-white/95"} backdrop-blur-sm border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
             Wildsme
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {["home", "about", "skills", "portfolio", "contact"].map((item, index) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize transition-colors duration-300 hover:text-blue-600 ${activeSection === item ? "text-blue-600 font-semibold" : ""
                    }`}
                >
                  {item}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-300 ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {isDarkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`md:hidden ${isDarkMode ? "bg-gray-900" : "bg-white"} border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}
            >
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="px-4 py-2 space-y-2"
              >
                {["home", "about", "skills", "portfolio", "contact"].map((item, index) => (
                  <motion.button
                    key={item}
                    variants={fadeInUp}
                    whileHover={{ x: 10 }}
                    onClick={() => scrollToSection(item)}
                    className={`block w-full text-left px-4 py-2 rounded-lg capitalize transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${activeSection === item ? "text-blue-600 font-semibold" : ""
                      }`}
                  >
                    {item}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-20 relative">
        {/* Particle Background */}
        <ParticleBackground isDarkMode={isDarkMode} />

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 ${isDarkMode
            ? "bg-gradient-to-br from-gray-900/50 via-transparent to-gray-900/50"
            : "bg-gradient-to-br from-white/50 via-transparent to-white/50"
            }`}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial="initial" animate="animate" variants={staggerContainer}>
            <motion.div variants={scaleIn} className="mb-8">
              <motion.img
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                src="/Profil.webp?height=200&width=200"
                alt="Profile"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-6 border-4 border-blue-600 shadow-lg relative z-10"
              />

              {/* Glowing effect around profile image */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                style={{
                  width: "160px",
                  height: "160px",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: -1,
                }}
              />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent relative"
            >
              Wildsme
              {/* Text glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl"
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto relative z-10"
            >
              Web Developer passionate about creating amazing web experiences
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 relative overflow-hidden group"
              >
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <Mail className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Hire Me</span>
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                className={`border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2 relative overflow-hidden group`}
              >
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/10 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <Download className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Download CV</span>
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="mt-16 relative z-10"
          >
            <motion.div whileHover={{ scale: 1.2 }} className="inline-block">
              <ChevronDown className="w-8 h-8 mx-auto text-gray-400" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-center mb-16">
              About Me
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div variants={slideInLeft}>
                <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
                  I'm a passionate web developer with over 5 years of experience building impactful digital solutions. I enjoy transforming complex challenges into clean, intuitive, and elegant designs.
                </p>
                <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
                 When I'm not coding, I enjoy diving into new tech, contributing to open-source projects, and occasionally relaxing with some games.
                </p>

                <motion.div variants={staggerContainer} className="flex flex-wrap gap-4">
                  {[Github, Linkedin, Twitter].map((Icon, index) => (
                    <motion.a
                      key={index}
                      variants={scaleIn}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      href="#"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors duration-300"
                    >
                      <Icon className="w-6 h-6" />
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div variants={slideInRight} className="space-y-6">
                {[
                  {
                    year: "2023 - Present",
                    title: "Full Stack Web Developer",
                    desc: "Driving end-to-end development of scalable web solutions, ensuring performance and code quality, while actively learning and adopting new technologies.",
                  },
                  {
                    year: "2022 - 2023",
                    title: "Frontend and Backed Developer",
                    desc: "Developed responsive web applications with React and Vue.js, supported by scalable backend systems using Flask (Python), Django, and Node.js for RESTful APIs and data management.",
                  },
                  {
                    year: "2020 - 2022",
                    title: "Junior Developer",
                    desc: "Began my web development journey by mastering core concepts, exploring modern frameworks, and applying best practices in real-world projects.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"} transition-all duration-300`}
                  >
                    <h3 className="text-xl font-semibold mb-2">{item.year}</h3>
                    <h4 className="text-lg font-medium text-blue-600 mb-2">{item.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={`py-20 px-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-center mb-16">
              Skills & Services
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{
                    scale: 1.05,
                    y: -10,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-900" : "bg-white"} shadow-lg group cursor-pointer`}
                >
                  <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="text-4xl mb-4">
                    {skill.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{skill.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-center mb-16">
              Featured Projects
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ y: -10 }}
                  className={`rounded-lg overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg group cursor-pointer`}
                >
                  <div className="relative overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    >
                      <motion.a
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        whileTap={{ scale: 0.9 }}
                        href={project.link}
                        className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Project
                      </motion.a>
                    </motion.div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                    <motion.div variants={staggerContainer} className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <motion.span
                          key={tagIndex}
                          variants={scaleIn}
                          whileHover={{ scale: 1.1 }}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-20 px-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-center mb-16">
              Get In Touch
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div variants={slideInLeft}>
                <h3 className="text-2xl font-semibold mb-6">Let's work together</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  I'm always interested in new opportunities and exciting projects. Let's discuss how we can bring your
                  ideas to life.
                </p>

                <motion.div variants={staggerContainer} className="space-y-4">
                  {[
                    { Icon: Mail, text: "wildscomp@gmail.com" },
                    { Icon: Phone, text: "+62 851-3726-0621" },
                    { Icon: MapPin, text: "Jakarta, Indonesian" },
                  ].map(({ Icon, text }, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-4 cursor-pointer"
                    >
                      <Icon className="w-6 h-6 text-blue-600" />
                      <span>{text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.form variants={slideInRight} onSubmit={handleSubmit} className="space-y-6">
                {[
                  { name: "name", type: "text", placeholder: "Your name", label: "Name" },
                  { name: "email", type: "email", placeholder: "your.email@example.com", label: "Email" },
                  { name: "message", type: "textarea", placeholder: "Tell me about your project...", label: "Message" },
                ].map((field, index) => {
                  type FormFieldKey = keyof typeof formData;
                  const fieldName = field.name as FormFieldKey;
                  return (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <label htmlFor={field.name} className="block text-sm font-medium mb-2">
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <motion.textarea
                          whileFocus={{ scale: 1.02 }}
                          id={field.name}
                          name={field.name}
                          value={formData[fieldName]}
                          onChange={handleInputChange}
                          rows={5}
                          className={`w-full px-4 py-3 rounded-lg border ${formErrors[field.name] ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                            } ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none`}
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type={field.type}
                          id={field.name}
                          name={field.name}
                          value={formData[fieldName]}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${formErrors[field.name] ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                            } ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                          placeholder={field.placeholder}
                        />
                      )}
                      <AnimatePresence>
                        {formErrors[field.name] && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {formErrors[field.name]}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Sending...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="send"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Send Message
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`py-8 px-4 border-t ${isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}`}
      >
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © 2024 WildsXD. All rights reserved. Built with React & Tailwind CSS.
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
