<template>
  <header id="header">
    <nuxt-link
      :to="'/'"
      class="home"
    >Home</nuxt-link>
  </header>
</template>

<script>
export default {
  methods: {
    restart() {
      this.$router.push({ path: '/app' })
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem;
  width: 100vw;
  @media #{$m-up} {
    padding: 1rem;
  }
}
.home {
  @include hide-text;
  background-image: url('~assets/img/logo.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  height: 80px;
  width: 100%;
  @media #{$m-up} {
    background: url('~assets/img/logo-long.png');
    background-position: center;
    background-repeat: no-repeat;
    height: 110px;
  }
}
</style>
