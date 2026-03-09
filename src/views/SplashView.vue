<template>
  <div ref="splashEl" class="splash">
    <div ref="contentEl" class="splash-content">
      <h1 class="splash-title">Diary</h1>
      <p class="splash-sub">дневник чувств</p>
    </div>

    <svg class="splash-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path ref="wavePathEl" :d="flatPath" fill="white" fill-opacity="0.15" />
      <path ref="wavePathEl2" :d="flatPath" fill="white" fill-opacity="0.08" />
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const router = useRouter()

const splashEl = ref(null)
const contentEl = ref(null)
const wavePathEl = ref(null)
const wavePathEl2 = ref(null)

const flatPath = 'M0,320 L1440,320 L1440,320 L0,320 Z'
const wavePath1 = 'M0,224 C240,100 480,280 720,200 C960,120 1200,260 1440,180 L1440,320 L0,320 Z'
const wavePath2 = 'M0,260 C200,180 440,300 720,230 C1000,160 1240,280 1440,210 L1440,320 L0,320 Z'

function animateSplash() {
  const tl = gsap.timeline()

  // Fade in title and subtitle
  tl.fromTo(
    contentEl.value.querySelector('.splash-title'),
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
  )
  tl.fromTo(
    contentEl.value.querySelector('.splash-sub'),
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    '-=0.4',
  )

  // Animate wave paths
  tl.to(
    wavePathEl.value,
    {
      attr: { d: wavePath1 },
      duration: 1.2,
      ease: 'power2.inOut',
    },
    '-=0.3',
  )
  tl.to(
    wavePathEl2.value,
    {
      attr: { d: wavePath2 },
      duration: 1.2,
      ease: 'power2.inOut',
    },
    '-=1.0',
  )

  // Fade out and navigate
  tl.to(
    splashEl.value,
    {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete() {
        router.replace({ name: 'home' })
      },
    },
    '+=0.3',
  )
}

onMounted(() => {
  animateSplash()
})
</script>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%);
  overflow: hidden;
}

.splash-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.splash-title {
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  color: #ffffff;
  opacity: 0;
}

.splash-sub {
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.6);
  margin-top: 0.75rem;
  opacity: 0;
}

.splash-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  pointer-events: none;
}
</style>
