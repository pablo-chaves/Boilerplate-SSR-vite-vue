import { defineComponent, Suspense } from 'vue'
import mod from '@/assets/css/home.module.css'
export default defineComponent({
  render() {
    return (
      <>
        <h1>welcome to Vite SSR + Koa + Vue 3</h1>
        <h3 class={mod['titleColor']}>this is home page ya~</h3>
      </>
    )
  },
})
