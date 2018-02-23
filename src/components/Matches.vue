<template>
  <div class="ui form container padding top">
    <div class="fields vertical middle">
      <div class="four wide field">
        <select class="ui fluid selection search dropdown" v-model="match.participant1">
          <option value="0">Primer participante</option>
          <option v-for="participant in rank" v-bind:key="participant.key" 
                :value="participant.key">{{ participant.name }}</option> 
        </select>
      </div>
      <div class="four wide field">
        <input type="text" v-model="match.score1" placeholder="0" />
      </div>
      <div>vs.</div>
      <div class="four wide field">
        <input type="text" v-model="match.score2" placeholder="0" />
      </div>
      <div class="four wide field">
        <div class="one field">
          <div class="field">
            <select class="ui fluid search selection dropdown" v-model="match.participant2">
              <option value="0">Segundo participante</option>
              <option v-for="participant in rank" v-bind:key="participant.key" 
                :value="participant.key">{{ participant.name }}</option> 
            </select>
          </div>
        </div>
      </div>
    </div>
    <button class="ui button" v-on:click.prevent="addMatch">
      Añadir
    </button>
  </div>
</template>

<script>
import db from '../db' 
import comparatorRank from '../utils'

export default {
  name: 'Matches',
  firebase: {
    rank: db.ref('rank')
  },
  data() {
    return {
      rank: this.rank,
      comparatorRank: comparatorRank,      
      match: {
        participant1: '0',
        participant2: '0',
        score1: null,
        score2: null
      }
    }
  },
  computed: {
    validMatch: function() {
      return Object.values(this.match).filter(prop => prop && prop !== '0').length === Object.values(this.match).length;
    },
    sortedRank: function() {
      return this.rank.sort(this.comparatorRank);
    }
  },
  methods: {
    addMatch: function() {
      let matchResultObj = this.getResult();
      let loser = this.getRank(matchResultObj.loser);
      let winner = this.getRank(matchResultObj.winner);
      Promise.all([loser, winner])
        .then(function(values){
          const loser = values[0];
          const winner = values[1];
          if (parseInt(loser.position) > parseInt(winner.position)) {
            winner.points = parseInt(winner.points) + 1;
          } else {
            let loserPoints = parseInt(loser.points) - 1;
            loser.points = loserPoints < 0 ? 0 : loserPoints;
            winner.points = parseInt(winner.points) + 2;
          }
          winner.matches = parseInt(winner.matches) + 1;
          loser.matches = parseInt(loser.matches) + 1;
          let updatePositionLoser = this.updatePositions(loser);
          let updatePositionWinner = this.updatePositions(winner);

          Promise.all([updatePositionLoser, updatePositionWinner])
            .then(function(values){
              this.sortedRank.forEach(function(participant){
                let index = this.sortedRank.findIndex(item => item.key === participant.key);
                this.$firebaseRefs.rank.child(participant.key)
                  .once('value')
                  .then(function(snapshot){
                    snapshot.ref.update({position: index + 1})
                  });
              }.bind(this));
            }.bind(this))
        }.bind(this));

    },
    getResult: function() {
      let matchObj = {
        loser: {
          participantId: '',
          score: Math.min(this.match.score1, this.match.score2)
        },
        winner: {
          participantId: '',
          score: Math.max(this.match.score1, this.match.score2)
        }
      };
      matchObj.loser.participantId = this.match.score1 < this.match.score2 ? this.match.participant1 : this.match.participant2; 
      matchObj.winner.participantId = this.match.score1 < this.match.score2 ? this.match.participant2 : this.match.participant1; 
      return matchObj;
    },
    getRank: function(participant) {
      return this.$firebaseRefs.rank.child(participant.participantId)
        .once('value')
        .then(function(snapshot) {
          return snapshot.val();
        });
    },
    updatePositions: function(participant) {
      return this.$firebaseRefs.rank.child(participant.key)
        .once('value')
        .then(function(snapshot) {
          return snapshot.ref.update(participant);
        });
    }
  },
  mounted: function () {
    this.$nextTick(function() {
      $(this.$el).find('.selection').dropdown();
    })
  }
}
</script>

<style scoped>
.container.padding.top {
  padding-top: 50px; 
}
.vertical.middle {
  align-items: center;
}
</style>