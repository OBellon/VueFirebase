<template>
  <div class="ui container padding top bottom big">
    <MainTable></MainTable>
  </div>
</template>

<script>
import MainTable from './MainTable'
import Header from './Header'

export default {
  name: 'Main',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    MainTable,
    Header
  }
}
</script>

<style scoped>
.padding.top {
  padding-top: 30px;
}
.padding.bottom.big {
  padding-bottom: 60px;
}
</style>

