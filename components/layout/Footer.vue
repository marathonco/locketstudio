<template>
  <footer id="footer">
    <p>
      If you are looking to purchase one of our lockets, please <nuxt-link to="contact">
        contact us
      </nuxt-link> so we can direct you to an authorized retailer in your area.
    </p>
    <p class="copyright">
      © {{ year }} Locket Studio. All rights reserved.
    </p>
  </footer>
</template>

<script>
export default {
  computed: {
    year() {
      const currentYear = new Date().getFullYear()
      return currentYear
    }
  }
}
</script>

<style lang="scss">
#footer {
  align-items: center;
  background: $background-alt;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  width: 100vw;
  p {
    color: getColor(text, ui);
    a {
      color: contrast-color($brand1, 20%);
      &:hover {
        color: #ffffff;
      }
    }
  }
}
</style>
