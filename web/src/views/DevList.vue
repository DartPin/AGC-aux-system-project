<template>
    <v-container>
        <h1>Перечень моделей в развитии</h1>
        <v-container class="elevation-1">
            <v-row>
                <v-col>
                    <v-data-table :headers="headers" :items="devList" :items-per-page="20" class="elevation-1">
            
                    </v-data-table>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script>
    export default{
        data(){
            return{
                headers: [
                    { text: "Модель", align: 'center', value: "" },
                    { text: "Резка", align: 'center', value: "" },
                    { text: "Печать", align: 'center', value: "" },
                    { text: "Печь", align: 'center', value: "" },
                    { text: "Сборка", align: 'center', value: "" },
                    { text: "Финал", align: 'center', value: "" },
                    { text: "", align: 'center', value: "" },
                ],
                devList: []
            }
        }
    }
</script>