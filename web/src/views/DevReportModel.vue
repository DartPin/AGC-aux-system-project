<template>
    <div>
        <v-container class="elevation-1">
            <v-row>
                <v-col cols="1">
                 
                </v-col>
                <v-col cols="10">
                    <h1>Протокол развития модели {{devModel.model}}</h1>
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
                    <v-col cols="10"><h2>Статус развития</h2></v-col>
                    <v-col cols="1"><ArrowChange v-model="showBlock[1]"></ArrowChange></v-col>
                </v-row> 
                <v-container v-show="showBlock[1]">
                    <v-row>
                        <v-col>
                        <v-simple-table class="elevation-1" dense>                            
                            <template v-slot:default>
                            <thead>
                                <tr>
                                <th v-for="(item, ind) in headDev" class="text-center" :key="item.value">
                                    <div>{{item.text}}</div>
                                    <div v-if="devModel.statuses[item.value] === 'планирование'" style="color:#120873">{{devModel.statuses[item.value]}}</div>
                                    <div v-if="devModel.statuses[item.value] === 'в развитии'" style="color:#A68100">{{devModel.statuses[item.value]}}</div>
                                    <div v-if="devModel.statuses[item.value] === 'завершено'" style="color:#008500">{{devModel.statuses[item.value]}}</div>
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                v-for="item in devModel.devStatus"
                                :key="item.titleRow"
                                >
                                <td>{{ item.titleRow }}</td>
                                <td>{{ item.cutting }}</td>
                                <td>{{ item.printing }}</td>
                                <td>{{ item.furnance }}</td>
                                <td>{{ item.assembling }}</td>
                                <td>{{ item.final }}</td>
                                <td>{{ item.project }}</td>
                                </tr>
                            </tbody>
                            </template>
                        </v-simple-table>
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
                                <v-autocomplete outlined :items="productLine" item-text="name" item-value="id" label="Участок"
                                    v-model="testItems.productionPlace.id" dense></v-autocomplete>
                            </v-col>
                            <v-col cols="2">Дата теста</v-col>
                            <v-col cols="2">
                                <CalendarLine v-model="testItems.dateTest"></CalendarLine>
                            </v-col>
                            <v-col cols="2">Yield/KU/CAD</v-col>
                            <v-col cols="2">
                                <v-text-field label="Yield/KU/CAD" outlined dense v-model="testItems.kpi" :disabled="edit"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2">Проблема</v-col>
                            <v-col cols="10">
                                <v-textarea outlined name="input-7-4" label="проблема" value="" v-model="testItems.problem"></v-textarea>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2">Потенциальная причина</v-col>
                            <v-col cols="10">
                                <v-textarea outlined name="input-7-4" label="потенциальная причина" value="" v-model="testItems.potentialCause"></v-textarea>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2">Цель теста</v-col>
                            <v-col cols="10"><v-text-field label="Цель теста" outlined dense v-model="testItems.mainGoal" :disabled="edit"></v-text-field></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2">План на тест</v-col>
                            <v-col cols="10">
                                <v-textarea outlined name="input-7-4" label="план на тест" value="" v-model="testItems.plan">
                                </v-textarea>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2">Результат теста</v-col>
                            <v-col cols="10">
                                <v-textarea outlined name="input-7-4" label="результат теста" value="" v-model="testItems.result">
                                </v-textarea>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2">Действия до сл. наработки</v-col>
                            <v-col cols="10">
                                <v-textarea outlined name="input-7-4" label="действия до следующей наработки" value="" v-model="testItems.action">
                                </v-textarea>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3">Количество стекла во время теста</v-col>
                            <v-col cols="3">
                                <v-text-field outlined dense v-model="testItems.quantityGlasses"></v-text-field>
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
                                <template v-slot:item.actions="{ item }">
                                    <v-icon small class="mr-2" @click="showTestPlan(item.id)">
                                        mdi-printer
                                    </v-icon>
                                    <v-icon small class="mr-2" @click="editItem(item.id)">
                                        mdi-pencil
                                    </v-icon>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                    <v-container class="elevation-1">
                        <v-row>
                            <v-col><h2>Статусы готовности участка</h2></v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="1">Участок</v-col>
                            <v-col cols="3">
                                <v-autocomplete outlined :items="headDev" item-text="text" item-value="value"
                                    v-model="checkStatus" dense></v-autocomplete>
                            </v-col>
                            <v-col cols="1">Тех.лист</v-col>
                            <v-col cols="3">
                                <v-autocomplete outlined :items="statuses.informationList" item-text="text" item-value="text"
                                    v-model="devModel.devStatus[7][checkStatus]" dense></v-autocomplete>
                            </v-col>
                            <v-col cols="1">Статус развития участка</v-col>
                            <v-col cols="3">
                                <v-autocomplete outlined :items="statuses.project" item-text="text" item-value="text"
                                    v-model="devModel.statuses[checkStatus]" dense></v-autocomplete>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="1">Инструкция</v-col>
                            <v-col cols="3">
                                <v-autocomplete outlined :items="statuses.instruction" item-text="text" item-value="text"
                                    v-model="devModel.devStatus[4][checkStatus]" dense></v-autocomplete>
                            </v-col>
                            <v-col cols="1">Оснастка</v-col>
                            <v-col cols="3">
                                <v-autocomplete outlined :items="statuses.tooling" item-text="text" item-value="text"
                                    v-model="devModel.devStatus[5][checkStatus]" dense></v-autocomplete>
                            </v-col>
                            <v-col cols="1">Материал</v-col>
                            <v-col cols="3">
                                <v-autocomplete outlined :items="statuses.materials" item-text="text" item-value="text"
                                    v-model="devModel.devStatus[6][checkStatus]" dense></v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-container>
            </v-container>

            <!-- блок финансовых показателей -->
            <v-container class="elevation-1">
                <v-row>
                    <v-col cols="1"></v-col>
                    <v-col cols="10">
                        <h2>Финансовые показатели</h2>
                    </v-col>
                    <v-col cols="1">
                        <ArrowChange v-model="showBlock[3]"></ArrowChange>
                    </v-col>
                </v-row>
                <v-container v-show="showBlock[3]">
                    <v-row>
                        <v-col>
                            <v-data-table :headers="headKPI" :items="devModel.kpiItems" class="elevation-1">
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

            <v-container>
                <v-btn @click='saveDevModel()'>сохранить</v-btn>
            </v-container>
        </v-container>
        {{dateFirstTest}}
    </div>
</template>

<script>
import ArrowChange from '@/components/ArrowChange.vue';
import CalendarLine from '@/components/CalendarLine.vue'
import { httpServer } from "@/main";

    export default {
    data() {
        return {
            showBlockPlan: true,
            blankStatus: true,
            edit:false,
            showTestBlock: false,
            checkStatus: 0,
            statuses: {
                informationList: [
                    {
                        text: "Готов",
                    },
                    {
                        text: "Не готов",
                    }
                ],
                instruction: [
                    {
                        text: "Готова",
                    },
                    {
                        text: "Не готова",
                    }
                ],
                tooling: [
                    {
                        text: "Готова",
                    },
                    {
                        text: "Не готова",
                    }
                ],
                materials: [
                    {
                        text: "Валидирован",
                    },
                    {
                        text: "Не валидирован",
                    }
                ],    
                project: [
                    {
                        text: "завершено"
                    },
                    {
                        text: "в развитии"
                    },
                    {
                        text: "планирование"
                    }
                ]

            },
            headDev: [
                { text: "", align: 'center', value: "titleRow" },
                { text: "Резка", align: 'center', value: "cutting", },
                { text: "Печать", align: 'center', value: "printing", },
                { text: "Печь", align: 'center', value: "furnance",  },
                { text: "Сборка", align: 'center', value: "assembling",  },
                { text: "Финал", align: 'center', value: "final",  },
                { text: "Проект", align: 'center', value: "project",  },
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
                { text: "участок", align: 'center', value: "productionPlace.name" },
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
                id: "",
                productionPlace: {
                    id : "",
                    name: ""
                },
                quantityGlasses: "",
                dateTest: "",
                kpi: "",
                problem: "",
                potentialCause: "",
                mainGoal: "",
                plan: "",
                result: "",
                action: "",
                instruction: {
                    text: "Не готова"
                },
                tooling: {
                    text: "Не готова"
                },
                materials: {
                    text: "Не валидирован"
                },
                project: {
                    text: ""
                }
            },
            showBlock: [true, true, false, false],
            devModel:{
                model: "",
                article: "",
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
                statuses:{
                    titleRow: "",
                    cutting: "планирование",
                    printing: "планирование",
                    furnance: "планирование",
                    assembling: "планирование",
                    final: "планирование",
                    project: "планирование"
                },
                rowTests:[
                ],
                devStatus:[
                    {
                        titleRow: "№ линии/участка",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        final: "",
                        project: ""
                    },
                    {
                        titleRow: "Дата первого теста",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        final: "",
                        project: ""
                    },
                    {
                        titleRow: "Всего тестов",
                        cutting: 0,
                        printing: 0,
                        furnance: 0,
                        assembling: 0,
                        final: 0,
                        project: 0
                    },
                    {
                        titleRow: "Пропущено стекла",
                        cutting: "0",
                        printing: "0",
                        furnance: "0",
                        assembling: "0",
                        final: "0",
                        project: "0"
                    },
                    {
                        titleRow: "Инструкция",
                        cutting: "не готова",
                        printing: "не готова",
                        furnance: "не готова",
                        assembling: "не готова",
                        final: "не готова",
                        project: "не готова"
                    },
                    {
                        titleRow: "Оснастка",
                        cutting: "не готова",
                        printing: "не готова",
                        furnance: "не готова",
                        assembling: "не готова",
                        final: "не готова",
                        project: "не готова"
                    },
                    {
                        titleRow: "Материал",
                        cutting: "не валидирован",
                        printing: "не валидирован",
                        furnance: "не валидирован",
                        assembling: "не валидирован",
                        final: "не валидирован",
                        project: "не валидирован"
                    },
                    {
                        titleRow: "Тех лист",
                        cutting: "не готов",
                        printing: "не готов",
                        furnance: "не готов",
                        assembling: "не готов",
                        final: "не готов",
                        project: "не готов"
                    },
                    {
                        titleRow: "SPC",
                        cutting: "",
                        printing: "",
                        furnance: "",
                        assembling: "",
                        final: "",
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
            },
            prodLine: {
                cutting: {
                    name: "Резка",
                    list: [
                        {
                            id: 1,
                            name: "BRL-1"},
                        {
                            id: 2,
                            name: "BRL-2"},
                        {id: 3,
                            name: "BRL-4"},
                        {id: 4, 
                            name: "BRL-6"},
                        {id: 5,
                            name: "BR-92"},
                        {id: 6,
                            name: "Bystronic 3"},
                        {id: 7,
                            name: "Bystronic 9"},
                        {id: 8,
                            name: "Bystronic 1"},
                        {id: 9,
                            name: "Bystronic 2"},
                    ]
                },
                printing: {
                    name: "Печать",
                    list: [
                        { 
                            id: 21, 
                            name: "BRL-1" },
                        { 
                            id: 22,
                            name: "BRL-2" },
                        { 
                            id: 23,
                            name: "BRL-6" },
                        { 
                            id:24,
                            name: "BRL-4" },
                        { 
                            id: 25,
                            name: "ЛП10" },
                        { 
                            id:26,
                            name: "BR-92" },
                    ]
                },
                furnance: {
                    name: "Печь",
                    list: [
                        { 
                            id: 31,
                            name: "BRL-1" },
                        { 
                            id: 32,
                            name: "BRL-2" },
                        { 
                            id:33,
                            name: "BRL-3" },
                        { 
                            id:34,
                            name: "BRL-4" },
                        { 
                            id:35,
                            name: "BR-91" },
                        { 
                            id: 36,
                            name: "BR-92" },
                        { 
                            id: 37,
                            name: "Tamglass" },
                        { 
                            id:38,
                            name: "Tayfinn" },
                    ]
                },
                assembling: {
                    name: "Сборка",
                    list: [
                        { 
                            id: 50,
                            name: "BRL-1" },
                        { 
                            id: 51,
                            name: "BRL-2" },
                        { 
                            id: 52,
                            name: "BRL-6" },
                        { 
                            id:53,
                            name: "Ручная сборка BRL-6" },
                    ]
                },
                final: {
                    name: "Финал",
                    list: [
                        { id: 60,
                            name: "Новая упаковка" },
                        { 
                            id: 61,
                            name: "Старая упаковка" },
                        { 
                            id:62,
                            name: "BRL-6" },
                        { 
                            id:63,
                            name: "BR-91" },
                        { 
                            id: 64,
                            name: "BR-92" },
                    ]
                },
            }
        };
    },
    mounted(){

        if (this.$route.params.id != undefined){
            this.blankStatus = false
            httpServer.get('/Development/DevReportModel/' + this.$route.params.id)
            .then(response => (
                this.devModel = response.data
            ))
        }
    },
    methods:{
        showTestPlan(id){
            let modelId = this.$route.params.id
            let rowId = id
            let pathTo = "/Development/DevPlanTest/" + modelId + "/" + rowId
            this.$router.push({ path: pathTo, params: { modelId: "ModelId", rowId: "rowId"  } });
        },
        editItem(id){
            this.testItems = this.devModel.rowTests[id]
            this.showTestBlock = true

        },  
        pushRow(){
            this.testItems.id = this.devModel.rowTests.length


            this.prodLine.cutting.list.forEach(element =>{
                if (this.testItems.productionPlace.id === element.id){
                    this.testItems.productionPlace.name = element.name
                }
            })
            this.prodLine.printing.list.forEach(element => {
                if (this.testItems.productionPlace.id === element.id) {
                    this.testItems.productionPlace.name = element.name
                }
            })
            this.prodLine.furnance.list.forEach(element => {
                if (this.testItems.productionPlace.id === element.id) {
                    this.testItems.productionPlace.name = element.name
                }
            })
            this.prodLine.assembling.list.forEach(element => {
                if (this.testItems.productionPlace.id === element.id) {
                    this.testItems.productionPlace.name = element.name
                }
            })
            this.prodLine.final.list.forEach(element => {
                if (this.testItems.productionPlace.id === element.id) {
                    this.testItems.productionPlace.name = element.name
                }
            })
            this.devModel.rowTests.push(this.testItems)
            this.showTestBlock = !this.showTestBlock
            this.testItems = {
                productionPlace: {
                    id : "",
                    name: ""
                },
                quantityGlasses: "",
                dateTest: "",
                kpi: "",
                problem: "",
                potentialCause: "",
                plan: "",
                result: "",
                action: "",
                instruction: {
                    text: "Не готова"
                },
                tooling: {
                    text: "Не готова"
                },
                materials: {
                    text: "Не валидирован"
                },
                project: {
                    text: ""
                }
            }
        },
        saveDevModel(){
            if (this.blankStatus){
                httpServer.post("Development/DevReportModel", this.devModel)
            } else {
                httpServer.post("Development/DevReportModel/" + this.$route.params.id, this.devModel)
            }
            
        }
    },
    computed:{
        productLine(){
            let arr=[]
            this.prodLine.cutting.list.forEach(elem => {
                let obj = elem
                obj.name = this.prodLine.cutting.name + " " + elem.name
                arr.push(obj) 
            })
            this.prodLine.printing.list.forEach(elem => {
                let obj = elem
                obj.name = this.prodLine.printing.name + " " + elem.name
                arr.push(obj)
            })
            this.prodLine.furnance.list.forEach(elem => {
                let obj = elem
                obj.name = this.prodLine.furnance.name + " " + elem.name
                arr.push(obj)
            })
            this.prodLine.assembling.list.forEach(elem => {
                let obj = elem
                obj.name = this.prodLine.assembling.name + " " + elem.name
                arr.push(obj)
            })
            this.prodLine.final.list.forEach(elem => {
                let obj = elem
                obj.name = this.prodLine.final.name + " " + elem.name
                arr.push(obj) 
            })
            return arr
        },
        dateFirstTest(){
            let arr=""

            if (this.devModel.rowTests.length != 0){
                this.devModel.devStatus[2].cutting = 0 
                this.devModel.devStatus[2].printing = 0 
                this.devModel.devStatus[2].furnance = 0 
                this.devModel.devStatus[2].assembling = 0 
                this.devModel.devStatus[2].final = 0 
                this.devModel.devStatus[3].cutting = 0
                this.devModel.devStatus[3].printing = 0
                this.devModel.devStatus[3].furnance = 0
                this.devModel.devStatus[3].assembling = 0
                this.devModel.devStatus[3].final = 0 

            
               this.devModel.rowTests.forEach(element => {
                    if (element.productionPlace.id < 20){
                        this.devModel.devStatus[2].cutting += 1
                        this.devModel.devStatus[3].cutting += Number(element.quantityGlasses)
                        this.devModel.devStatus[0].cutting = element.productionPlace.name
                        if (element.dateTest < arr.cutting || this.devModel.devStatus[1].cutting === ''){
                            this.devModel.devStatus[1].cutting = element.dateTest
                        }
                    } else if (element.productionPlace.id > 19 && element.productionPlace.id < 30) {
                        this.devModel.devStatus[2].printing += 1
                        this.devModel.devStatus[3].printing += Number(element.quantityGlasses)
                        this.devModel.devStatus[0].printing = element.productionPlace.name
                        if (element.dateTest < arr.printing || this.devModel.devStatus[1].printing === '') {
                            this.devModel.devStatus[1].printing = element.dateTest
                        }
                    } else if (element.productionPlace.id > 29 && element.productionPlace.id < 50) {
                        this.devModel.devStatus[2].furnance += 1
                        this.devModel.devStatus[3].furnance += Number(element.quantityGlasses)
                        this.devModel.devStatus[0].furnance = element.productionPlace.name
                        if (element.dateTest < arr.furnance || this.devModel.devStatus[1].furnance === '') {
                            this.devModel.devStatus[1].furnance = element.dateTest
                        }
                    } else if (element.productionPlace.id > 49 && element.productionPlace.id < 60) {
                        this.devModel.devStatus[2].assembling += 1
                        this.devModel.devStatus[3].assembling += Number(element.quantityGlasses)
                        this.devModel.devStatus[0].assembling = element.productionPlace.name
                        if (element.dateTest < arr.assembling || this.devModel.devStatus[1].assembling === '') {
                            this.devModel.devStatus[1].assembling = element.dateTest
                        }
                    } else if (element.productionPlace.id > 59) {
                        this.devModel.devStatus[2].final += 1
                        this.devModel.devStatus[3].final += Number(element.quantityGlasses)
                        this.devModel.devStatus[0].final = element.productionPlace.name
                        if (element.dateTest < arr.final || this.devModel.devStatus[1].final === '') {
                            this.devModel.devStatus[1].final = element.dateTest
                        }
                    }
                }) 
                this.devModel.devStatus[2].project = this.devModel.devStatus[2].cutting + this.devModel.devStatus[2].printing + this.devModel.devStatus[2].furnance + this.devModel.devStatus[2].assembling + this.devModel.devStatus[2].final  
            }
            return arr
        }
    },
    watch:{
        showTestBlock(newValue, oldValue) {
            return this.showTestBlock
        }
    },
    components: { ArrowChange, CalendarLine }
}
</script>

<style scoped>
table th+th {
    border-left: 1px solid #dddddd;
}

table tr+tr{
    border-bottom: 1px solid #dddddd;
}

table td+td {
    border-left: 1px solid #dddddd;
}
.bb{
    border-bottom: 1px solid #dddddd;
}
.print-block{
    position: absolute;
    z-index: 1;
    background: white;
    margin: 0 0 0 -25px
}
</style>