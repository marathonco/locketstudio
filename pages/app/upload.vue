<template>
  <main class="upload">
    <section class="instructions sticky">
      <div v-if="'upload' == status">
        <h3>Add Images:</h3>
        <p>
          Great! Now that we know what kind of locket you have, let's add some
          photos.
        </p>
        <p v-if="$device.isMobileOrTablet">
          Add images from your device by clicking the
          <em>Browse</em> button.
        </p>
        <p v-else>
          Drag images from your computer to this window, or click the
          <em>Browse</em> button to add them.
        </p>
      </div>
      <div v-if="'uploaded' == status">
        <h3>Edit Images:</h3>
        <p>
          Excellent! Now you can click the
          <em>Edit</em> button next to each image an image that you would like
          to resize.
        </p>
      </div>
      <div v-if="'cropped' == status">
        <h3>Almost Done!</h3>
        <p>
          When you are finished cropping all of the images that you
          would like, click the
          <em>Finish</em> button.
        </p>
      </div>
    </section>
    <section id="drop-area">
      <form class="my-form">
        <input
          id="fileElem"
          type="file"
          multiple
          accept="image/*"
          @click="$event.target.value = null"
          @change="storeImages($event.target.files)"
        >
        <div class="actions actions-upload">
          <label
            :class="images.length > 0 ? 'warning' : '' "
            class="button add large"
            for="fileElem"
          >
            {{ images.length > 0 ? 'Add More Images' : 'Browse' }}
          </label>
          <a
            v-if="'cropped' == status"
            class="button success finish large"
            @click="finish"
          >
            Finish
          </a>
        </div>
      </form>
      <div id="previews">
        <transition-group name="fade">
          <Preview
            v-for="image of images"
            :key="image.id"
            :image="image"
          />
        </transition-group>
      </div>
    </section>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Preview from '~/components/app/Preview'

export default {
  transition(to, from) {
    if (from.path === '/app/crop') {
      return 'slide-right'
    } else {
      return 'slide-left'
    }
  },
  components: {
    Preview
  },
  middleware: ({ store, redirect }) => {
    if (!store.state.app.currentTemplate) {
      return redirect('/app')
    }
  },
  computed: {
    ...mapGetters({ images: 'app/getImages' }),
    status() {
      let cropped = false
      this.images.forEach(image => {
        if (image.print) {
          cropped = true
        }
      })
      if (cropped) {
        return 'cropped'
      } else {
        return this.images.length > 0 ? 'uploaded' : 'upload'
      }
    }
  },
  mounted() {
    this.setCurrentImage(null)
    ;['dragenter', 'dragover'].forEach(event =>
      document.body.addEventListener(
        event,
        function(event) {
          event.preventDefault()
          event.stopPropagation()
          document.body.classList.add('drag-is-active')
        },
        false
      )
    )
    ;['dragleave', 'drop'].forEach(event =>
      document.body.addEventListener(
        event,
        function(event) {
          event.preventDefault()
          event.stopPropagation()
          document.body.classList.remove('drag-is-active')
        },
        false
      )
    )

    // Handle dropped files
    document.body.addEventListener(
      'drop',
      function(event) {
        const dt = event.dataTransfer
        const files = dt.files
        this.storeImages(files)
      }.bind(this),
      true
    )
  },
  methods: {
    ...mapActions({
      addImage: 'app/addImage',
      setCurrentImage: 'app/setCurrentImage'
    }),
    storeImages(files) {
      // files is actually a FileList, convert to an array
      files = [...files]

      files.forEach(async file => {
        const imageSource = URL.createObjectURL(file)
        await this.addImage({ source: imageSource })
      })
    },
    finish() {
      this.$router.push({ path: '/app/finish' })
    }
  }
}
</script>

<style lang="scss">
#wrapper main.upload {
  @media #{$l-up} {
    flex-direction: row;
  }
}
#drop-area {
  @extend .panel;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 50vh;
  position: relative;
  transition: height 1s linear, box-shadow 1s ease-out;
  width: 100%;
  will-change: height, box-shadow;
  z-index: 9;
  @media #{$l-up} {
    flex-basis: 120%;
  }
}
.drag-is-active {
  #drop-area {
    box-shadow: 0 0 100vh 100vw rgba(0, 0, 0, 0.75);
  }
  #container #header,
  #container #nav,
  #container #footer {
    opacity: 0.25;
  }
}
.actions.actions-upload {
  flex-direction: column;
  @media #{$m-up} {
    flex-direction: row;
  }
}
#fileElem {
  height: 0;
  padding: 0;
  width: 0;
  visibility: hidden;
}

#previews {
  display: flex;
  margin: 0 auto;
  max-width: 100%;
  position: relative;
}
.sticky {
  @media #{$m-up} {
    align-self: flex-start;
    position: -webkit-sticky;
    position: sticky;
    top: 50%;
  }
}
</style>
