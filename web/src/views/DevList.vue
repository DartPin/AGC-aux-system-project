<template>
    <v-container>
        <v-container class="elevation-1">
            <v-row>
                <v-col cols="2"></v-col>
                <v-col cols="8">
                    <h1>Перечень моделей в развитии</h1>
                </v-col>
                <v-col cols="1">
                    <v-btn @click="newBlank()">+ДОБАВИТЬ</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-data-table :headers="headers" :items="developList" :items-per-page="20" class="elevation-1">
                        <template v-slot:item.cutting="{ item }">
                            <div v-if="item.statuses.cutting === 'планирование'" style="color:#120873">{{item.statuses.cutting}}</div>
                            <div v-if="item.statuses.cutting === 'в развитии'" style="color: #A68100	">{{item.statuses.cutting}}</div>
                            <div v-if="item.statuses.cutting === 'завершено'" style="color:#008500">{{item.statuses.cutting}}</div>
                        </template>
                        <template v-slot:item.printing="{ item }">
                            <div v-if="item.statuses.printing === 'планирование'" style="color:#120873">{{item.statuses.printing}}</div>
                            <div v-if="item.statuses.printing === 'в развитии'" style="color: #A68100	">{{item.statuses.printing}}</div>
                            <div v-if="item.statuses.printing === 'завершено'" style="color:#008500">{{item.statuses.printing}}</div>
                        </template>
                        <template v-slot:item.furnance="{ item }">
                            <div v-if="item.statuses.furnance === 'планирование'" style="color:#120873">{{item.statuses.furnance}}</div>
                            <div v-if="item.statuses.furnance === 'в развитии'" style="color: #A68100	">{{item.statuses.furnance}}</div>
                            <div v-if="item.statuses.furnance === 'завершено'" style="color:#008500">{{item.statuses.furnance}}</div>
                        </template>
                        <template v-slot:item.assembling="{ item }">
                            <div v-if="item.statuses.assembling === 'планирование'" style="color:#120873">{{item.statuses.assembling}}</div>
                            <div v-if="item.statuses.assembling === 'в развитии'" style="color: #A68100	">{{item.statuses.assembling}}</div>
                            <div v-if="item.statuses.assembling === 'завершено'" style="color:#008500">{{item.statuses.assembling}}</div>
                        </template>
                        <template v-slot:item.final="{ item }">
                            <div v-if="item.statuses.final === 'планирование'" style="color:#120873">{{item.statuses.final}}</div>
                            <div v-if="item.statuses.final === 'в развитии'" style="color: #A68100	">{{item.statuses.final}}</div>
                            <div v-if="item.statuses.final === 'завершено'" style="color:#008500">{{item.statuses.final}}</div>
                        </template>
                        <template v-slot:item.rowTests="{ item }">
                            {{item.rowTests[item.rowTests.length -1].dateTest}}
                        </template>
                        <template v-slot:item.action="{ item }">
                            <v-icon small class="mr-2" @click="editItem(item.id)">
                                mdi-pencil
                            </v-icon>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script>
import { httpServer } from "@/main";

    export default{
        data(){
            return{
                headers: [
                    { text: "Модель", align: 'center', value: "model" },
                    { text: "Резка", align: 'center', value: "cutting" },
                    { text: "Печать", align: 'center', value: "printing" },
                    { text: "Печь", align: 'center', value: "furnance" },
                    { text: "Сборка", align: 'center', value: "assembling" },
                    { text: "Финал", align: 'center', value: "final" },
                    { text: "Дата первого теста", align: 'center', value: 'devStatus[1].cutting'},
                    { text: 'Дата последнего действия', align: 'center', value: 'rowTests'},
                    { text: "", align: 'center', value: "action" },
                ],
                devList: [
                ]
            }
        },
        mounted(){
            httpServer.get(`Develop/DevList`)
            .then(response => (
                this.devList = response.data
            ))
        },
        methods:{
            editItem(item){
                let pathTo = "/Development/DevReportModel/"+item
                this.$router.push({path: pathTo, params: {id: "id"}});
            },
            newBlank(){
                let pathTo = "/Development/DevReportModel/" 
                this.$router.push({ path: pathTo});
            },
            returnLastDate(item) {
                alert(item)
            }
        },
        computed:{
            developList(){
                return this.devList
            },
           
        }
    }
</script>