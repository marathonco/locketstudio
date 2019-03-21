<template>
  <nav
    id="nav"
    :class="menuIsActive ? 'is-active' : ''"
    role="navigation"
  >
    <Hamburger />
    <ul class="nav-menu">
      <li
        v-for="(item, key) of menu"
        :key="key"
      >
        <nuxt-link
          :to="item.to"
          active-class="is-active"
        >{{ item.title }}</nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import menu from '~/data/menu.json'
import { mapGetters } from 'vuex'
import Hamburger from '~/components/layout/Hamburger'

export default {
  components: {
    Hamburger
  },
  computed: {
    ...mapGetters({ menuIsActive: 'layout/menuIsActive' }),
    menu() {
      return [...menu]
    }
  }
}
</script>

<style lang="scss">
$menu-animation-duration: 0.75s;
$drawer-width-small: auto;

#nav {
  // nav-drawer
  background-color: white;
  box-shadow: -0 0 0 rgba(0, 0, 0, 0.5);
  height: 100%;
  position: fixed;
  right: 0;
  transition-property: transform, box-shadow;
  transition-duration: $menu-animation-duration;
  transition-timing-function: ease-in-out;
  transform: translateX(100%);
  width: $drawer-width-small;
  &.is-active {
    box-shadow: -5px 0 5px rgba(0, 0, 0, 0.25);
    transform: translateX(0);
    z-index: 1300;
    .nav-menu li a {
      transform: translateY(0);
    }
  }
  .nav-menu {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  li {
    position: relative;
    width: 100%;
    a {
      @include font-accent;
      color: getColor(text, ui);
      display: block;
      padding: 1.5rem 80px 1.5rem 100px;
      transition: color 0.3s ease-in-out, transform 0.75s ease-in-out;
      text-align: center;
      text-decoration: none;
      text-transform: uppercase;
      transform: translateY(100vh);
      width: 100%;
      will-change: color, transform;
      &::before {
        background-color: $brand3;
        height: 100%;
        left: 0;
        bottom: 0;
        transition: width 0.3s ease-out, height 0.3s ease-out;
        width: 0;
        will-change: width, height;
      }
      &.is-active,
      &.is-active:hover {
        color: contrast-color($brand4);
        &::before {
          background-color: $brand4;
          width: 100%;
        }
      }
      &:hover {
        color: contrast-color($brand3);
        &::before {
          width: 100%;
        }
      }
    }
  }

  // nav-bar
  @media #{$m-up} {
    height: auto;
    position: relative;
    transform: none;
    width: 100%;
    .nav-menu {
      flex-direction: row;
      width: 100%;
      li {
        width: auto;
        display: inline-block;
        a {
          display: inline-block;
          padding: 1.5rem 1rem;
          transition: background 1s ease-in-out;
          transform: translateY(0);
          will-change: background;
          &::before {
            width: 100%;
            height: 0;
          }
          &:hover,
          &.is-active,
          &.is-active:hover {
            &::before {
              height: 100%;
            }
          }
          &.is-active {
            &:hover {
              cursor: default !important;
            }
          }
        }
      }
    }
  }
}
</style>
