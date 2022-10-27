<template>
    <v-container class="elevation-1" style="margin-bottom: 20px">
        <v-row>
            <v-col>
                <h1>Заявка на изготовление экранов</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="2">Линия:</v-col>
            <v-col cols="2">
                <v-autocomplete outlined :items="productionLine" item-text="text" item-value="id" v-model="choosenLine"
                    dense></v-autocomplete>
            </v-col>
            <v-col cols="2">Дата:</v-col>
            <v-col cols="2">
                <CalendarLine v-model="date"></CalendarLine>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="1">Модель:</v-col>
            <v-col cols="1">
                <v-text-field label="модель" v-model="currentModel.model" outlined dense></v-text-field>
            </v-col>
            <v-col cols="1">Артикль:</v-col>
            <v-col cols="1">
                <v-text-field label="артикль" v-model="itemArticle" outlined dense></v-text-field>
            </v-col>
            <v-col cols="1">Рама:</v-col>
            <v-col cols="1">
                <v-text-field label="рама" v-model="currentModel.frameText" outlined dense></v-text-field>
            </v-col>
            <v-col cols="1">Комментарий:</v-col>
            <v-col cols="4">
                <v-text-field label="коментарий" v-model="currentModel.comment" outlined dense></v-text-field>
            </v-col>
            <v-col cols="1">
                <v-icon color="#008500" @click="pushRow()">
                    mdi-check-bold
                </v-icon>
                <v-icon color="red darken-4" @click="cancelRow()">
                    mdi-close-thick
                </v-icon>
                <v-dialog v-model="dialog">
                    <template v-slot:activator="{ on }">
                        <v-icon class="mr-2" style="color: #7986CB" v-on="on">
                            mdi-pencil
                        </v-icon>
                    </template>
                    <v-card class="elevation-1">
                        <v-container>
                            <v-row>
                                <v-col>
                                    <h2>Редактирование информации о модели</h2>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="2">Модель</v-col>
                                <v-col cols="4">
                                    <v-text-field label="модель" v-model="currentModel.model" outlined dense>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="2">Артикль</v-col>
                                <v-col cols="4">
                                    <v-text-field label="артикль" v-model="itemArticle" disabled outlined dense>
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="2">Рама</v-col>
                                <v-col cols="2">
                                    <v-text-field label="высота" outlined dense v-model="currentModel.frame[0]">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="2">
                                    <v-text-field label="ширина" outlined dense v-model="currentModel.frame[1]">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <h3>Поверхность P2</h3>
                                </v-col>
                            </v-row>
                            <v-row v-for="surface of currentModel.surfaces.p2">
                                <v-col cols="1">
                                    <v-checkbox style=" margin-top: -5px"></v-checkbox>
                                </v-col>
                                <v-col cols="2">JOB</v-col>
                                <v-col cols="3">
                                    <v-text-field label="job" v-model="surface.job" outlined dense></v-text-field>
                                </v-col>
                                <v-col cols="2">Сетка</v-col>
                                <v-col cols="3">
                                    <v-text-field label="сетка значения вводятся через '-'" v-model="surface.net"
                                        outlined dense></v-text-field>
                                </v-col>
                                <v-col cols="1">
                                    <v-btn @click="currentModel.surfaces.p2.push({ job: '', net: '' })">+</v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <h3>Поверхность P4</h3>
                                </v-col>
                            </v-row>
                            <v-row v-for="surface of currentModel.surfaces.p4">
                                <v-col cols="1">
                                    <v-checkbox style=" margin-top: -5px"></v-checkbox>
                                </v-col>
                                <v-col cols="2">JOB</v-col>
                                <v-col cols="3">
                                    <v-text-field label="job" v-model="surface.job" outlined dense></v-text-field>
                                </v-col>
                                <v-col cols="2">Сетка</v-col>
                                <v-col cols="3">
                                    <v-text-field label="сетка значения вводятся через '-'" v-model="surface.net"
                                        outlined dense></v-text-field>
                                </v-col>
                                <v-col cols="1">
                                    <v-btn @click="currentModel.surfaces.p4.push({ job: '', net: '' })">+</v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-btn @click="saveEditModel()">Сохранить</v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="1">Поверхность:</v-col>
            <v-col cols="1">
                <v-autocomplete outlined label="поверхность" :items="surface" item-text="title" item-value="id"
                    v-model="surfaceId" dense>
                </v-autocomplete>
            </v-col>
            <v-col cols="1">JOB:</v-col>
            <v-col cols="1">
                <v-text-field label="JOB" v-model="currentModel.job" outlined dense></v-text-field>
            </v-col>
            <v-col cols="1">Сетка:</v-col>
            <v-col cols="1">
                <v-text-field label="Сетка" v-model="currentModel.net" outlined dense></v-text-field>
            </v-col>
            <v-col cols="5" style="color: #B71C1C" v-if="showAlert">
                * не все поля содержат данные. Проверьте выбрана ли поверхность. <br>Добавьте необходимые данные для
                модели, нажав
                <v-icon small class="mr-2" style="color: #B71C1C">
                    mdi-pencil
                </v-icon>
            </v-col>
        </v-row>
        <v-row>
            <v-container class="elevation-1" style="margin-bottom: 20px">
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr style="background: #7986CB">
                                <th class="text-center" @click="changeDate(-1)">
                                    <v-icon>
                                        mdi-chevron-triple-left
                                    </v-icon>
                                </th>
                                <th colspan="3" class="text-center">
                                    <h2>Экраны заказанные на {{ choosenDate.toLocaleDateString() }}</h2>
                                </th>
                                <th class="text-center" @click="changeDate(1)">
                                    <v-icon>
                                        mdi-chevron-triple-right
                                    </v-icon>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="elem of screenList.list">
                                <tr v-if="elem.list.length != 0">
                                    <td style="background: #9FA8DA">
                                        <h3>{{ elem.prodLine.text }}</h3>
                                    </td>
                                    <td style="background: #9FA8DA"></td>
                                    <td style="background: #9FA8DA"></td>
                                    <td style="background: #9FA8DA"></td>
                                    <td style="background: #9FA8DA"></td>
                                </tr>
                                <tr v-for="item of elem.list" :key="item.id">
                                    <td></td>
                                    <td class="text-left">Модель: {{ item.model }} Артикль: {{ item.article }}</td>
                                    <td class="text-left">JOB: {{ item.screenJob }} Поверхность: {{ item.surface }}
                                        Рама:{{ item.frame }} Сетка: {{ item.net }}</td>
                                    <td class="text-left">Комментарий: {{ item.comment }}</td>
                                    <td>
                                        <v-icon @click="deleteItem(elem, item)">
                                            mdi-delete-forever
                                        </v-icon>
                                    </td>
                                </tr>
                            </template>

                        </tbody>
                    </template>
                </v-simple-table>
            </v-container>
        </v-row>
    </v-container>
</template>

<script>
import { httpServer } from "@/main";
import CalendarLine from '@/components/CalendarLine.vue';

export default {
    data() {
        return {
            dialog: false,
            surfaceId: 0,
            surface: [
                { id: 0, title: "p2" },
                { id: 1, title: "p4" }
            ],
            productionLine: [
                {
                    id: 0,
                    text: "BR-L1"
                },
                {
                    id: 1,
                    text: "BR-L2"
                },
                {
                    id: 2,
                    text: "BR-L4"
                },
                {
                    id: 3,
                    text: "BR-L6"
                },
                {
                    id: 4,
                    text: "BR-92"
                },
                {
                    id: 5,
                    text: "ЛП10"
                }
            ],
            date: "",
            choosenLine: "",
            choosenDate: new Date(),
            itemArticle: "",
            itemRow: {
                id: "",
                model: "",
                articles: [
                    {
                        art: "",
                        frame: ["", ""],
                        surfaces: {
                            p2: [{ job: "", current: "", date: "", net: "" }],
                            p4: [{ job: "", current: "", date: "", net: "" }]
                        }
                    }
                ]

            },
            screensList: {
                list: []
            }
        };
    },
    watch: {
        choosenDate(newValue, oldValue) {
            return this.choosenDate
        },
        screensList(newValue, oldValue) {
            return this.screenslist
        },
        itemArticle(newValue, oldValue) {
            let obj = { article: newValue }
            if (this.itemArticle.length > 6) {
                httpServer.post("/FindModels", obj)
                    .then(response => (
                        this.itemRow = response.data
                    ))
            } else {
                this.itemRow = {
                    id: "",
                    model: "",
                    articles: [
                        {
                            art: "",
                            frame: ["", ""],
                            surfaces: {
                                p2: [{ job: "", current: "", date: "", net: "" }],
                                p4: [{ job: "", current: "", date: "", net: "" }]
                            }
                        }
                    ]
                }
            }

        }
    },
    mounted() {
        let newDate = { date: new Date() }
        httpServer.post("/Production/DateListScreen", newDate)
            .then(response => (
                this.screensList = response.data
            ))
    },
    methods: {
        pushRow() {
            if (this.showAlert === false) {
                this.itemRow.choosenLine = this.productionLine[this.choosenLine]
                let obj = {
                    screensListId: this.screensList.id,
                    id: 0,
                    model: this.currentModel.model,
                    article: this.itemArticle,
                    screenJob: this.currentModel.job,
                    comment: this.itemRow.comment,
                    date: this.date,
                    choosenLine: this.itemRow.choosenLine,
                    number: "",
                    frame: this.currentModel.frameText,
                    net: this.currentModel.net,
                    surface: this.surface[this.surfaceId].title
                }
                httpServer.post("/newScreen", obj)
                    .then(response => (
                        this.screensList = response.data
                    ))
                this.itemRow = {
                    id: "",
                    model: "",
                    articles: [
                        {
                            art: "",
                            frame: ["", ""],
                            surfaces: {
                                p2: [{ job: "", current: "", date: "", net: "" }],
                                p4: [{ job: "", current: "", date: "", net: "" }]
                            }
                        }
                    ]

                }
                this.itemArticle = ""
            }
        },
        cancelRow() {
            this.itemRow = {
                id: "",
                model: "",
                articles: [
                    {
                        art: "",
                        frame: ["", ""],
                        surfaces: {
                            p2: [{ job: "", current: "", date: "", net: "" }],
                            p4: [{ job: "", current: "", date: "", net: "" }]
                        }
                    }
                ]

            }
        },
        changeDate(val) {
            let x = this.choosenDate.setDate(this.choosenDate.getDate() + val);
            this.choosenDate = new Date(x)
            let newDate = { date: this.choosenDate }
            httpServer.post("/Production/DateListScreen", newDate)
                .then(response => (
                    this.screensList = response.data
                ))
        },
        deleteItem(line, row) {
            let obj = {
                dateId: this.screenList.id,
                prodLineId: line.prodLine.id,
                rowId: row.id
            }
            httpServer.post("/Production/DeleteScreen", obj)
                .then(response => (
                    this.screensList = response.data
                ))
        },
        saveEditModel() {
            httpServer.post("/Production/SaveModelInfo", this.currentModel)
            this.dialog = false
        }
    },
    computed: {
        checkValue() {
            if (this.date === "" || this.choosenLine === "") {
                return false
            } else {
                return true
            }
        },
        screenList() {
            let arr = []
            this.screensList.list.forEach((elem, ind) => {
                if (elem === null) {
                    arr.push(1)
                } else {
                    arr.push(0)
                }
            })
            for (let i = arr.length - 1; i > -1; i--) {
                if (arr[i] === 1) {
                    this.screensList.list.splice(i, 1)
                }
            }

            return this.screensList
        },
        showAlert() {
            if (this.itemArticle.length > 6) {
                if (this.currentModel.model != "" && this.currentModel.job != "" && this.currentModel.frame != "" && this.currentModel.net != "") {
                    return false
                } else {
                    return true
                }
            }
        },
        currentModel() {
            let obj = {}
            obj.model = this.itemRow.model
            obj.article = this.itemArticle
            obj.frame = []
            obj.surfaces = {}
            this.itemRow.articles.forEach(element => {
                if (element.art === Number(this.itemArticle)) {
                    obj.frame = element.frame
                    obj.surfaces = element.surfaces
                    obj.net = element.surfaces[this.surface[this.surfaceId].title][0].net
                    obj.job = element.surfaces[this.surface[this.surfaceId].title][0].job
                    obj.frameText = obj.frame[0] + "x" + obj.frame[1]
                }
            })
            return obj
        }
    },
    components: { CalendarLine }
}
</script>