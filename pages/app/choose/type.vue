<template>
  <main>
    <h3>One last question:</h3>
    <div v-if="types.includes('4-picture')">
      <p>Do you have a 4-picture locket?</p>
      <div class="actions actions-inline">
        <button @click="updateCode('4-picture')">
          Yes
        </button>
        <button @click="updateCode(types.find(val => val != '4-picture'))">
          No
        </button>
      </div>
    </div>
    <div v-else-if="types.includes('premium')">
      <p>Do you have a guild locket?</p>
      <div class="actions actions-inline">
        <button @click="updateCode('premium')">
          Yes
        </button>
        <button @click="updateCode(types.find(val => val != 'premium'))">
          No
        </button>
      </div>
      <p>The bail on guild lockets will be the same on front and back. Check the images shown here to see the difference.</p>
      <div class="sample-images">
        <a @click="updateCode('premium')">
          <figure>
            <img src="~/assets/img/locket-premium.png">
            <figcaption>Guild</figcaption>
          </figure>
        </a>
        <a @click="updateCode(types.find(val => val != 'premium'))">
          <figure>
            <img src="~/assets/img/locket-standard.png">
            <figcaption>Standard</figcaption>
          </figure>
        </a>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  transition: {
    name: 'slide-left'
  },
  middleware: ({ store, redirect }) => {
    const code = store.state.app.currentCode
    if (!code || !code.shape) {
      return redirect('/app/choose/shape')
    } else if (!code.size) {
      return redirect('/app/choose/size')
    }
  },
  computed: {
    ...mapGetters({
      currentCode: 'app/getCurrentCode',
      filteredLockets: 'app/getFilteredLockets'
    }),
    types() {
      return [...new Set([...this.filteredLockets].map(x => x.type))]
    }
  },
  mounted() {
    // remove previously existing values
    const code = { shape: this.currentCode.shape, size: this.currentCode.size }
    this.setCurrentCode(code)
  },
  methods: {
    ...mapActions({
      setCurrentCode: 'app/setCurrentCode',
      setCurrentTemplate: 'app/setCurrentTemplate'
    }),
    updateCode(option) {
      const code = { ...this.currentCode }
      code.type = option
      this.setCurrentCode(code)
      // check to see if there is only 1 code that matches
      if (this.filteredLockets.length > 1) {
        // Something went wrong
      } else {
        const locket = this.filteredLockets[0]
        code.label = locket.label
        this.setCurrentCode(code)
        this.setCurrentTemplate(locket.label)
        this.$router.push({ path: '/app/upload' })
      }
    }
  }
}
</script>

<style lang="scss">
.sample-images {
  align-items: center;
  display: flex;
  justify-content: center;
  a {
    @extend .panel;
    background: rgba(255, 255, 255, 0.75);
    cursor: pointer;
    margin: 0.25rem;
    transition: box-shadow 0.3s ease-in-out, background 0.3s ease-in-out;
    will-change: box-shadow, background;
    &:hover {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 0 50px 20px rgba(0, 0, 0, 0.5);
      z-index: 2;
    }
  }
}
</style>
