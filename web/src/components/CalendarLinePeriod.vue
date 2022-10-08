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
          v-model="dateRangeText"
          outlined
          label="Дата"
          prepend-icon="mdi-calendar"
          readonly
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="date"
        locale="RU-ru"
        range
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
        date: ['2022-09-10', '2022-09-20'],
        menu: false,
      }
    },
    computed:{
      dateRangeText () {
        console.log(this.date)
        return this.date.join(' ~ ')
      },
    },
    watch: {
        date(newValue, oldValue) {
        this.$emit('returnDate', this.date)
        }
    }
  }
</script>
