<template>
  <div v-if="matches.length" class="ui container padding top">
    <h1 class="ui header container padding bottom">Partidos</h1>
    <table v-for="day in matches" v-bind:key="day.key" class="ui striped table mini text center">
      <thead>
        <tr>
          <th colspan="5">
            <h3>{{ day[".key"] }}</h3>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="match in day" v-if="match.name1" v-bind:key="match.key" v-bind:class="whoIsWinner(match)">
          <td class="name">{{ match.name1 }}</td> 
          <td class="score">{{ match.score1 }}</td>
          <td class="divider">-</td>
          <td class="score">{{ match.score2 }}</td> 
          <td class="name">{{ match.name2 }}</td>
        </tr>
      </tbody>
    </table>
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
      matches: this.matches,
      whoIsWinner: function(match) {
        return match.score1 > match.score2 ? 'first' : 'second';
      }
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
.text.center {
  text-align: center;
}
table.mini {
  width: 400px;
  margin: 0 auto;
}
.name {
  width: 150px;
}
.score {
  width: 75px;
}
.divider {
  width: 20px;
}
</style>
