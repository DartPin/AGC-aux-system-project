
<template>
    <div>
        <v-container>
            <div><h1>Планирование AVO</h1></div>

            <v-divider></v-divider>

            <v-container v-if="!showBlock">
                <v-btn @click="showBlock = true">+ДОБАВИТЬ</v-btn>
            </v-container> 

            <v-container v-if="showBlock">
                <v-row>
                    <v-col cols="3">
                        <CalendarLine v-model="formItem.date"></CalendarLine>
                    </v-col>
                    <v-col cols="3">
                        <v-autocomplete
                                outlined
                                :items="productionArea"
                                item-text="name"
                                item-value="id" 
                                label="Участок"
                                v-model="flowIndex"
                            ></v-autocomplete>
                    </v-col>
                    <v-col cols="3">
                        <v-autocomplete
                                outlined
                                :items="flows"
                                label="Поток"
                                v-model="formItem.productionFlow"
                            ></v-autocomplete>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="3">
                        <v-autocomplete
                                outlined
                                label="Модель"
                                :items="data"
                                item-text="model"
                                item-value="id"
                                v-model="dataIndex"
                            ></v-autocomplete>
                    </v-col>
                    <v-col cols="3">
                        <v-autocomplete
                                outlined
                                label="Артикль"
                                :items="articles"
                                item-text="art"
                                item-value="art"
                                v-model="formItem.article"
                            ></v-autocomplete>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="3">
                        <v-text-field outlined label='Количество статуса "К"' v-model="formItem.quantityK"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field outlined label='Количество статуса "G"' v-model="formItem.quantityG"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field outlined label='Время наработки' v-model="formItem.productionTime"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field outlined label='Последующие действия' v-model="formItem.nextStep"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                        <v-spacer></v-spacer>
                        <v-btn @click="pushNewTask()">СОХРАНИТЬ</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn @click="cancelTask()">ОТМЕНИТЬ</v-btn>
                        <v-spacer></v-spacer>
                </v-row>
            </v-container>
            <v-container>
                <v-row>
                    <v-col><h2>Запланированные работы </h2></v-col>
                </v-row>
                <v-row style="margin: 0 0 30px 0">
                    <v-spacer></v-spacer> 
                    <v-col> <v-btn @click="changeDate(-1)"><v-icon>mdi-chevron-left</v-icon></v-btn>  </v-col>
                    <v-spacer></v-spacer>
                    <v-col> <h2>{{chooseDate.toLocaleDateString("ru")}}г.</h2> </v-col>
                    <v-spacer></v-spacer> 
                    <v-col> <v-btn @click="changeDate(1)"><v-icon>mdi-chevron-right</v-icon></v-btn>  </v-col>
                    <v-spacer></v-spacer> 
                </v-row>
                    
                <v-app-bar
                elevation="4"
                height="50px"
                >
                    <template >
                        <v-tabs align-with-title>
                            <v-tab v-for="(element, index) in productionArea" :key="index" @click="choosenIndex=index"> {{element.name}}</v-tab>
                        </v-tabs>
                    </template>
                    <template v-slot:extension>
                        <v-tabs align-with-title>
                            <v-tab v-for="(flow, ind) in productionArea[choosenIndex].flows" :key="ind" @click="flowNumber = ind"> {{ind+1}}й поток </v-tab>
                        </v-tabs>
                    </template>
                </v-app-bar>

                <v-simple-table>
                    <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-center">
                                Модель
                            </th>
                            <th class="text-center">
                                Артикль
                            </th>
                            <th class="text-center">
                                "К"
                            </th>
                            <th class="text-center">
                                "G"
                            </th>
                            <th class="text-center">
                                Планируемое время
                            </th>
                            <th class="text-center">
                                Следующие шаги
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in tableData" :key="item.article"
                        >
                        <td v-if="item.model === '---'"> --- </td>
                        <td v-if="item.model != '---'">{{data[item.model-1].model}}</td>
                        <td>{{item.article}}</td>
                        <td>{{item.quantityK}}</td>
                        <td>{{item.quantityG}}</td>
                        <td>{{item.productionTime}}</td>
                        <td>{{item.nextStep}}</td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
            </v-container>
            
        </v-container>
    </div>
</template>

<script>
import CalendarLine from "@/components/CalendarLine.vue";
import axios from "axios"
import {httpServer} from "@/main";

export default {
    components: {
        CalendarLine
    },
    data(){
        return{
            flowNumber: 0,
            chooseDate: new Date(),
            flowIndex: 1,
            dataIndex: 1,
            data: null,
            choosenIndex: 0,
            showBlock: false,
            productionArea: [{id: 1, name:"Опции", flows:[1, 2, 3, 4]},{id: 2, name:"Линза", flows: [1, 2, 3]}, {id: 3, name:"Экструзия", flows: [1, 2]}, {id: 4, name:"Пайка", flows: [1, 2, 3, 4, 5, 6]}, {id: 5, name:"Manual", flows: [1, 2, 3]}, {id: 6, name:"Кировец", flows: [1, 2, 3]}, {id: 7, name:"Kostal", flows: [1, 2, 3]}],
            productionPlan:[
                {
                    productionArea: "Опции",
                    flows: [
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                    ]
                },
                {
                    productionArea: "Линза",
                    flows: [
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                    ]
                },
                {
                    productionArea: "Экструзия",
                    flows: [
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        }
                    ]
                },
                {
                    productionArea: "Пайка",
                    flows: [
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                    ]
                },
                {
                    productionArea: "Manual",
                    flows: [
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                    ]
                },
                {
                    productionArea: "Кировец",
                    flows: [
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                    ]
                },
                {
                    productionArea: "Kostal",
                    flows: [
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                        {
                            model: "",
                            productionTime: ""
                        },
                    ]
                }
            ],
            formItem: {
                date: null,
                productionArea: "",
                productionFlow: "",
                modelId: "",
                article: "",
                quantityK: "",
                quantityG: "",
                productionTime: "",
                nextStep: ""
            }
        }
    },
    mounted(){
        httpServer.get('Models')
            .then(response =>
                // обработка успешного запроса
                (this.data = response.data)
            )
            .catch(function (error) {
                // обработка ошибки
                console.log(error);
            })
            .then(function () {
                // выполняется всегда
            })

      httpServer.get('AVOPlaning')
            .then(response =>
                // обработка успешного запроса
                (this.productionPlan = response.data)
            )
            .catch(function (error) {
                // обработка ошибки
                console.log(error);
            })
            .then(function () {
                // выполняется всегда
            })
        
    },
    computed:{
        articles(){
            let arr = null
            this.data.forEach(elem => {
                if (Number(elem.id) === Number(this.dataIndex)){
                    arr = elem.articles
                }
            })
            return arr
        },
        flows(){
            return this.productionArea[this.flowIndex-1].flows
        },
        tableData(){
            let tableData = this.productionPlan[this.choosenIndex].flows[this.flowNumber]
            return tableData
        }
    },
    methods:{
        pushNewTask(){
            this.formItem.date = String(this.formItem.date)
            this.formItem.productionArea = this.productionArea[this.flowIndex-1].id-1
            this.formItem.modelId = this.data[this.dataIndex-1].id
            this.formItem.productionFlow = this.formItem.productionFlow - 1
            
            let that = this
            httpServer.post("AVOPlaning", this.formItem)
            .then(function (response) {
                that.productionPlan = response.data;
            })
            
            this.formItem = {
                date: null,
                productionArea: "",
                productionFlow: "",
                modelId: "",
                article: "",
                quantityK: "",
                quantityG: "",
                productionTime: "",
                nextStep: ""
            }
            this.showBlock = false
            
            console.log(this.productionPlan)
        },
        cancelTask(){
            this.formItem = {
                date: null,
                productionArea: "",
                productionFlow: "",
                modelId: "",
                article: "",
                quantityK: "",
                quantityG: "",
                productionTime: "",
                nextStep: ""
            }
            this.showBlock = false
        },
        changeDate(val){
            this.chooseDate = this.chooseDate.setDate(this.chooseDate.getDate() + val)
            this.chooseDate = new Date(this.chooseDate)
            let obj = {}
            obj.date = this.chooseDate
            let that = this
            httpServer.post("AVOPlaningDate", obj)
            .then(function (response) {
                that.productionPlan = response.data;
            })
        }
    },
    watch:{
        flowNumber(){
            return this.flowNumber
        },
        showBlock(){
            return this.showBlock
        },
        tableData(){
            return this.tableData
        }
       
    }
}
    
</script>