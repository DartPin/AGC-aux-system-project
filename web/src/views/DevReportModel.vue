<template>
    <div>
        <v-container class="elevation-1">
            <v-row>
                <v-col cols="1">
                    <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y
                        min-width="auto">
                        <template v-slot:activator="{ on}">
                            <v-icon v-on="on">mdi-cog-outline</v-icon>
                        </template>
                        <v-container><v-btn @click='edit = !edit'>редактировать</v-btn></v-container>
                        <v-container><v-btn  @click='saveDevModel()'>сохранить</v-btn></v-container>
                    </v-menu>
                </v-col>
                <v-col cols="10">
                    <h1>Протокол развития модели {{devModel.name}}</h1>
                </v-col>
            </v-row>
            <v-container class="elevation-1">
                <v-row>
                    <v-col cols="1"></v-col>
                    <v-col cols="10"><h2>Общая информация о модели</h2></v-col>
                    <v-col cols="1"><ArrowChange v-model="showBlock[0]"></ArrowChange></v-col>
                </v-row>
                <v-container v-show="showBlock[0]">
                    <v-row>
                        <v-col cols="2">Название модели</v-col>
                        <v-col cols="4"><v-text-field  label="имя модели" outlined dense v-model="devModel.model" :disabled="edit"></v-text-field></v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="2">размер</v-col>
                        <v-col cols="2">
                            <v-text-field label="высота" outlined dense v-model="devModel.size.height" :disabled="edit"></v-text-field>
                        </v-col>
                        <v-col cols="2">
                            <v-text-field label="ширина" outlined dense v-model="devModel.size.width" :disabled="edit"></v-text-field>
                        </v-col>
                        <v-col cols="2">DOB</v-col>
                        <v-col cols="4">
                            <v-text-field label="DOB" outlined dense v-model="devModel.dob" :disabled="edit"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="2">Поперечный провис</v-col>
                        <v-col cols="4">
                            <v-text-field label="Поперечный провис" outlined dense v-model="devModel.sag" :disabled="edit"></v-text-field>
                        </v-col>
                        <v-col cols="2">Прилегание</v-col>
                        <v-col cols="4">
                            <v-text-field label="прилегание" outlined dense v-model="devModel.fit" :disabled="edit"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="2">Толщина</v-col>
                        <v-col cols="2">
                            <v-text-field label="outer" outlined dense v-model="devModel.thinkness.outer" :disabled="edit"></v-text-field>
                        </v-col>
                        <v-col cols="2">
                            <v-text-field label="inner" outlined dense v-model="devModel.thinkness.inner" :disabled="edit"></v-text-field>
                        </v-col>
                        <v-col cols="2">Цвет стекол</v-col>
                        <v-col cols="2">
                            <v-text-field label="outer" outlined dense v-model="devModel.color.outer" :disabled="edit"></v-text-field>
                        </v-col>
                        <v-col cols="2">
                            <v-text-field label="inner" outlined dense v-model="devModel.color.inner" :disabled="edit"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="2">Керамическая краска</v-col>
                        <v-col cols="4">
                            <v-text-field label="Марка керамической краски" outlined dense v-model="devModel.enamel" :disabled="edit"></v-text-field>
                        </v-col>
                        <v-col cols="2">Серебрянная паста</v-col>
                        <v-col cols="3">
                            <v-text-field label="Марка серебрянной пасты" outlined dense v-model="devModel.silver.title" :disabled="edit"></v-text-field>
                        </v-col>
                        <v-col cols="1">
                            <v-text-field label="%" outlined dense v-model="devModel.silver.percent" :disabled="edit"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="2">Электрообогрев</v-col>
                        <v-col cols="4">
                            <v-text-field label="Электрообогрев" outlined dense v-model="devModel.heating" :disabled="edit"></v-text-field>
                        </v-col>
                        <v-col cols="2">Используемая нить</v-col>
                        <v-col cols="4">
                            <v-text-field label="мспользуемая нить" outlined dense v-model="devModel.heatingThread" :disabled="edit"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="2">Интермак</v-col>
                        <v-col cols="4">
                            <v-text-field label="интермак" outlined dense v-model="devModel.intermak" :disabled="edit"></v-text-field>
                        </v-col>
                        <v-col cols="2">ПВБ</v-col>
                        <v-col cols="4">
                            <v-text-field label="ПВБ" outlined dense v-model="devModel.pvb" :disabled="edit"></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-container>
        
            <v-container class="elevation-1">
                <v-row>
                    <v-col cols="1"></v-col>
                    <v-col cols="10"><h2>Статус развития и бюджетные показатели</h2></v-col>
                    <v-col cols="1"><ArrowChange v-model="showBlock[1]"></ArrowChange></v-col>
                </v-row> 
                <v-container v-show="showBlock[1]">
                    <v-row><v-col><h3>Статус развития</h3></v-col></v-row>
                    <v-row>
                        <v-col>
                            <v-data-table :headers="headDev" :items="devModel.devStatus" :items-per-page="20" class="elevation-1">
                                <template v-slot:item.cutting="{ item }">
                                    <v-text-field outlined dense v-model="item.cutting" :disabled="edit"></v-text-field>
                                </template>
                                <template v-slot:item.printing="{ item }">
                                    <v-text-field outlined dense v-model="item.printing" :disabled="edit"></v-text-field>
                                </template>
                                <template v-slot:item.furnance="{ item }">
                                    <v-text-field outlined dense v-model="item.furnance" :disabled="edit"></v-text-field>
                                </template>
                                <template v-slot:item.assembling="{ item }">
                                    <v-text-field outlined dense v-model="item.assembling" :disabled="edit"></v-text-field>
                                </template>
                                <template v-slot:item.project="{ item }">
                                    <v-text-field outlined dense v-model="item.project" :disabled="edit"></v-text-field>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <h3>Финансовые показатели</h3>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-data-table :headers="headKPI" :items="devModel.kpiItems"  class="elevation-1">
                                <template v-slot:item.cutting="{ item }">
                                    <v-text-field outlined dense v-model="item.cutting" :disabled="edit"></v-text-field>
                                </template>
                                <template v-slot:item.printing="{ item }">
                                    <v-text-field outlined dense v-model="item.printing" :disabled="edit"></v-text-field>
                                </template>
                                <template v-slot:item.furnance="{ item }">
                                    <v-text-field outlined dense v-model="item.furnance" :disabled="edit"></v-text-field>
                                </template>
                                <template v-slot:item.assembling="{ item }">
                                    <v-text-field outlined dense v-model="item.assembling" :disabled="edit"></v-text-field>
                                </template>
                                <template v-slot:item.final="{ item }">
                                    <v-text-field outlined dense v-model="item.final" :disabled="edit"></v-text-field>
                                </template>
                                <template v-slot:item.gtg="{ item }">
                                    <v-text-field outlined dense v-model="item.gtg" :disabled="edit"></v-text-field>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-container>
            </v-container>

            <v-container class="elevation-1">
                <v-row>
                    <v-col cols="1"></v-col>
                    <v-col cols="10"><h2>Информация о тестах</h2></v-col>
                    <v-col cols="1"><ArrowChange v-model="showBlock[2]"></ArrowChange></v-col>
                </v-row>
                <v-container v-show="showBlock[2]">
                    <v-row>
                        <v-col>
                            <v-btn @click="showTestBlock = true" v-show="!showTestBlock">Добавить новый тест</v-btn>
                        </v-col>
                    </v-row>
                    <v-container v-show="showTestBlock">
                        <v-row>
                            <v-col cols="2">Участок</v-col>
                            <v-col cols="2">
                                <v-text-field label="участок" outlined dense v-model="testItems.productionPlace" :disabled="edit"></v-text-field>
                            </v-col>
                            <v-col cols="2">Дата теста</v-col>
                            <v-col cols="2">
                                <v-text-field label="дата теста" outlined dense v-model="testItems.dateTest" :disabled="edit"></v-text-field>
                            </v-col>
                            <v-col cols="2">Yield/KU/CAD</v-col>
                            <v-col cols="2">
                                <v-text-field label="Yield/KU/CAD" outlined dense v-model="testItems.kpi" :disabled="edit"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2">Проблема</v-col>
                            <v-col cols="10">
                                <v-text-field label="проблема" outlined dense v-model="testItems.problem" :disabled="edit"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2">Потенциальная причина</v-col>
                            <v-col cols="10">
                                <v-text-field label="потенциальная причина" outlined dense v-model="testItems.potentialCause" :disabled="edit">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2">План на тест</v-col>
                            <v-col cols="10">
                                <v-text-field label="план на тест" outlined dense v-model="testItems.plan" :disabled="edit"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2">Результат теста</v-col>
                            <v-col cols="10">
                                <v-text-field label="результат теста" outlined dense v-model="testItems.result" :disabled="edit"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2">Действия до сл. наработки</v-col>
                            <v-col cols="10">
                                <v-text-field label="действия до следующей наработки" outlined dense v-model="testItems.action" :disabled="edit">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-spacer></v-spacer>
                            <v-col cols="2">
                                <v-btn @click="pushRow()">СОХРАНИТЬ</v-btn>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="2">
                                <v-btn>ОТМЕНИТЬ</v-btn>
                            </v-col>
                            <v-spacer></v-spacer>
                        </v-row>
                    </v-container>
                    <v-row>
                        <v-col>
                            <v-data-table :headers="headTest" :items="devModel.rowTests" :items-per-page="20" class="elevation-1">
                            
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-container>
            </v-container>
        </v-container>
    </div>
</template>

<script>
import ArrowChange from '@/components/ArrowChange.vue';
import { httpServer } from "@/main";

    export default {
    data() {
        return {
            edit:false,
            showTestBlock: false,
            headDev: [
                { text: "", align: 'center', value: "titleRow" },
                { text: "Резка", align: 'center', value: "cutting" },
                { text: "Печать", align: 'center', value: "printing" },
                { text: "Печь", align: 'center', value: "furnance" },
                { text: "Сборка", align: 'center', value: "assembling" },
                { text: "Проект", align: 'center', value: "project" },
            ],
            headKPI: [
                { text: "", align: 'center', value: "nameKPI" },
                { text: "Резка", align: 'center', value: "cutting" },
                { text: "Печать", align: 'center', value: "printing" },
                { text: "Печь", align: 'center', value: "furnance" },
                { text: "Сборка", align: 'center', value: "assembling" },
                { text: "Финал", align: 'center', value: "final" },
                { text: "GTG", align: 'center', value: "gtg" },
            ],
            headTest: [
                { text: "участок", align: 'center', value: "productionPlace" },
                { text: "дата теста", align: 'center', value: "dateTest" },
                { text: "проблема", align: 'center', value: "problem" },
                { text: "потенциальная причина", align: 'center', value: "potentialCause" },
                { text: "план на тест", align: 'center', value: "plan" },
                { text: "результат теста", align: 'center', value: "result" },
                { text: "действия до следующей наработки", align: 'center', value: "action" },
                { text: "Yield/KU/Cad", align: 'center', value: "kpi" },
                { text: "", align: 'center', value: 'actions' }
            ],
            testItems: {
                productionPlace: "",
                dateTest: "",
                problem: "",
                potentialCause: "",
                plan: "",
                result: "",
                action: "",
                kpi: ""
            },
            showBlock: [false, false, false],
            devModel:{
                model: "",
                size:{
                    height: "",
                    width: "",
                },
                dob: '',
                sag: "",
                fit: "",
                thinkness: {
                    outer: "",
                    inner: ""
                },
                color: {
                    outer: "",
                    inner: ""
                },
                enamel: "",
                silver: {
                    title: "",
                    percent: ""
                },
                heating: "",
                heatingThread: "",
                intermak: "",
                pvb: "",
                rowTests:[
                ],
                devStatus:[
                    {
                        titleRow: "№ линии/участка",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        project: ""
                    },
                    {
                        titleRow: "Дата первого теста",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        project: ""
                    },
                    {
                        titleRow: "Всего тестов",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        project: ""
                    },
                    {
                        titleRow: "Пропущено стекла",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        project: ""
                    },
                    {
                        titleRow: "Инструкция",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        project: ""
                    },
                    {
                        titleRow: "Оснастка",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        project: ""
                    },
                    {
                        titleRow: "Материал",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        project: ""
                    },
                    {
                        titleRow: "SPC",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        project: ""
                    },
                ],
                kpiItems: [
                    {
                        nameKPI: "Бюджет Yield",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        final: "",
                        gtg: ""
                    },
                    {
                        nameKPI: "Факт Yield",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        final: "",
                        gtg: ""
                    },
                    {
                        nameKPI: "Бюджет KU",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        final: "",
                        gtg: ""
                    },
                    {
                        nameKPI: "Факт KU",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        final: "",
                        gtg: ""
                    },
                    {
                        nameKPI: "Бюджет CAD",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        final: "",
                        gtg: ""
                    },
                    {
                        nameKPI: "Факт CAD",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        final: "",
                        gtg: ""
                    },
                ]
            }
        };
    },
    methods:{
        pushRow(){
            this.devModel.rowTests.push(this.testItems)
            this.showTestBlock = false
        },
        saveDevModel(){
            httpServer.post("Development/DevReportModel", this.devModel)
        }
    },
    components: { ArrowChange }
}
</script>