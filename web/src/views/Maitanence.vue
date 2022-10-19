<template>
    <div>
        <v-alert :value="alert" color="red" dark border="top" icon="mdi-alert" transition="scale-transition"
            style="position: absolute; z-index: 1; margin: 50% 0 0 30%">
            Не все поля заполнены. 
            Обязательны к заполнению следующие поля: <br>
             - номер смены <br>
            - производство <br>
            - линия <br>
            - название оборудования <br>
            - дата <br>
            - Продолжительность работ <br>
            - название узла <br>
            - корневая причина <br>
            <v-row>
                <v-col>
                    <v-btn @click="alert=false">OK</v-btn>
                </v-col>
            </v-row>

        </v-alert>
        <v-container>
            <div><h1>Информация о проведенных аварийных работах</h1></div>
            <v-divider></v-divider>
            <v-container>
                <v-btn @click="showNewTab = !showNewTab" v-if="!showNewTab">+ ДОБАВИТЬ</v-btn>
                <v-container v-if="showNewTab">
                    <v-row>
                        <v-col cols="6">
                            <v-autocomplete
                                outlined
                                :items="dataPack.productionShift"
                                label="Введите номер смены"
                                v-model="workItem.productionShift"
                                dense
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols="6">
                            <v-autocomplete
                                outlined
                                :items="equipmentList"
                                item-text="department"
                                item-value="id"
                                label="Введите производство"
                                v-model="workItem.production"
                                dense
                            ></v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-autocomplete
                                outlined
                                :items="equipmentList[workItem.production].lines"
                                item-text="line"
                                item-value="id"
                                label="Введите линию"
                                v-model="workItem.line"
                                dense
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols="6">
                            <v-autocomplete
                                outlined
                                :items="equipmentList[workItem.production].lines[workItem.line].prodAreas"
                                item-text="prodArea"
                                item-value="id"
                                label="Укажите название участка"
                                v-model="workItem.prodArea"
                                dense
                            ></v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-autocomplete outlined :items="equipmentList[workItem.production].lines[workItem.line].prodAreas[workItem.prodArea].equipments" item-text="equipment"
                                item-value="id"  label="Введите название оборудования"  v-model="workItem.equipment" dense>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="6">
                            <v-autocomplete outlined :items="equipmentList[workItem.production].lines[workItem.line].prodAreas[workItem.prodArea].equipments[workItem.equipment].prodUnits" item-text="prodUnit"
                                label="Укажите название узла" v-model="workItem.prodUnit"
                                 dense></v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <CalendarLine v-model="workItem.date"></CalendarLine>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field outlined label='Продолжительность в часах' v-model="workItem.time" dense></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field outlined label='ФИО ответственного' v-model="workItem.worker" dense></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-textarea
                        outlined
                        name="input-7-4"
                        label="Корневая причина"
                        value=""
                        v-model="workItem.rootCause"
                        ></v-textarea>
                    </v-row>
                    <v-row>
                        <v-textarea
                        outlined
                        name="input-7-4"
                        label="Комментарий"
                        value=""
                        v-model="workItem.comment"
                        ></v-textarea>
                    </v-row>
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-btn @click="pushNewTask()">СОХРАНИТЬ</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn @click="cancelTask()">ОТМЕНИТЬ</v-btn>
                        <v-spacer></v-spacer>
                    </v-row>
                </v-container>
            </v-container> 
            <v-container>


            <v-container style="padding: 10px; margin: 0 0 10px 0;">
                <v-row>
                    <v-col cols="5">
                        <v-card class="elevation-1">
                            <v-row>
                                <v-col cols="1"></v-col>
                                <v-col cols="10">
                                    <CalendarLinePeriod v-model="period"></CalendarLinePeriod>
                                </v-col>
                                <v-col cols="1"></v-col>
                            </v-row>                            
                            
                            <v-row>
                                <v-col cols="1"></v-col>
                                <v-col cols="5">
                                    <v-btn @click="sendPeriod()">Фильтр по датам</v-btn>
                                </v-col>
                                <v-col cols="5">
                                    <v-btn @click="sendPeriodReport()">Выгрузить</v-btn>
                                </v-col>
                                <v-col cols="1"></v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
                
            </v-container>    
            

                <template>
                    <v-data-table
                        :headers="headers"
                        :items="worksList"
                        :items-per-page="20"
                        class="elevation-1"
                    >
                        <template v-slot:item.action="{ item }">
                        
                            <v-icon small class="mr-2" @click="editItem(item)">
                                mdi-pencil
                            </v-icon>
                        </template>
                    </v-data-table>
                </template>
            </v-container>
        </v-container>
    </div>
</template>  

<script>
import CalendarLine from '@/components/CalendarLine.vue';
import CalendarLinePeriod from '@/components/CalendarLinePeriod.vue';
import {httpServer} from "@/main";


    export default {
    data() {
        return {
            equipments: [],
            alert: false,
            headers: [
                { text: 'Производство', value: 'production', align: 'center'},
                { text: 'Линия',align: 'center', value: 'line' },
                { text: 'Участок',align: 'center', value: 'prodArea' },
                { text: 'Оборудование', align: 'center', value: 'equipment' },
                { text: 'Узел', align: 'center', value: 'prodUnit' },
                { text: 'Смена',align: 'center', value: 'productionShift' },
                { text: 'Дата',align: 'center', value: 'date' },
                { text: 'Время заполнения',align: 'center', value: 'timeSave' },
                { text: 'Продолжительность',align: 'center', value: 'time' },
                { text: 'Коренная причина',align: 'center', value: 'rootCause' },
                { text: 'Комментарий',align: 'center', value: 'comment' },
                { text: '', align: 'center', value: 'action' }
            ],
            showCalendar: false,
            showNewTab: false,
            dataPack: {
                productionShift: [1, 2, 3, 4],
                production: ["Триплекс", "Закаленное стекло", "AVO"],
                line: ["BR-91", "BR-92", "AFS", "BR-C1", "BR-C2", "BR-C3", "BR-C8", "BR-C9", "BR-C10", "BRV1", "BRV2", "AVO light", "Экструзия", "BR-L1", "BR-L2", "BR-L3", "Печь молирования  Tamglass", "BR-L4", "BR-L6"],
                equipment: ["Печатная машина", "Печь", "Накопитель", "Моечная машина плоского стекла", "Моечная машина гнутого стекла", "Линия пакетирования", "Пайка", "Линия подпрессовки Nipper Roll", "Линия приклейки опций", "Конвейера стеклобоя", "Машина раскройки пленки Stretch", "Линия контроля и упаковки", "Участок токообогрева", "Шламовая станция", "Линия разгрузки WOW", "Термопластавтомат", "Робот", "Gerold 2011", "Автоклав 1", "Автоклав 2", "Печь подпрессовки", "Печать + Кугер", "Пресса", "Закалка", "Турбины", "Участок разгрузки", "Участок загрузки", "VSM", "KSM1", "KSM2", "KSM3", "PSM1", "PSM2", "PSM3", "PBM1", "PBM2", "PBM3", "Охлаждение", "Транспортеры", "Печь сушки IR", "Печь сушки UV", "Шкафы управления", "Система микроклимата"]
            },
            workList: [],
            workItem: {
                productionShift: "",
                production: 0,
                line: 0,
                prodArea: 0,
                equipment: 0,
                prodUnit: 0,
                time: "",
                rootCause: "",
                comment: "",
                date: null,
                timeSave: "",
                worker: "",
                ind: [],
                status:"new"
            },
            period:['2022-09-10', '2022-09-20']
        };
    },
    mounted(){
        httpServer.get('Maitanence/workList')
        .then(response => (
            this.workList = response.data
        ))
        httpServer.get('Maitanence/equipment')
            .then(response => (
                this.equipments = response.data
            ))
    },
    methods: {
        sendPeriod(){
            let that = this
            httpServer.post("Maitanence/workListPeriod", this.period)
            .then(function (response) {
                that.workList = response.data;
            })
        },
        sendPeriodReport(){
            let that = this
            httpServer.post("Maitanence/workListPeriodReport", this.period)
            .then(function (response) {
                that.workList = response.data;
            })
        },
        pushNewTask() {
            this.workItem.timeSave = new Date();

            this.workItem.timeSave = this.workItem.timeSave.toLocaleString()
            let that = this

            if ((this.workItem.productionShift === "") || (this.workItem.worker === "") || (this.workItem.production === "") || (this.workItem.line === "") || (this.workItem.equipment === "") || (this.workItem.time === "") || (this.workItem.prodUnit === "") || (this.workItem.rootCause === "") || (this.workItem.date === null)){
                this.alert = true
            } else {
                this.workItem.ind.push(this.workItem.production)
                this.workItem.ind.push(this.workItem.line)
                this.workItem.ind.push(this.workItem.prodArea)
                this.workItem.ind.push(this.workItem.equipment)
                this.workItem.prodUnit = this.workItem.prodUnit
                this.workItem.equipment = this.equipmentList[this.workItem.production].lines[this.workItem.line].prodAreas[this.workItem.prodArea].equipments[this.workItem.equipment].equipment
                this.workItem.prodArea = this.equipmentList[this.workItem.production].lines[this.workItem.line].prodAreas[this.workItem.prodArea].prodArea
                this.workItem.line = this.equipmentList[this.workItem.production].lines[this.workItem.line].line
                this.workItem.production = this.equipmentList[this.workItem.production].department


                httpServer.post("Maitanence/workList", this.workItem)
                .then(function (response) {
                    that.workList = response.data;
                })
                this.workItem = {
                    productionShift: "",
                    production: 0,
                    line: 0,
                    prodArea: 0,
                    equipment: 0,
                    prodUnit: 0,
                    time: "",
                    rootCause: "",
                    comment: "",
                    date: null,
                    timeSave: "",
                    worker: "", 
                    ind: [],
                    status: "new"
                };
                this.date = null
                this.showNewTab = false;
            }
        },
        cancelTask() {
            this.workItem = {
                productionShift: "",
                production: 0,
                line: 0,
                prodArea: 0,
                equipment: 0,
                prodUnit: 0,
                time: "",
                rootCause: "",
                comment: "",
                date: null,
                timeSave: "",
                worker: "",
                ind: [],
                status: "new"
            };
            this.showNewTab = false;
        },
        editItem(item){
            this.workItem = item
            this.workItem.equipment = item.ind[3]
            this.workItem.prodArea = item.ind[2]
            this.workItem.line = item.ind[1]
            this.workItem.production = item.ind[0]
            this.workItem.status = "edit"
            this.showNewTab = true
        }
    },
    computed:{
        worksList(){
            let arr = []
            console.log(this.workList)
            for (let i=0; i<this.workList.length; i++){
                this.workList[i].work.forEach(item =>{
                    item.date = this.workList[i].date
                    arr.push(item)
                })
            }
            return arr    
        },
        equipmentList(){
            return this.equipments
        }
    },
    components: { CalendarLine, CalendarLinePeriod}
}
</script>

<style>
    .calendarPlace{
        position: absolute;
        z-index: 2;
        margin: -29px 0 0 -70px
    }
</style>