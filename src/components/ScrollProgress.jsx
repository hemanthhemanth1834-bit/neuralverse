import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  return (
    <div className="scroll-progress" aria-hidden="true">
      <motion.div className="bar" style={{ scaleX }} />
    </div>
  )
}
