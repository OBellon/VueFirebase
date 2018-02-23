<template>
  <div class="ui container">
      <table class="ui celled table unstackable">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Puntos</th>
            <th>Partidos Jugados</th>
          </tr>
        </thead>
        <transition-group name="flip-list" tag="tbody" v-on:leave="afterLeave">
          <tr v-for="participant in sortedRank" v-bind:key="participant.key" >
            <td>{{ participant.name }}</td>
            <td>{{ participant.points }}</td>
            <td>{{ participant.matches }}</td>                    
          </tr>
        </transition-group>
        <tfoot>
          <tr>
            <th colspan="3">
              <div class="ui right floated pagination menu">
                <span class="legend">Jugarán fase final</span>
              </div>
          </th>
        </tr>
      </tfoot>
      </table>
        <div class="ui right labeled left icon input">
          <i class="add user icon"></i>
          <input type="text" v-model="newParticipant.name" 
              placeholder="Participante" v-on:keyup.enter="addParticipant" /> 
          <a class="ui tag label" v-on:click.prevent=addParticipant>
            Añadir
          </a>
        </div>
      </div>
  </template>

<script>
import db from '../db' 
import comparatorRank from '../utils'
export default {
  name: 'MainTable',
  firebase: {
    rank: db.ref('rank')
  },
  data() {
    return {
      rank: this.rank,
      comparatorRank: comparatorRank,
      newParticipant: {
        name: '',
        points: 0,
        matches: 0
      }
    }
  },
  computed: {
    sortedRank: function() {
      return this.rank.sort(this.comparatorRank);
    }
  },
  methods: {
    addParticipant: function(evt) {
      if (this.newParticipant.name) {
        var dateMilliseconds = '-' + new Date().getTime();
        db.ref(`rank/${dateMilliseconds}`).set(Object.assign({}, this.newParticipant, {key: dateMilliseconds, position: this.rank.length + 1}));
        this.newParticipant.name = '';
        evt.target.blur();
      }
    },
    afterLeave: function(el) {
      console.log('el', el);
      console.log('rank', this.sortedRank);
    }
  }
}
</script>

<style lang="css" scoped>
.flip-list-move {
  transition: transform 1s;
}
tr td:first-child {
  width: 100px;
}
tr:nth-child(-n+4) {
  background: lightgreen;
}
.legend {
  background: lightgreen; 
  padding: 1em;
  line-height: 1;
}
td {
  height: 60px;
  width: 250px;
}
</style>

