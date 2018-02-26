<template>
  <div class="ui form container padding top">
    <div class="padding bottom">
      <div class="fields vertical middle">
        <div class="four wide field">
          <select class="ui fluid selection search dropdown name1" v-model="match.participant1">
            <option value="0">Primer participante</option>
            <option v-for="participant in filteredRank2" v-bind:key="participant.key" 
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
              <select class="ui fluid search selection dropdown name2" v-model="match.participant2">
                <option value="0">Segundo participante</option>
                <option v-for="participant in filteredRank1" v-bind:key="participant.key" 
                  :value="participant.key">{{ participant.name }}</option> 
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="ui vertical animated button large" v-on:click.prevent="addMatch">
        <div class="visible content">Añadir</div>
        <div class="hidden content">
          <i v-if="validMatch" class="check icon"></i>
          <i v-else class="thumbs down icon"></i>
        </div>
      </div>
    </div>
    <div class="ui horizontal divider">
        ||
    </div>
  </div>
</template>

<script>
import db from '../db' 
import comparatorRank from '../utils'

export default {
  name: 'Matches',
  firebase: {
    rank: db.ref('rank'),
    matches: db.ref('matches')
  },
  data() {
    return {
      rank: this.rank,
      matches: this.matches,
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
      const name1 = $(this.$el).find('.name1 select').val();
      const name2 = $(this.$el).find('.name2 select').val();
      return Object.values(this.match).filter(prop => prop && prop !== '0').length === Object.values(this.match).length
        && name1 !== name2;
    },
    sortedRank: function() {
      return this.rank.sort(this.comparatorRank);
    },
    filteredRank1: function() {
      return this.filterRank(this.match.participant1);      
    },
    filteredRank2: function() {
      return this.filterRank(this.match.participant2);
    }
  },
  methods: {
    addMatch: function() {
      if (!this.validMatch) return;
      let matchResultObj = this.getResult();
      this.addMatchToDataBase();
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

          this.refreshPositions(updatePositionLoser, updatePositionWinner);
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
    addMatchToDataBase: function() {
      const actualDay = new Date().getDate();
      const actualMonth = new Date().getMonth() + 1;
      const actualYear = new Date().getUTCFullYear();
      this.$firebaseRefs.matches.child(`${actualDay}-${actualMonth}-${actualYear}`)
        .once('value')
        .then(function(snapshot){
          const name1 = $(this.$el).find('.name1 option:selected').text();
          const name2 = $(this.$el).find('.name2 option:selected').text();
          snapshot.ref.push(Object.assign({}, this.match, {name1, name2}));
        }.bind(this));
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
    },
    refreshPositions: function(updatePositionLoser, updatePositionWinner) {
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
        .then(function(){
          this.resetForm();
        }.bind(this));
    },
    resetForm: function() {
      this.match.participant1 = '';
      this.match.participant2 = '';
      this.match.score1 = '';
      this.match.score2 = '';
      $(this.$el).find('.name1 select').val('0');
      $(this.$el).find('.name2 select').val('0');
    },
    filterRank: function(participantId) {
      if (participantId === '0') return this.rank;
      const position = this.rank.find(item => item.key === participantId).position;
      return this.rank.filter(item => Math.abs(item.position - position) <= 2 && item.position !== position);
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
.padding.bottom {
  padding-bottom: 50px;
}
.vertical.middle {
  align-items: center;
}
</style>
