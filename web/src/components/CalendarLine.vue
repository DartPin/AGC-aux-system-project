<template>
    <div>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on}">
        <v-text-field
          v-model="date"
          outlined
          label="Дата"
          prepend-icon="mdi-calendar"
          readonly
          v-on="on"
          dense
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="date"
        locale="RU-ru"
      ></v-date-picker>
    </v-menu>
  </div>
</template>  

<script>
    export default {
    model:{
        prop: 'date',
        event: 'returnDate'
    },
    data(){
      return{
        date: null,
        menu: false,
      }
    },
    watch: {
        date(newValue, oldValue) {
        this.$emit('returnDate', this.date)
        }
    }
  }
</script>
