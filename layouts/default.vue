<template>
  <div id="container">
    <Header />
    <Nav />
    <div id="wrapper">
      <nuxt />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/layout/Header'
import Nav from '~/components/layout/Nav.vue'
import Footer from '~/components/layout/Footer'

export default {
  components: { Header, Nav, Footer },
  watch: {
    $route() {
      this.$store.dispatch('layout/closeMenu')
    }
  },
  methods: {
    restart() {
      this.$router.replace({ path: '/' })
    }
  }
}
</script>

<style lang="scss">
#container {
  align-items: center;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  position: relative;
}
#wrapper {
  align-items: center;
  background: $background-primary;
  border-top: 4px solid getColor(background, light);
  display: flex;
  flex: 1;
  flex-direction: row;
  height: 100%;
  // overflow: hidden;
  // position: relative;
  width: 100%;
  main {
    align-items: center;
    background: $background-primary;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1rem;
    width: 100%;
  }
}
</style>
