<template>
    <div>
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
                                :items="dataPack.production"
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
                                :items="dataPack.line"
                                label="Введите линию"
                                v-model="workItem.line"
                                dense
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols="6">
                            <v-autocomplete
                                outlined
                                :items="dataPack.equipment"
                                label="Введите название оборудования"
                                v-model="workItem.equipment"
                                dense
                            ></v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <CalendarLine v-model="workItem.date"></CalendarLine>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field outlined label='Продолжительность "в часах"' v-model="workItem.time" dense></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field outlined label='Введите название узла' v-model="workItem.place" dense></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-textarea
                        outlined
                        name="input-7-4"
                        label="Коренная причина"
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
                    ></v-data-table>
                </template>
            </v-container>
        </v-container>
    </div>
</template>  

<script>
import CalendarLine from '@/components/CalendarLine.vue';
import CalendarLinePeriod from '@/components/CalendarLinePeriod.vue';
import axios from 'axios';
import {httpServer} from "@/main";


    export default {
    data() {
        return {
            headers: [
                { text: 'Производство', value: 'production', align: 'center'},
                { text: 'Линия',align: 'center', value: 'line' },
                { text: 'Зона',align: 'center', value: 'equipment' },
                { text: 'Смена',align: 'center', value: 'productionShift' },
                { text: 'Дата',align: 'center', value: 'date' },
                { text: 'Время заполнения',align: 'center', value: 'timeSave' },
                { text: 'Продолжительность',align: 'center', value: 'time' },
                { text: 'Узел',align: 'center', value: 'place' },
                { text: 'Коренная причина',align: 'center', value: 'rootCause' },
                { text: 'Комментарий',align: 'center', value: 'comment' }
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
                production: "",
                line: "",
                equipment: "",
                time: "",
                place: "",
                rootCause: "",
                comment: "",
                date: null,
                timeSave: ""
            },
            period:['2022-09-10', '2022-09-20']
        };
    },
    mounted(){
        httpServer.get('Maitanence/workList')
        .then(response => (
            this.workList = response.data
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
            let that = this
            httpServer.post("Maitanence/workList", this.workItem)
            .then(function (response) {
                that.workList = response.data;
            })
            this.workItem = {
                productionShift: "",
                production: "",
                line: "",
                equipment: "",
                time: "",
                place: "",
                rootCause: "",
                comment: "",
                date: null,
                timeSave: ""
            };
            this.date = null
            this.showNewTab = false;
        },
        cancelTask() {
            this.workItem = {
                productionShift: "",
                production: "",
                line: "",
                equipment: "",
                time: "",
                place: "",
                rootCause: "",
                comment: ""
            };
            this.showNewTab = false;
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