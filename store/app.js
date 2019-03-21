import Vue from 'vue'
import Vuex from 'vuex'
import lockets from '~/data/lockets'

Vue.use(Vuex)

const state = () => ({
  // an array of image objects
  images: [],
  currentImage: null,
  // object with shape, size, type and/or label
  currentCode: {},
  currentTemplate: '',
  filteredLockets: lockets,
  finalImage: null
})

const getters = {
  getImages(state) {
    return state.images
  },
  getCurrentImage(state) {
    return state.currentImage
  },
  getFilteredLockets(state) {
    return state.filteredLockets
  },
  getCurrentCode(state) {
    return state.currentCode
  },
  getCurrentTemplate(state) {
    return state.currentTemplate
  },
  getFinalImage(state) {
    return state.finalImage
  }
}

const mutations = {
  // update the array of possible lockets from data/lockets.json using $state.currentCode
  // payload is currentCode
  UPDATE_FILTERED_LOCKETS(state, payload) {
    state.filteredLockets = lockets.filter(function (dat) {
      let check = true
      Object.keys(payload).forEach((element) => {
        if (!Object.values(dat).includes(payload[element])) {
          check = false
        }
      })
      if (check) {
        return true
      }
    })
  },
  // receives image source URL and stores it as a new image
  ADD_IMAGE(state, payload) {
    const newID =
      state.images.length === 0 ? 0 : state.images[state.images.length - 1].id + 1
    const image = {
      id: newID,
      source: payload.source,
      preview: payload.source,
      print: null
    }
    state.images.push(image)
  },
  REMOVE_IMAGE(state, payload) {
    // find the corresponding image and remove it.
    state.images.forEach(function (item, index, object) {
      // test for other images that share this source before revoking it
      if (item.id === payload.id) {
        const test = object.some(function (o) {
          return o.source === payload.source
        })
        if (test !== true) {
          URL.revokeObjectURL(item.source)
        }
        object.splice(index, 1)
      }
    })
  },
  UPDATE_PREVIEW(state, payload) {
    // update the preview of the image with a new payload
    state.images.forEach(function (item) {
      if (item.id === payload.id) {
        item.preview = payload.preview
      }
    })
  },
  UPDATE_PRINT(state, payload) {
    // update the print-ready version of the image with a new payload
    state.images.forEach(function (item) {
      if (item.id === payload.id) {
        item.print = payload.print
      }
    })
  },
  DUPLICATE_IMAGE(state, payload) {
    const newID = state.images[state.images.length - 1].id + 1
    const duplicate = {
      id: newID,
      source: payload.source,
      preview: payload.source
    }
    state.images.push(duplicate)
  },
  SET_CURRENT_IMAGE(state, payload) {
    state.currentImage = payload
  },
  SET_CURRENT_CODE(state, payload) {
    state.currentCode = payload
  },
  SET_CURRENT_TEMPLATE(state, payload) {
    state.currentTemplate = payload
  },
  SET_FINAL_IMAGE(state, payload) {
    state.finalImage = payload
  },
  RESET(state) {
    state.images = []
    state.currentImage = null
    state.currentCode = {}
    state.currentTemplate = ''
    state.filteredLockets = lockets
    state.finalImage = null
  }
}

const actions = {
  reset({
    commit
  }) {
    commit('RESET')
  },
  addImage({
    commit
  }, payload) {
    commit('ADD_IMAGE', payload)
  },
  removeImage({
    commit
  }, payload) {
    commit('REMOVE_IMAGE', payload)
  },
  updatePreview({
    commit
  }, payload) {
    commit('UPDATE_PREVIEW', payload)
  },
  updatePrint({
    commit
  }, payload) {
    commit('UPDATE_PRINT', payload)
  },
  duplicateImage({
    commit
  }, payload) {
    commit('DUPLICATE_IMAGE', payload)
  },
  setCurrentImage({
    commit
  }, payload) {
    commit('SET_CURRENT_IMAGE', payload)
  },
  setCurrentCode({
    commit
  }, payload) {
    commit('SET_CURRENT_CODE', payload)
    commit('UPDATE_FILTERED_LOCKETS', payload)
  },
  setCurrentTemplate({
    commit
  }, payload) {
    commit('SET_CURRENT_TEMPLATE', payload)
  },
  setFinalImage({
    commit
  }, payload) {
    commit('SET_FINAL_IMAGE', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
