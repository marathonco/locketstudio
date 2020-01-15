<template>
  <main class="start">
    <section>
      <h4>What Is Locket Studio™?</h4>
      <p>Locket Studio™ is a free tool to help customers create perfectly sized photos for your Marathon<sup>®</sup> Locket.</p>
      <p>We hope you find the tool helpful and that you end up with a personalized piece of jewelry that is special and meaningful to you.</p>
    </section>
    <section class="panel">
      <h4>Resize Photos For Your Marathon<sup>®</sup> Locket</h4>
      <h5>Upload, Resize, And Crop Your Own Images To Perfectly Fit Your Locket.</h5>
      <nuxt-link
        to="app"
        class="button large success"
      >Get Started</nuxt-link>
    </section>
  </main>
</template>

<script>
export default {}
</script>

<style lang="scss">
#wrapper main.start {
  @media #{$l-up} {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>
