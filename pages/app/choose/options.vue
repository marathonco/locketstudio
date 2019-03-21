<template>
  <main>
    <section class="instructions">
      <h3>Choose a spot for this photo:</h3>
      <p>Which part of your locket is this photo going into?</p>
    </section>
    <section>
      <div class="actions actions-inline">
        <button
          v-for="(option, key) of options"
          :key="key"
          @click="crop(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </section>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  transition: {
    name: 'slide-left'
  },
  computed: {
    ...mapGetters({
      filteredLockets: 'app/getFilteredLockets'
    }),
    options() {
      const locket = this.filteredLockets[0]
      return locket.options
    }
  },
  methods: {
    ...mapActions({
      setCurrentTemplate: 'app/setCurrentTemplate'
    }),
    crop(value) {
      const locket = this.filteredLockets[0]
      this.setCurrentTemplate(locket.label + value)
      this.$router.push({ path: '/app/crop' })
    }
  }
}
</script>

<style></style>
