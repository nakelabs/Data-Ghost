import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function Homepage() {
  const features = [
    {
      title: "Digital Will Creation",
      description: "Define precisely what happens to your online presence, accounts, and assets through a comprehensive digital will.",
    },
    {
      title: "Automated Continuity",
      description: "A secure monitoring system that quietly ensures your instructions are executed automatically when you are no longer able to.",
    },
    {
      title: "Trusted Transfer",
      description: "Seamlessly encrypt and pass down your most critical digital assets and credentials to designated recipients.",
    }
  ]

  const platforms = [
    "Social Media",
    "Email Archives",
    "Cloud Storage",
    "Financial Profiles",
    "Workspaces",
    "Personal Sites"
  ]

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="tracking-tight font-semibold text-lg">
            DataGhost
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/auth" className="text-zinc-500 hover:text-zinc-900 transition-colors">
              Sign In
            </Link>
            <Link
              to="/auth"
              state={{ isSignUp: true }}
              className="bg-zinc-900 text-white px-5 py-2 rounded-full hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-medium tracking-tighter mb-8 text-zinc-900"
          >
            Securing your <br /> digital legacy.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Advanced privacy control for the era of permanent digital footprints. Ensure your data transitions safely according to your exact terms.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/auth"
              state={{ isSignUp: true }}
              className="px-8 py-3 bg-zinc-900 text-white rounded-full text-base font-medium hover:bg-zinc-800 transition-colors shadow-sm w-full sm:w-auto"
            >
              Create Account
            </Link>
            <button className="px-8 py-3 bg-transparent text-zinc-900 border border-zinc-200 rounded-full text-base font-medium hover:border-zinc-300 hover:bg-zinc-50 transition-colors w-full sm:w-auto">
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Outline */}
      <section className="py-24 px-6 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group"
              >
                <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-xs font-medium text-zinc-400 mb-6 group-hover:bg-zinc-50 group-hover:border-zinc-300 transition-colors duration-300">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-medium tracking-tight mb-3 text-zinc-800">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-light text-sm md:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Grid */}
      <section className="py-24 px-6 border-t border-zinc-100 bg-zinc-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
            <h2 className="text-3xl font-medium tracking-tight text-zinc-800">Scope of coverage</h2>
            <p className="text-zinc-500 font-light max-w-md">Everything from daily communications to encrypted vaults, securely managed from one central protocol.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-zinc-200 rounded-2xl overflow-hidden shadow-sm border border-zinc-200">
            {platforms.map((platform, idx) => (
              <div
                key={idx}
                className="bg-white p-8 md:p-12 hover:bg-zinc-50/50 transition-colors flex items-center justify-center text-center"
              >
                <span className="text-lg font-medium tracking-tight text-zinc-600">{platform}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section - Typographic */}
      <section className="py-32 px-6 border-t border-zinc-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8">
              Privacy by design.
            </h2>
            <p className="text-xl text-zinc-400 font-light leading-relaxed mb-12">
              Your digital legacy is precious. That's why we've built DataGhost with zero-knowledge architecture, end-to-end encryption, and complete transparency.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm font-medium text-zinc-500">
              <span className="flex items-center gap-2 tracking-wide uppercase"><span className="w-1.5 h-1.5 bg-zinc-300 rounded-full"></span> End-to-end secure</span>
              <span className="hidden sm:inline text-zinc-300">/</span>
              <span className="flex items-center gap-2 tracking-wide uppercase"><span className="w-1.5 h-1.5 bg-zinc-300 rounded-full"></span> Zero-knowledge</span>
              <span className="hidden sm:inline text-zinc-300">/</span>
              <span className="flex items-center gap-2 tracking-wide uppercase"><span className="w-1.5 h-1.5 bg-zinc-300 rounded-full"></span> Immutable privacy</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="tracking-tight font-medium text-sm text-zinc-800">
            DataGhost
          </div>
          <div className="text-xs text-zinc-400 font-light">
            © 2025 DataGhost Protocol. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}