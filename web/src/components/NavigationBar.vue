
<template>
    <v-app-bar elevation="4" max-height="60px">
        <v-menu transition="slide-x-transition">
            <template v-slot:activator="{ on }" >
                <v-app-bar-nav-icon v-on="on"></v-app-bar-nav-icon>
            </template>

            <v-card 
            class="mx-auto"
            width="300"
            height="100%">
                <v-list dense v-for="element of menuItems">
                <v-subheader>{{element.nameBlock.toUpperCase()}}</v-subheader>
                <v-list-item-group
                    color="primary"
                >
                    <v-list-item
                    v-for="(item, i) in element.items"
                    :key="i"
                    >
                    <v-list-item-content>
                        <router-link :to="item.path">
                            <v-list-item-title v-text="item.nameItem" ></v-list-item-title>
                        </router-link>
                    </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                </v-list>
            </v-card>  
        </v-menu>
        <img src="@/assets/LogoAGC.png" alt="" class="logo">
        <v-spacer></v-spacer>
        <v-avatar
            color="grey darken-1"
            size="40"
            ><v-icon dark>
            mdi-account-circle
        </v-icon>
        </v-avatar>
    </v-app-bar>
</template>

<script>
    import menuItems from '@/data/menuItems';

    export default {
    data: () => ({
    
    }),
    computed: {
        menuItems(){
            return menuItems
        }
    }
  }
</script>

<style scoped>
   .v-menu__content{
    margin: 53px 0 0 -10px;
    height: 100%;
   }
   .logo{
    height:100%;
    margin: -15px 0 0 0;
   }
</style>