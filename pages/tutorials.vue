<template>
  <main class="tutorials">
    <header>
      <h3>Guides</h3>
    </header>
    <section class="videos">
      <section>
        <h5>Standard Lockets</h5>
        <iframe
          src="https://player.vimeo.com/video/96030307"
          width="320"
          height="240"
          frameborder="0"
          webkitallowfullscreen
          mozallowfullscreen
          allowfullscreen
        />
      </section>
      <section>
        <h5>4-Picture Lockets</h5>
        <iframe
          src="//player.vimeo.com/video/96030307"
          width="320"
          height="240"
          frameborder="0"
          webkitallowfullscreen=""
          mozallowfullscreen=""
          allowfullscreen=""
        />
      </section>
      <section>
        <h5>Premium Lockets</h5>
        <iframe
          src="//player.vimeo.com/video/96015104"
          width="320"
          height="240"
          frameborder="0"
          webkitallowfullscreen=""
          mozallowfullscreen=""
          allowfullscreen=""
        />
      </section>
    </section>
  </main>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.videos {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  @media #{$m-up} {
    flex-direction: row;
    justify-content: space-around;
  }
}
</style>
