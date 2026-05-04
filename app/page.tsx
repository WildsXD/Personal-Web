"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
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

// Lightweight Particle Background Component
const ParticleBackground = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [isClient, setIsClient] = useState(false)
    const { scrollY } = useScroll()
    const parallaxY = useTransform(scrollY, [0, 1000], [0, -150])

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) {
        return <div className="absolute inset-0 overflow-hidden pointer-events-none" />
    }

    return (
        <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ y: parallaxY }}
        >
            {/* Simple animated particles */}
            {Array.from({ length: 20 }, (_, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full ${isDarkMode ? "bg-blue-500/20" : "bg-blue-400/10"}`}
                    style={{
                        left: `${((i * 73) % 100)}%`,
                        top: `${((i * 83) % 100)}%`,
                        width: `${(i % 3) * 8 + 8}px`,
                        height: `${(i % 3) * 8 + 8}px`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                        duration: 4 + i,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Gradient orb */}
            <motion.div
                className={`absolute w-96 h-96 rounded-full blur-3xl ${isDarkMode
                    ? "bg-gradient-to-r from-blue-600/10 to-purple-600/10"
                    : "bg-gradient-to-r from-blue-400/5 to-purple-400/5"
                    }`}
                style={{
                    top: "10%",
                    left: "10%",
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />
        </motion.div>
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

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (!isClient) return
        const savedTheme = localStorage.getItem("theme")
        if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            setIsDarkMode(true)
        }
    }, [isClient])

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
            errors.name = "Nama diperlukan"
        }
        if (!formData.email.trim()) {
            errors.email = "Email diperlukan"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email tidak valid"
        }
        if (!formData.message.trim()) {
            errors.message = "Pesan diperlukan"
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
        await new Promise((resolve) => setTimeout(resolve, 2000))
        alert("Pesan berhasil dikirim!")
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
        { name: "Pengembangan Web", icon: "🎨", description: "HTML, CSS, JavaScript, Python" },
        { name: "Pengembangan React", icon: "⚙️", description: "React, Redux, Hooks" },
        { name: "Pengembangan Next.js", icon: "📱", description: "Next.js, Tailwind CSS" },
        { name: "Pengembangan Backend", icon: "✨", description: "Node.js, Django" },
        { name: "Basis Data", icon: "🗄️", description: "MongoDB, PostgreSQL" },
        { name: "Layanan Cloud", icon: "☁️", description: "AWS, Google Cloud" },
    ]

    const projects = [
        {
            title: "Portofolio Pribadi",
            description: "Sebuah situs web portofolio pribadi yang dibangun dengan Next.js dan Tailwind CSS.",
            image: "/placeholder.svg?height=200&width=300",
            tags: ["Next.js", "Tailwind CSS", "React"],
            link: "#",
        },
        {
            title: "Situs Web E-commerce",
            description: "Sebuah situs web e-commerce yang dibangun dengan React dan Redux.",
            image: "/placeholder.svg?height=200&width=300",
            tags: ["React", "Redux", "Node.js"],
            link: "#",
        },
        {
            title: "AI-Chatbot",
            description: "Sebuah aplikasi chatbot yang dibangun dengan Python, memungkinkan percakapan real-time dan respons cerdas.",
            image: "/placeholder.svg?height=200&width=300",
            tags: ["Python", "Chatbot", "AI"],
            link: "#",
        },
        {
            title: "Situs Web Blog",
            description: "Sebuah situs web blog yang dibangun dengan Next.js dan Markdown.",
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
                            className="cursor-pointer text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                            onClick={() => scrollToSection("home")}
                            role="button"
                            tabIndex={0}
                        >
                            ILHAM RAMDANI
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-8">
                            {[
                                { key: "home", label: "beranda" },
                                { key: "about", label: "tentang" },
                                { key: "skills", label: "keterampilan" },
                                { key: "portfolio", label: "portofolio" },
                                { key: "contact", label: "kontak" },
                            ].map((item, index) => (
                                <motion.button
                                    key={item.key}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => scrollToSection(item.key)}
                                    className={`capitalize transition-colors duration-300 hover:text-blue-600 ${activeSection === item.key ? "text-blue-600 font-semibold" : ""}`}
                                >
                                    {item.label}
                                </motion.button>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Theme Toggle */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleTheme}
                                className={`p-2 rounded-lg transition-colors duration-300 ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
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
                                {[
                                    { key: "home", label: "beranda" },
                                    { key: "about", label: "tentang" },
                                    { key: "skills", label: "keterampilan" },
                                    { key: "portfolio", label: "portofolio" },
                                    { key: "contact", label: "kontak" },
                                ].map((item) => (
                                    <motion.button
                                        key={item.key}
                                        variants={fadeInUp}
                                        whileHover={{ x: 10 }}
                                        onClick={() => scrollToSection(item.key)}
                                        className={`block w-full text-left px-4 py-2 rounded-lg capitalize transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${activeSection === item.key ? "text-blue-600 font-semibold" : ""}`}
                                    >
                                        {item.label}
                                    </motion.button>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Hero Section */}
            <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-20 relative">
                <ParticleBackground isDarkMode={isDarkMode} />

                <div
                    className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-br from-gray-900/50 via-transparent to-gray-900/50" : "bg-gradient-to-br from-white/50 via-transparent to-white/50"}`}
                />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div initial="initial" animate="animate" variants={staggerContainer}>
                        <motion.div variants={scaleIn} className="mb-8">
                            <motion.img
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                src="/Profil.webp?height=200&width=200"
                                alt="Profile"
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-6 border-4 border-blue-600 shadow-lg"
                            />
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                        >
                            ILHAM RAMDANI
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Pengembang Web yang bersemangat tentang menciptakan pengalaman web yang luar biasa
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                            >
                                <Mail className="w-5 h-5" />
                                <span>Sewa Saya</span>
                            </motion.button>

                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.2)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                <span>Unduh CV</span>
                            </motion.button>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                            className="mt-16"
                        >
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
                            Tentang Saya
                        </motion.h2>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div variants={slideInLeft}>
                                <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
                                    Saya adalah pengembang web yang bersemangat dengan pengalaman lebih dari 5 tahun membangun solusi digital yang berdampak. Saya senang mengubah tantangan yang kompleks menjadi desain yang bersih, intuitif, dan elegan.
                                </p>
                                <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
                                    Ketika saya tidak sedang coding, saya senang menggali teknologi baru, berkontribusi pada proyek open-source, dan sesekali bersantai dengan beberapa permainan.
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
                                        year: "2023 - Sekarang",
                                        title: "Pengembang Web Full Stack",
                                        desc: "Mendorong pengembangan end-to-end solusi web yang dapat diskalakan, memastikan performa dan kualitas kode, sambil terus belajar dan mengadopsi teknologi baru.",
                                    },
                                    {
                                        year: "2022 - 2023",
                                        title: "Pengembang Frontend dan Backend",
                                        desc: "Mengembangkan aplikasi web responsif dengan React dan Vue.js, didukung oleh sistem backend yang dapat diskalakan menggunakan Flask (Python), Django, dan Node.js untuk API RESTful dan manajemen data.",
                                    },
                                    {
                                        year: "2020 - 2022",
                                        title: "Pengembang Junior",
                                        desc: "Memulai perjalanan pengembangan web saya dengan menguasai konsep inti, menjelajahi framework modern, dan menerapkan best practices dalam proyek dunia nyata.",
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
                            Keterampilan & Layanan
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
                                    className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-900" : "bg-white"} shadow-lg`}
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
                            Proyek Unggulan
                        </motion.h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            {projects.map((project, index) => (
                                <motion.div
                                    key={index}
                                    variants={scaleIn}
                                    whileHover={{ y: -10 }}
                                    className={`rounded-lg overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
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
                                                Lihat Proyek
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
                            Hubungi Saya
                        </motion.h2>

                        <div className="grid md:grid-cols-2 gap-12">
                            <motion.div variants={slideInLeft}>
                                <h3 className="text-2xl font-semibold mb-6">Mari Bekerja Sama</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                    Saya selalu tertarik dengan peluang baru dan proyek-proyek yang menarik. Mari kita diskusikan bagaimana kami dapat mewujudkan ide-ide Anda.
                                </p>

                                <motion.div variants={staggerContainer} className="space-y-4">
                                    {[
                                        { Icon: Mail, text: "wildscomp@gmail.com" },
                                        { Icon: Phone, text: "+62 851-3726-0621" },
                                        { Icon: MapPin, text: "Jakarta, Indonesia" },
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
                                    { name: "name", type: "text", placeholder: "Nama Anda", label: "Nama" },
                                    { name: "email", type: "email", placeholder: "your.email@example.com", label: "Email" },
                                    { name: "message", type: "textarea", placeholder: "Ceritakan tentang proyek Anda...", label: "Pesan" },
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
                                    className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
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
                                                Mengirim...
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
                                                Kirim Pesan
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
                        © 2024 WildsXD. Semua hak dilindungi. Dibangun dengan React & Tailwind CSS.
                    </p>
                </div>
            </motion.footer>
        </div>
    )
}
