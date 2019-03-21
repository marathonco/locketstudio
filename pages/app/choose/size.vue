<template>
  <main>
    <h3 class="subtitle">
      Choose the width of your locket:
    </h3>
    <p>Measure your locket at the widest part in millimeters.</p>
    <div class="selection">
      <figure class="thumb">
        <component :is="currentCode.shape + 'SVG'" />
      </figure>
      <p class="buttons">
        <button
          v-for="(size, key) of sizes"
          :key="key"
          @click="updateCode(size)"
        >
          {{ size }}
        </button>
      </p>
    </div>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import circleSVG from '~/assets/img/shape-circle.svg?inline'
import ovalSVG from '~/assets/img/shape-oval.svg?inline'
import heartSVG from '~/assets/img/shape-heart.svg?inline'

export default {
  transition: {
    name: 'slide-left'
  },
  components: {
    circleSVG,
    ovalSVG,
    heartSVG
  },
  middleware: ({ store, redirect }) => {
    const code = store.state.app.currentCode
    if (!code || !code.shape) {
      return redirect('/app/choose/shape')
    }
  },
  computed: {
    ...mapGetters({
      currentCode: 'app/getCurrentCode',
      filteredLockets: 'app/getFilteredLockets'
    }),
    sizes() {
      return [...new Set(this.filteredLockets.map(x => x.size))]
    }
  },
  mounted() {
    // remove previously existing values
    const code = { shape: this.currentCode.shape }
    this.setCurrentCode(code)
  },
  methods: {
    ...mapActions({
      setCurrentCode: 'app/setCurrentCode',
      setCurrentTemplate: 'app/setCurrentTemplate'
    }),
    updateCode(option) {
      const code = this.currentCode
      code.size = option
      this.setCurrentCode(code)
      // check to see if there is only 1 code that matches
      if (this.filteredLockets.length > 1) {
        this.$router.push({ path: '/app/choose/type' })
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

<style lang="scss" scoped>
.selection {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
// .buttons {
//   flex
// }
.selection figure {
  height: 200px;
  width: 200px;
}
svg .svg-arrows {
  transition: transform 3s ease-in;
  transform: scaleX(100%);
  transform-origin: center;
}
.slide-left-enter {
  svg .svg-arrows {
    transform: scaleX(0);
  }
}
svg .svg-locket path {
  fill: #dddddd;
  stroke: $brand1;
}
svg .svg-arrow-line {
  width: 0;
}
</style>
