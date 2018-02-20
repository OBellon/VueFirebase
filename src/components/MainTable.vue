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
        <transition-group name="flip-list" tag="tbody">
          <tr v-bind:class="{ editing: participant.key === editedKey }" v-for="participant in sortedRank" v-bind:key="participant.key" >
            <td>{{ participant.name }}</td>
              <td v-on:dblclick.prevent="editPoints(participant)">
            <v-touch v-on:doubletap.prevent="editPoints(participant)" class="vertical middle">
                
                <span class="points">{{ participant.points }}</span>
                <div class="editPoints ui input">
                  <input class="edit" type="text"
                    v-model="editParticipant.points"
                    v-on:keyup.enter.prevent="doneEdit(participant)"
                    v-on:keyup.esc.prevent="cancelEdit(participant)">       
                </div> 
                </v-touch>   
              </td>
            
              <td v-on:dblclick.prevent="editPoints(participant)">
                <v-touch v-on:doubletap.prevent="editPoints(participant)" class="vertical middle">

                <span class="matches">{{ participant.matches }}</span>
                <div class="ui input">
                  <input class="edit" type="text"
                    v-model="editParticipant.matches"
                    v-on:keyup.enter.prevent="doneEdit(participant)"
                    v-on:keyup.esc.prevent="cancelEdit(participant)">       
                </div>    
                </v-touch>
              </td>
                    
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
      },
      editParticipant: {
        points: 0,
        matches: 0
      },
      editedKey: null
    }
  },
  computed: {
    sortedRank: function(rank) {
      return this.rank.sort(this.comparatorRank);
    }
  },
  methods: {
    addParticipant: function(evt) {
      if (this.newParticipant.name) {
        var dateMilliseconds = '-' + new Date().getTime();
        db.ref(`rank/${dateMilliseconds}`).set(Object.assign({}, this.newParticipant, {key: dateMilliseconds}));
        this.newParticipant.name = '';
        evt.target.blur();
      }
    },
    editPoints: function(participant) {
      this.editParticipant.points = participant.points;
      this.editParticipant.matches = participant.matches;
      this.editedKey = participant.key;
      setTimeout(() => this.$el.querySelector('.editing .editPoints .edit').focus(), 0);
    },   
    doneEdit: function() {
      db.ref(`rank/${this.editedKey}`)
        .update({ 
          points: this.editParticipant.points, 
          matches: this.editParticipant.matches
        })
        .then(() => { 
          this.editedKey = null;
        });
    },
    cancelEdit: function() {
      this.editedKey = null;
    }
  }
}
</script>

<style lang="css" scoped>
.flip-list-move {
  transition: transform 1s;
}
.edit {
  display: none;
}
.editing .edit {
  display: inline;
}
.editing .points {
  display: none;
}
.editing .matches {
  display: none;
}
tr td:first-child {
  width: 100px;
}
tr:nth-child(-n+4) {
  background: lightgreen;
}
.legend {
  background: lightgreen; 
  padding: .92857143em 1.14285714em;
  line-height: 1;
}
td,
.vertical.middle {
  height: 60px;
  width: 250px;
}
.vertical.middle {
  vertical-align: middle;
  height: 50px;
  display: table-cell;
}
</style>

