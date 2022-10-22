<template>
    <v-row class="print-block">
        <v-col>
            <v-container class="elevation-6">
                <v-row>
                    <v-col cols="2"></v-col>
                    <v-col cols="8">
                        <h2>План на тест</h2>
                    </v-col>
                    <v-col cols="2"></v-col>
                </v-row>
                <v-row>
                    <v-col col="1"></v-col>
                    <v-col cols="5" style="text-align:left">Модель: {{planTest.model}}</v-col>
                    <v-col cols="3" style="text-align:left">
                        Артикль: {{planTest.article}}
                    </v-col>
                    <v-col cols="3">Дата: {{planTest.dateTest}} </v-col>
                </v-row>
                <v-row>
                    <v-col col="1"></v-col>
                    <v-col cols="3" style="text-align:left">Основная цель теста:</v-col>
                    <v-col cols="8" style="text-align:left">{{planTest.mainGoal}}</v-col>
                </v-row>
                <v-simple-table class="elevation-1" style="margin-top: 30px">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Участок
                                </th>
                                <th class="text-left">
                                    Задание на тест по участкам и информация от технологов по результатам теста
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{planTest.productionPlace.name}}</td>
                                <td>{{planTest.plan}}</td>
                            </tr>
                            <tr>
                                <td>Утвердили</td>
                                <td>
                                    <v-row style="margin-top: 20px">
                                        <v-col class="bb">Должность:</v-col>
                                        <v-col class="bb">Фамилия Имя Отчество:</v-col>
                                        <v-col class="bb">Подпись:</v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col class="bb"></v-col>
                                        <v-col class="bb"></v-col>
                                        <v-col class="bb"></v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col class="bb"></v-col>
                                        <v-col class="bb"></v-col>
                                        <v-col class="bb"></v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col class="bb"></v-col>
                                        <v-col class="bb"></v-col>
                                        <v-col class="bb"></v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col class="bb"></v-col>
                                        <v-col class="bb"></v-col>
                                        <v-col class="bb"></v-col>
                                    </v-row>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-container>
        </v-col>
    </v-row>
</template>

<script>
import { httpServer } from "@/main";

export default{
    data(){
        return{
            planTest: ""
        }
    },
    mounted(){
        httpServer.get('/Development/DevPlanTest/' + this.$route.params.modelId + "/" + this.$route.params.rowId)
            .then(response => (
                this.planTest = response.data
            ))
    }
}
</script>

<style scoped>
table th+th {
    border-left: 1px solid #dddddd;
}

table tr+tr {
    border-bottom: 1px solid #dddddd;
}

table td+td {
    border-left: 1px solid #dddddd;
}

.bb {
    border-bottom: 1px solid #dddddd;
}

.print-block {
    position: absolute;
    width: 100%;
    z-index: 1;
    background: white;
    margin: 0 0 0 0
}
</style>