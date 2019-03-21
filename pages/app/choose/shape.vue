<template>
  <main>
    <h3 class="subtitle">
      Choose the shape of your locket:
    </h3>
    <div class="selection">
      <div
        v-for="(shape, key) of shapes"
        :key="key"
        class="card"
        @click="updateCode(shape)"
      >
        <figure class="thumb">
          <component :is="shape + 'SVG'" />
        </figure>
        <span class="label">{{ shape }}</span>
      </div>
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
  computed: {
    ...mapGetters({
      currentCode: 'app/getCurrentCode',
      filteredLockets: 'app/getFilteredLockets'
    }),
    shapes() {
      return [...new Set(this.filteredLockets.map(x => x.shape))]
    }
  },
  mounted() {
    // remove previously existing values
    const code = {}
    this.setCurrentCode(code)
  },
  methods: {
    ...mapActions({
      setCurrentCode: 'app/setCurrentCode',
      setCurrentTemplate: 'app/setCurrentTemplate'
    }),
    updateCode(option) {
      const code = this.currentCode
      code.shape = option
      this.setCurrentCode(code)
      // check to see if there is only 1 code that matches
      if (this.filteredLockets.length > 1) {
        this.$router.push({ path: '/app/choose/size' })
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
.subtitle {
  text-align: center;
}
.selection {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.card {
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin: 0.25rem;
  padding: 0.25rem;
  position: relative;
  .svg-locket path {
    fill: #dddddd;
    stroke: $brand1;
  }
  figure {
    max-height: 200px;
    max-width: 200px;
  }
  svg .svg-arrows {
    display: none;
  }
  svg .svg-locket path {
    fill: none;
    stroke: #dddddd;
  }
  &:hover .svg-locket path {
    fill: #dddddd;
    stroke: $brand1;
  }
}
.label {
  display: block;
  font-size: 1.414rem;
  text-align: center;
  text-transform: uppercase;
  width: 100%;
}
</style>
