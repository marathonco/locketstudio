<template>
  <main>
    <section class="instructions">
      <h3>All Finished!</h3>
      <p>
        Wow, great job! Here is a sample of the 4x6 image you have created. Each
        image should be perfectly sized for your locket. You can download the
        image to print later or you can print it right now. This image is a
        4"x6" photo, so make sure that "Do not scale" is selected on your
        printer.
      </p>
    </section>
    <section class="final">
      <div class="actions actions-inline">
        <button
          class="error"
          @click="back"
        >
          Go Back
        </button>
        <a
          class="button success"
          @click="downloadImage"
        >
          Download
        </a>
        <button
          class="success"
          @click="print"
        >
          Print
        </button>
      </div>
      <img
        id="finalImage"
        :src="finalImage"
        width="600"
        height="400"
      >
    </section>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { changeDpiDataUrl } from 'changedpi'

/**
 * convert a base64 image to a blob
 * thanks IE for making me do this instead of just using download=""
 */
const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  b64Data = b64Data.replace(/^data:image\/[a-z]+;base64,/, '')
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })
  return blob
}

export default {
  transition(to, from) {
    if (to.path === '/app/upload') {
      return 'slide-right'
    } else {
      return 'slide-left'
    }
  },
  middleware: ({ store, redirect }) => {
    if (store.state.app.images.length === 0) {
      return redirect('/app/upload')
    }
  },
  computed: {
    ...mapGetters({
      currentCode: 'app/getCurrentCode',
      images: 'app/getImages',
      finalImage: 'app/getFinalImage'
    })
  },
  created() {
    // add branding image / instructions
    // 300x1200 image on left.
    const addBranding = function(finalCanvas) {
      return new Promise((resolve, reject) => {
        const finalContext = finalCanvas.getContext('2d')
        const brandingImage = new Image()
        brandingImage.onload = () => {
          finalContext.drawImage(brandingImage, 0, 0)
          // create a 2px black border around the edge
          finalContext.strokeStyle = '#000000'
          finalContext.lineWidth = 2
          finalContext.strokeRect(
            1,
            1,
            finalCanvas.width - 2,
            finalCanvas.height - 2
          )
          resolve('success')
        }
        brandingImage.onerror = reject
        brandingImage.src = require('~/assets/img/locket-branding.jpg')
      }).catch()
    }
    const addImage = function(print, finalCanvas, xPos) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        const margin = 10
        const finalContext = finalCanvas.getContext('2d')
        img.onload = () => {
          let yPos = 2 * margin
          while (yPos + img.height < finalCanvas.height) {
            finalContext.drawImage(img, xPos, yPos)
            yPos += img.height + margin
          }
          // We should only do this once, when all the images are done.
          // const dataURL = finalCanvas.toDataURL('image/jpeg')
          // const dataURL300 = changeDpiDataUrl(dataURL, 300)
          resolve(xPos + img.width + margin)
        }
        img.onerror = reject
        img.src = print
      }).catch()
    }

    // Add branding, then add each image, then save dataURL with this.setFinalImage
    const createFinal = async () => {
      const finalCanvas = document.createElement('canvas')
      finalCanvas.width = 1800
      finalCanvas.height = 1200
      const finalContext = finalCanvas.getContext('2d')

      // This may help with pixelated resizing
      finalContext.imageSmoothingQuality = 'high'
      finalContext.webkitImageSmoothingEnabled = true
      finalContext.mozImageSmoothingEnabled = true
      finalContext.imageSmoothingEnabled = true /// future

      // clear the canvas
      finalContext.clearRect(0, 0, finalCanvas.width, finalCanvas.height)
      finalContext.fillStyle = 'white'
      finalContext.fillRect(0, 0, finalCanvas.width, finalCanvas.height)

      // initial starting position (based on branding image width + margin)
      let xPos = 310
      await addBranding(finalCanvas)
      for (let index = 0; index < this.images.length; index++) {
        const image = this.images[index]
        if (image.print) {
          xPos = await addImage(image.print, finalCanvas, xPos)
        }
      }
      const dataURL = finalCanvas.toDataURL('image/jpeg')
      const dataURL300 = changeDpiDataUrl(dataURL, 300)
      this.setFinalImage(dataURL300)
    }
    createFinal()
  },
  methods: {
    ...mapActions({
      setFinalImage: 'app/setFinalImage'
    }),
    downloadImage() {
      const blob = b64toBlob(this.finalImage, 'image/jpeg')
      if (window.navigator.msSaveBlob) {
        // // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
        window.navigator.msSaveOrOpenBlob(blob, 'locketStudio-4x6.jpg')
      } else {
        const a = window.document.createElement('a')
        a.href = window.URL.createObjectURL(blob, { type: 'image/jpeg' })
        a.download = 'locketStudio-4x6.jpg'
        document.body.appendChild(a)
        a.click() // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
        document.body.removeChild(a)
      }
    },
    print() {
      // replace title of page so that it doesn't print
      // passing blank space just makes it revert to printing the url
      const originalTitle = document.title
      document.title = '-'
      // kludge window.print for chrome/firefox execCommand for Safari
      window.print()
      document.execCommand('print', false, null)
      document.title = originalTitle
    },
    back() {
      this.$router.push({ path: '/app/upload' })
    }
  }
}
</script>

<style>
#wrapper main.final {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
#finalImage {
  max-height: 80vh;
  max-width: 80vw;
  height: auto;
  width: auto;
}
@media print {
  @page {
    /* 6in x 4in. */
    size: 152.4mm 101.6mm;
    margin: 0mm;
  }
  html,
  body {
    /* prevent 2nd blank page from printing */
    width: 6in !important;
    height: 4in !important;
    margin: 0 !important;
    overflow: hidden !important;
    padding: 0 !important;
    position: relative !important;
  }
  body * {
    border: 0 !important;
    height: 100vh !important;
    left: 0 !important;
    margin: 0 !important;
    outline: 0 !important;
    padding: 0 !important;
    position: absolute !important;
    top: 0 !important;
    width: 100vw !important;
    overflow: hidden !important;
    transition: none;
    visibility: hidden !important;
  }
  body #finalImage {
    border: 1px solid #000000;
    bottom: 0 !important;
    display: block !important;
    height: 400px !important;
    height: 4in !important;
    left: 0;
    margin: 0 auto !important;
    overflow: visible !important;
    position: absolute !important;
    top: 0;
    width: 600px !important;
    width: 6in !important;
    visibility: visible !important;
    z-index: 999 !important;
  }
}
</style>
