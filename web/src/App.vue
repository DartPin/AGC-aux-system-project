<template>
  <v-app id="app">
    <NavigationBar></NavigationBar>
    <router-view></router-view>
  </v-app>
</template>

<script>
  import axios from "axios"
  import Login from "@/views/Login.vue"
  import NavigationBar from '@/components/NavigationBar.vue';

  export default{
    components: {
      Login,
      NavigationBar
    }
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
