<template>
  <main class="crop">
    <section class="instructions">
      <h3>Crop your image:</h3>
      <p>
        Resize the image to fit in the locket template. When you are happy with
        the crop, click
        <em>Save</em>
      </p>
    </section>
    <div class="panel panel-cropper">
      <section id="cropper">
        <img
          id="crop"
          :src="imageSource"
        >
      </section>
      <section class="instructions-control">
        <p v-if="$device.isMobileOrTablet">
          Drag the image to move it, and pinch to zoom and use the slider to
          rotate the image.
        </p>
        <p v-else>
          Click and drag the image to move it, and use the sliders to rotate
          or zoom the image.
        </p>
      </section>
      <section class="controls">
        <p v-if="!$device.isMobileOrTablet">
          <label for="zoom">Zoom:</label>
          <no-ssr>
            <vue-slider
              v-model="zoom"
              v-bind="zoomOptions"
            />
          </no-ssr>
        </p>
        <p>
          <label for="rotation">Rotate:</label>
          <no-ssr>
            <vue-slider
              v-model="rotation"
              v-bind="rotateOptions"
            />
          </no-ssr>
        </p>
        <div class="actions actions-inline">
          <button
            class="error"
            @click="cancel"
          >
            Cancel
          </button>
          <button
            class="success"
            @click="save"
          >
            Save
          </button>
        </div>
      </section>
    </div>
    <img
      :src="webOverlay"
      style="display: none;"
      @load="loadOverlay"
    >
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Cropper from 'cropperjs'

export default {
  transition(to, from) {
    if (to.path === '/app/upload') {
      return 'slide-right'
    } else {
      return 'slide-left'
    }
  },
  middleware: ({ store, redirect }) => {
    if (!store.state.app.currentImage || !store.state.app.currentTemplate) {
      return redirect('/app/upload')
    }
  },
  data() {
    return {
      overlayImage: null,
      rotation: 0,
      zoom: 5,
      rotateOptions: {
        min: -180,
        max: 180,
        width: '100%'
      },
      zoomOptions: {
        min: 5,
        max: 100,
        width: '100%'
      }
    }
  },
  computed: {
    ...mapGetters({
      currentImage: 'app/getCurrentImage',
      currentTemplate: 'app/getCurrentTemplate'
    }),
    imageSource() {
      return this.currentImage.source
    },
    printOverlay() {
      return require('~/assets/img/templates/print/' +
        this.currentTemplate +
        '.png')
    },
    webOverlay() {
      return require('~/assets/img/templates/web/' +
        this.currentTemplate +
        '.png')
    }
  },
  watch: {
    zoom(newZoom, oldZoom) {
      this.zoomImage(newZoom)
    },
    rotation(newRotation, oldRotation) {
      this.rotateImage(newRotation)
    }
  },
  methods: {
    ...mapActions({
      updatePreview: 'app/updatePreview',
      updatePrint: 'app/updatePrint'
    }),
    loadOverlay(event) {
      const image = event.target
      this.overlayImage = image
      const crop = document.getElementById('crop')
      this.cropper = new Cropper(crop, {
        autoCrop: true,
        autoCropArea: 1,
        background: false,
        center: true,
        checkOrientation: true,
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        guides: false,
        highlight: false,
        modal: true,
        responsive: true,
        scalable: false,
        dragMode: 'move',
        rotatable: true,
        viewMode: 1,
        zoomable: true,
        zoomOnTouch: true,
        zoomOnWheel: false,
        ready: function() {
          // change center mark to web overlay and set aspect ratio
          const center = document.querySelector('.cropper-center')
          center.style.backgroundImage = "url('" + image.src + "')"
          this.cropper.setAspectRatio(image.width / image.height)
        }
      })
    },
    cancel() {
      this.$router.push({ path: '/app/upload' })
    },
    save() {
      const imageCanvas = this.cropper.getCroppedCanvas({
        width: this.overlayImage.width,
        height: this.overlayImage.height,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
        fillColor: '#ffffff'
      })
      const context = imageCanvas.getContext('2d')

      // add webOverlay to the canvas
      context.drawImage(this.overlayImage, 0, 0)
      const imageUrl = imageCanvas.toDataURL('image/png')
      this.updatePreview({
        id: this.currentImage.id,
        preview: imageUrl
      })

      // save the Print-ready image as well...
      const print = new Image()
      print.onload = () => {
        const printCanvas = this.cropper.getCroppedCanvas({
          width: print.width,
          height: print.height,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high'
        })
        const printContext = printCanvas.getContext('2d')
        printContext.imageSmoothingQuality = 'high'
        printContext.webkitImageSmoothingEnabled = true
        printContext.mozImageSmoothingEnabled = true
        printContext.imageSmoothingEnabled = true /// future

        printContext.drawImage(print, 0, 0)
        const printImageUrl = printCanvas.toDataURL('image/png')
        this.updatePrint({
          id: this.currentImage.id,
          print: printImageUrl
        })
      }
      print.src = this.printOverlay
      this.$router.push({ path: '/app/upload' })
    },
    zoomImage(zoom) {
      const containerData = this.cropper.getContainerData()
      this.cropper.zoomTo(zoom / 100, {
        x: containerData.width / 2,
        y: containerData.height / 2
      })
    },
    rotateImage(rotation) {
      this.cropper.rotateTo(rotation)
    }
  }
}
</script>

<style lang="scss">
@import 'cropperjs/dist/cropper.min.css';
@import 'vue-slider-component/theme/default.css';

#wrapper main.crop {
  @media #{$l-up} {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
.panel-cropper {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding-top: 0;
}
#cropper {
  align-items: center;
  display: flex;
  max-height: 300px;
  max-width: 320px;
}
.cropper-modal {
  background: transparent;
  border-radius: 20px;
  opacity: 1;
}
.cropper-view-box {
  // need to add border to cover up gap around the overlay
  background: #ffffff;
  border: 2px solid #ffffff;
  outline: 2px solid #ffffff;
  cursor: grab;
}
.cropper-wrap-box {
  display: none;
}
.cropper-center {
  background-size: cover;
  outline: 1px solid #ffffff;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 1;
  width: 100%;
  &::before,
  &::after {
    display: none;
  }
}
#crop {
  visibility: hidden;
}

#overlay {
  display: none;
  visibility: hidden;
}
.controls {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 0.5rem;
  p {
    display: flex;
    flex-direction: column;
    margin: 0.25rem;
    width: 100%;
  }
  label {
    text-align: center;
  }
}
</style>
