<template>
  <div>
    <div class="ui attached stackable menu">
      <div class="ui container">
        <router-link class="item" v-bind:class="{ active: $route.name === 'Main' }" to="/">
          <i class="home icon"></i> Ranking
        </router-link>
        <router-link class="item" v-bind:class="{ active: $route.name === 'Final' }" to="/final">
          <i class="grid layout icon"></i> Fase final
        </router-link>
        <router-link class="item" v-bind:class="{ active: $route.name === 'Rules' }" to="/rules">
          <i class="book icon"></i> Reglas
        </router-link>
        <a class="right item">
          <i class="user circle outline icon"></i> Login
        </a>
      </div>
    </div>
    <h1 class="ui icon header padding">
      <div class="content">
        MadPingPong 
        <div class="sub header">
          Primer ranking oficial de ping pong de la oficina de Madrid
        </div>
      </div>
    </h1>
    <div class="ui horizontal divider">
        ||
      </div>
  </div>
</template>


<script>
export default {
  name: 'Header',
  data() {
    return {
      msg: 'HEADER'
    }
  }
}
</script>

<style scoped>
.header.padding {
  padding: 30px;
}
.item.active {
  background: grey;
}
</style>