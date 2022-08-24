import { defineComponent, Suspense } from 'vue'
import mod from '@/assets/css/about.module.css'
export default defineComponent({
  render() {
    console.log(mod)
    return (
      <>
        <h1>welcome to Vite SSR + Koa + Vue 3</h1>
        <h3 class={mod['titleColor']}>this is about page~</h3>
      </>
    )
  },
})
