
<template>
    <v-container>
        <v-row>
            <v-spacer></v-spacer>
            <v-col cols="8"><h1>Перечень протоколов улучшения</h1></v-col>
            <v-spacer></v-spacer>
        </v-row>
        <v-container class="elevation-1">
            <v-tabs align-with-title>
                <v-tab v-for="(item, ind) in qrciList" :key="ind" @click="chooseDepartment = ind">{{item.department}}</v-tab>
            </v-tabs>
        </v-container>
        <v-container>
            <v-data-table
                        :headers="headers"
                        :items="qrciList[chooseDepartment].qrciList"
                        :items-per-page="20"
                        class="elevation-1"
            >
                    <template v-slot:item.status.title="{ item }">
                            {{item.status.title}}
                                <v-dialog v-model="dialog" width="800">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-span v-show="item.status.index===1">
                                            <v-icon
                                                small
                                                class="mr-2"
                                                color="red"
                                                v-on="on"
                                                @click = "rowQrci = item.qrciRows"
                                            >
                                            mdi-alert-outline
                                            </v-icon> 
                                    </v-span>
                                </template>
                                <v-simple-table>
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-left">
                                                    Действия
                                                </th>
                                                <th class="text-left">
                                                    Ответственный
                                                </th>
                                                <th class="text-left">
                                                    Дата
                                                </th>
                                                <th class="text-left">
                                                    Статус
                                                </th>
                                                <th class="text-left">
                                                    Комментарий
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                            v-for="(elem, ind) in rowQrci"
                                            :key="elem.id"
                                            >
                                                <td>{{ elem.action }}</td>
                                                <td>{{ elem.responsible }}</td>
                                                <td>{{ elem.date }}</td>
                                                <td>{{ elem.status.title }} 
                                                    <v-span v-show="elem.status.index===1">
                                                            <v-icon
                                                                small
                                                                class="mr-2"
                                                                color="red"
                                                            >
                                                            mdi-alert-outline
                                                            </v-icon> 
                                                    </v-span>
                                                </td>
                                                <td>{{ elem.comment }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                                </v-dialog> 
                        </template>   
                    <template v-slot:item.actions="{ item }">
                            
                            <v-icon
                                small
                                class="mr-2"
                                @click="editItem(item)"
                            >
                                mdi-pencil
                            </v-icon>
                    </template>
            </v-data-table>
        </v-container>
    </v-container>
</template>

<script>
    import {httpServer} from "@/main";

    export default{
        data(){
            return{
                qrciList: [],
                rowQrci: null,
                chooseDepartment: 0,
                headers: [
                { text: 'Номер',align: 'center', value: 'number' },
                { text: 'Класс. проблемы', align: 'center', value: 'problemClassification.name'},
                { text: 'Формулировка проблемы',align: 'center', value: 'problem.problemData.problemText' },
                { text: 'Спонсор',align: 'center', value: 'sponsor' },
                { text: 'Лидер',align: 'center', value: 'lider' },
                { text: 'Дата открытия',align: 'center', value: 'dateOpen' },
                { text: 'Статус',align: 'center', value: 'status.title' },
                { text: 'Действие', align: 'center', value: 'actions'}
                ]
            }
        },
        mounted(){
            httpServer.get(`Quality/qrciList`)
            .then(response => (
                this.qrciList = response.data
            ))
            
        },
        methods:{
            editItem(item){
                let pathTo = "/Quality/Department/"+this.chooseDepartment+"/QRCI/"+item.number
                this.$router.push({path: pathTo, params: { depart: "depart", id: "id"}});
            }
        }            
    }
</script>