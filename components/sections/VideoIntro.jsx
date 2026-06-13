'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import content from '@/data/content.json'
import styles from '@/styles/sections/VideoIntro.module.css'

const CinematicLayer = dynamic(() => import('@/components/three/CinematicLayer'), { ssr: false })

function scrollNext() {
  const main = document.querySelector('main')
  if (main) main.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
}

export default function VideoIntro() {
  const greetRef  = useRef(null)
  const nameRef   = useRef(null)
  const roleRef   = useRef(null)
  const scrollRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 })
    tl.fromTo(greetRef.current,  { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .fromTo(nameRef.current,   { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, '-=0.2')
      .fromTo(roleRef.current,   { opacity: 0, y:  20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .fromTo(scrollRef.current, { opacity: 0 },         { opacity: 1, duration: 0.5 }, '-=0.1')
    return () => tl.kill()
  }, [])

  return (
    <section className={styles.section}>

      {/* Dark base background — always visible */}
      <div className={styles.darkBase} aria-hidden />

      {/* Profile photo — medium sized, right side, contained */}
      <div className={styles.photoWrap}>
        <Image
          src="/assets/mz-hero.png"
          alt={profile.name.full}
          width={420}
          height={560}
          quality={100}
          className={styles.photoImg}
          priority
        />
      </div>

      {/* Gradient overlay — covers photo edges into dark bg */}
      <div className={styles.overlay} />

      {/* Three.js bokeh (desktop only) */}
      {!isMobile && <CinematicLayer />}

      {/* Landing text */}
      <div className={styles.heroContent}>
        <p ref={greetRef} className={styles.eyebrow}>{content.site.tagline}</p>
        <h1 ref={nameRef} className={styles.name}>
          {profile.name.first}<br />{profile.name.last}
        </h1>
        <p ref={roleRef} className={styles.role}>{profile.roles.detailed}</p>
      </div>

      {/* Scroll cue */}
      <button
        ref={scrollRef}
        className={styles.scrollCue}
        onClick={scrollNext}
        aria-label="Scroll to next section"
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} />
      </button>

    </section>
  )
}
