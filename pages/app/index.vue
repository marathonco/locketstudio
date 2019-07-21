<template>
  <main class="start">
    <section class="instructions">
      <h3>Welcome!</h3>
      <p>This is a free tool to help you resize and print images for your locket! Follow these steps to find the correct size for your Marathon™ Locket.</p>
    </section>
    <section class="container">
      <p>If you already have a locket code enter it here:</p>
      <p class="center">
        <input
          id="locketCode"
          v-model="inputCode"
          type="text"
          name="locketCode"
          @keydown="invalidCode = false"
        >
        <button @click="validateCode(inputCode)">
          Submit Code
        </button>
      </p>
      <span
        v-show="invalidCode"
        class="error"
      >
        Sorry, that code is not valid.
      </span>
      <p>
        If you don't have a code we can still find the correct template for your locket.
      </p>
      <button @click="choose">
        Proceed Without Code
      </button>
    </section>
  </main>
</template>

<script>
import { mapActions } from 'vuex'
import lockets from '~/data/lockets'

export default {
  data() {
    return {
      inputCode: null,
      invalidCode: false
    }
  },
  created() {
    if (this.$route.query.code) {
      this.inputCode = this.$route.query.code
    }
    this.reset()
  },
  methods: {
    ...mapActions({
      setCurrentCode: 'app/setCurrentCode',
      setCurrentTemplate: 'app/setCurrentTemplate',
      reset: 'app/reset'
    }),

    validateCode(checkLabel) {
      // check inputCode or last remaining locket option and then proceed to upload pages
      const result = lockets.find(
        locket => locket.label.toLowerCase() === checkLabel.toLowerCase()
      )
      if (result) {
        this.invalidCode = false
        // set template to be the same as the label for now.
        this.setCurrentCode(result)
        this.setCurrentTemplate(result.label)
        this.$router.push({ path: '/app/upload' })
      } else {
        this.invalidCode = true
      }
    },
    choose() {
      this.$router.push({ path: '/app/choose/shape' })
    }
  }
}
</script>

<style lang="scss" scoped>
#locketCode {
  width: 6rem;
}
.start {
  display: flex;
  flex-direction: column;
  @media #{$m-up} {
    align-content: center;
    flex-direction: row;
    justify-content: center;
  }
}
.container {
  @extend .panel;
}
</style>
