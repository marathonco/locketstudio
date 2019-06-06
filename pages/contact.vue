<template>
  <main>
    <div v-if="formData.status !== 'sent'">
      <h1>Contact</h1>
      <form
        class="panel"
        name="contact"
        netlify-honeypot="emailField"
        data-netlify="true"
        method="POST"
        @submit.prevent="processForm"
      >
        <input
          type="hidden"
          name="form-name"
          value="contact"
        >
        <p class="nope">
          <input
            v-model="formData.nameField"
            v-validate="{regex: /^\z/ }"
            type="text"
            name="nameField"
          >
        </p>
        <p class="nope">
          <input
            v-model="formData.emailField"
            type="text"
            name="emailField"
          >
        </p>
        <p>
          <input
            id="name"
            v-model="formData.name"
            v-validate="{required: true, regex: /^([a-zA-Z ']*)$/ }"
            type="text"
            class="form-field"
            name="name"
          >
          <label for="name">
            Name:
          </label>
          <span
            v-show="errors.has('name')"
            class="error"
          >
            {{ errors.first('name') }}
          </span>
        </p>
        <p>
          <input
            id="email"
            v-model="formData.email"
            v-validate="{required: true, email: true}"
            type="text"
            class="form-field"
            name="email"
          >
          <label for="email">
            Email:
          </label>
          <span
            v-show="errors.has('email')"
            class="error"
          >
            {{ errors.first('email') }}
          </span>
        </p>
        <p class="nope">
          <label for="nope">
            Email:
          </label>
          <input
            id="required"
            v-model="formData.nope"
            type="text"
            class="form-field"
            name="nope"
          >
        </p>
        <p>
          <textarea
            id="message"
            v-model="formData.message"
            v-validate="{required: true}"
            class="form-field"
            name="message"
          />
          <label for="message">Message:</label>
          <span v-show="errors.has('message')" class="error">{{ errors.first('message') }}</span>
        </p>
        <button :disabled="!validForm" :class="validForm ? 'success':'disabled'" type="submit" class="button submit" @click.prevent="processForm">
          Send
        </button>
      </form>
    </div>
    <div v-else class="sent">
      <h4>Message Sent</h4>
      <h4>{{ formData.name }}, thank you for contacting us.</h4>
    </div>
    <div v-show="formData.status === 'error'">
      <p>There is a problem with one or more fields. Please check all the fields are correct.</p>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import { ErrorBag } from 'vee-validate'

export default {
  data() {
    return {
      formData: {
        name: '',
        email: '',
        message: '',
        emailField: '',
        template: '',
        status: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      currentTemplate: 'app/getCurrentTemplate'
    }),
    errors() {
      const errors = new ErrorBag()
      return errors
    },
    validForm() {
      if (
        this.formData.name &&
        this.formData.email &&
        this.formData.message &&
        !this.errors.any()
      ) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    encode(data) {
      return Object.keys(data)
        .map(
          key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
        )
        .join('&')
    },
    processForm(e) {
      this.$validator.validateAll().then(result => {
        if (!result) {
          this.formData.status = 'error'
        } else {
          if (this.template) {
            this.formData.template = this.template
          }
          fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: this.encode({
              'form-name': 'contact',
              ...this.formData
            })
          })
            .then(() => {
              this.formData.status = 'sent'
              return true
            })
            .catch(() => {
              this.formData.status = 'error'
              return false
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.nope {
  @include hide;
}
form {
  margin-bottom: 1rem;
  max-width: 100%;
  p {
    margin: 2rem auto;
    max-width: 100%;
    position: relative;
    text-align: center;
    width: 400px;
  }
}
label,
input,
textarea,
button {
  display: block;
  outline: none;
}
input:not([type='submit']),
textarea {
  color: #333333;
  padding: 1rem;
  text-align: left;
  transition: all 0.3s linear;
  width: 100%;
  will-change: box-shadow, background, color;
  &:focus {
    color: #333333;
  }
}
textarea {
  height: 8rem;
}

label {
  color: getColor(text, secondary);
  cursor: text;
  font-size: 1rem;
  left: 1rem;
  position: absolute;
  transition: top 0.3s ease-in-out, font-size 0.3s ease-in-out;
  will-change: top, font-size;
  top: 1rem;
  z-index: 2;
}
input:focus,
textarea:focus,
input.dirty,
textarea.dirty {
  & ~ label {
    font-size: 1rem;
    top: -1.4rem;
  }
}

span.error {
  @include font-accent;
  color: getColor(text, primary);
  font-size: 1rem;
  right: 1rem;
  position: absolute;
  text-align: right;
  top: -1.4rem;
}

input.invalid,
textarea.invalid {
  border-color: getColor(state, error);
}
input.valid,
textarea.valid {
  &:not(:focus) {
    border-color: getColor(state, success);
  }
}
button.submit {
  margin: 0 auto;
  padding-left: 2rem;
  padding-right: 2rem;
  &.invalid {
    background-color: getColor(state, disabled);
  }
}
</style>
