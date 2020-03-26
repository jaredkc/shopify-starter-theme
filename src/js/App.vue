<template>
  <div id="vue-app">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello from a Vue app!',
    };
  },
};
</script>

<style scoped>
#vue-app {
  background-color: silver;
  color: coral;
  margin: 1rem;
  padding: 1rem;
  text-align: center;
}
</style>
