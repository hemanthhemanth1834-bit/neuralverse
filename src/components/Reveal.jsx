import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.21, 0.65, 0.25, 1]

export default function Reveal({ children, delay = 0, y = 30, className, once = true, as = 'div', ...rest }) {
  const reduce = useReducedMotion()
  const Tag = motion[as] || motion.div

  if (reduce) {
    const StaticTag = as || 'div'
    return (
      <StaticTag className={className} {...rest}>
        {children}
      </StaticTag>
    )
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-70px' }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function SectionHead({ index, label, title, lead, center = false }) {
  return (
    <Reveal className={`section-head${center ? ' center' : ''}`}>
      <span className="eyebrow">
        {index && <span className="idx">{index}</span>} {label}
      </span>
      <h2>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  )
}
