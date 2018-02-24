<template>
  <div class="ui container padding top">
    <h1 class="ui header container padding bottom">Partidos</h1>
    <div v-for="day in matches" v-bind:key="day.key">
      <h2 class="ui header">{{ day[".key"] }}</h2>
      <div v-for="match in day" v-if="match.name1" v-bind:key="match.key">
        {{ match.name1 }} {{ match.score1 }} - {{ match.score2 }} {{ match.name2 }}
      </div>
    </div>
  </div>
</template>

<script>
import db from '../db'

export default {
  name: 'MatchesList',
  firebase: {
    matches: db.ref('matches')
  },
  data() {
    return {
      matches: this.matches
    }
  }
}
</script>

<style scoped>
.container.padding.top {
  padding-top: 50px; 
}
.container.padding.bottom {
  padding-bottom: 50px;
}
.vertical.middle {
  align-items: center;
}
</style>
