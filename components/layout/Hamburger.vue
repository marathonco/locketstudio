<template>
  <div
    :class="menuIsActive ? 'is-active' : ''"
    class="menu-button"
  >
    <input
      id="menu-toggle"
      class="menu-toggle"
      type="checkbox"
      @change="toggleMenu"
    >
    <label
      class="menu-toggle-label"
      for="menu-toggle"
    >
      <span class="menu-toggle-icon" />
    </label>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters({ menuIsActive: 'layout/menuIsActive' })
  },
  methods: {
    ...mapActions({ toggleMenu: 'layout/toggleMenu' })
  }
}
</script>

<style lang="scss" scoped>
$toggle-animation-duration: 1s;
$toggle-size: 40px;

$toggle-color: black;
$toggle-color-hover: pink;
$toggle-color-active: green;
$toggle-color-scrolled: yellow;

@mixin toggleColor($color, $hoverColor) {
  .menu-toggle:focus ~ .menu-toggle-label {
    border-color: $color;
    color: $color;
  }
  .menu-toggle-label:hover {
    border-color: $hoverColor;
    color: $hoverColor;
    .menu-toggle-icon,
    .menu-toggle-icon:before,
    .menu-toggle-icon::after {
      background-color: $hoverColor;
    }
  }
  .menu-toggle-icon,
  .menu-toggle-icon:before,
  .menu-toggle-icon::after {
    background: $color;
  }
}

@include toggleColor($toggle-color, $toggle-color-hover);

.menu-button {
  position: absolute;
  left: -$toggle-size - 10px;
  transition: left $toggle-animation-duration
    cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: left;
  z-index: 1400;
  @media #{$l-up} {
    display: none;
  }
}

.menu-toggle {
  left: -9999px;
  position: absolute;
  top: -9999px;
}

.menu-toggle-label {
  cursor: pointer;
  display: block;
  height: $toggle-size;
  position: fixed;
  transition: all 400ms ease-in-out;
  top: 15px;
  user-select: none;
  -webkit-tap-highlight-color: rgba(
    0,
    0,
    0,
    0
  ); // Removes grey background on link taps in ios
  width: $toggle-size;
  will-change: width, border, color, background;
  z-index: 1400;
  // &:active {
  //   -webkit-tap-highlight-color: rgba(
  //     0,
  //     0,
  //     0,
  //     0
  //   ); // Removes grey background on link taps in ios
  // }
}

.menu-toggle-icon,
.menu-toggle-icon:before,
.menu-toggle-icon::after {
  content: '';
  cursor: pointer;
  display: block;
  height: 4px;
  left: 50%;
  position: absolute;
  top: 50%;
  transition: all $toggle-animation-duration ease-in-out;
  width: $toggle-size;
}
.menu-toggle-icon {
  transform: translate3d(-50%, -4px, 0);
}
.menu-toggle-icon:before {
  transform: translate3d(-50%, -14px, 0);
}
.menu-toggle-icon::after {
  transform: translate3d(-50%, 10px, 0);
}

.scrolled {
  @include toggleColor($toggle-color-scrolled, $toggle-color-scrolled);
}

.menu-button.is-active {
  @include toggleColor($toggle-color-active, $toggle-color-active);
  left: 10px;
  .menu-toggle-label:hover .menu-toggle-icon,
  .menu-toggle-icon {
    width: 0;
  }
  .menu-toggle-icon {
    &::before {
      transform: translateX(-50%) rotate(45deg);
      top: 0;
    }
    &::after {
      transform: translateX(-50%) translateY(-10px) rotate(-45deg);
      top: 10px;
    }
  }
  .menu-toggle-icon,
  .menu-toggle-icon,
  .menu-toggle-icon:hover {
    background-color: transparent !important;
  }
}
</style>
