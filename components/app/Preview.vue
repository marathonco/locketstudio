<template>
  <div class="preview">
    <div class="previewImage">
      <img :src="preview">
      <figure
        v-if="!isCropped"
        class="extra thumb"
      >
        <component :is="currentCode.shape + 'SVG'" />
      </figure>
    </div>
    <div class="actions actions-preview">
      <button
        :class="isCropped ? 'success':''"
        @click="crop"
      >
        Edit
      </button>
      <button
        class="warning"
        @click="duplicate"
      >
        Duplicate
      </button>
      <button
        class="error"
        @click="remove"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import circleSVG from '~/assets/img/cutout-circle.svg?inline'
import ovalSVG from '~/assets/img/cutout-oval.svg?inline'
import heartSVG from '~/assets/img/cutout-heart.svg?inline'

export default {
  components: {
    circleSVG,
    ovalSVG,
    heartSVG
  },
  props: {
    image: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters({
      currentCode: 'app/getCurrentCode',
      filteredLockets: 'app/getFilteredLockets'
    }),
    preview() {
      return this.image.preview
    },
    isCropped() {
      return !!this.image.print
    }
  },
  methods: {
    ...mapActions({
      setCurrentImage: 'app/setCurrentImage',
      removeImage: 'app/removeImage',
      duplicateImage: 'app/duplicateImage'
    }),
    crop() {
      this.setCurrentImage(this.image)
      const locket = this.filteredLockets[0]
      if (locket.options) {
        this.$router.push({ path: '/app/choose/options' })
      } else {
        this.$router.push({ path: '/app/crop' })
      }
    },
    remove() {
      this.removeImage(this.image)
    },
    duplicate() {
      this.duplicateImage(this.image)
    }
  }
}
</script>

<style lang="scss">
.preview {
  align-items: center;
  border-bottom: 2px dashed #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1rem auto;
  max-width: 60vw;
  position: relative;
  &:last-child {
    border-bottom: none;
  }
  @media #{$m-up} {
    flex-direction: row;
  }
}
.previewImage {
  align-items: center;
  display: flex;
  height: 150px;
  justify-content: center;
  margin-bottom: 10px;
  margin-right: 10px;
  max-height: 100%;
  max-width: 100%;
  width: auto;
  img {
    max-height: 100%;
    max-width: 100%;
  }
  .extra {
    display: none;
    @media #{$l-up} {
      display: flex;
      flex: 1;
      height: 150px;
      max-height: 100%;
      svg {
        max-height: 100%;
      }
    }
  }
}
.actions.actions-preview {
  flex-direction: row;
  @media #{$m-up} {
    flex-direction: column;
    order: -1;
  }
}
</style>
