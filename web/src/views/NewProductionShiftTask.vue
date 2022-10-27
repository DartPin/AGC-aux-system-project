<template>
    <v-container class="elevation-1">
        <h1>Создать задание на смену</h1>
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
                                    <td>
                                        <v-checkbox v-model="item.check"></v-checkbox>
                                    </td>
                                    <td class="text-left">Модель: {{ item.model }} Артикль: {{ item.article }}</td>
                                    <td class="text-left">JOB: {{ item.screenJob }} Поверхность: {{ item.surface }}
                                        Рама:{{ item.frame }} Сетка: {{ item.net }}</td>
                                    <td class="text-left">Комментарий: {{ item.comment }}</td>
                                    <td>
                                        <span v-if="item.status.ind === 0" style="color: #29B6F6">{{ item.status.text
                                        }}</span>
                                        <span v-if="item.status.ind === 1" style="color: #120873">{{ item.status.text
                                        }}</span>
                                        <span v-if="item.status.ind === 2" style="color: #A68100">{{ item.status.text
                                        }}</span>
                                        <span v-if="item.status.ind === 3" style="color: #008500">{{ item.status.text
                                        }}</span>
                                        <span v-if="item.status.ind === 4" style="color: #B71C1C">{{ item.status.text
                                        }}</span>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-container>
        </v-row>
        {{ screenList }}
        <v-row>
            <v-dialog v-model="dialog">
                <template v-slot:activator="{ on }">
                    <v-col>
                        <v-btn v-on="on">Добавить экраны в сменное задание</v-btn>
                    </v-col>
                </template>
                <v-card>
                    <v-container>
                        <v-row>
                            <v-col>
                                <h2>Выбрано N моделей</h2>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>Задание на дату:</v-col>
                            <v-col>
                                <CalendarLine></CalendarLine>
                            </v-col>
                            <v-col>Фотопечатник:</v-col>
                            <v-col>
                                <v-autocomplete outlined :items="users" dense></v-autocomplete>
                            </v-col>
                            <v-col>Время работы</v-col>
                            <v-col>
                                <v-autocomplete outlined :items="hours" dense></v-autocomplete>
                            </v-col>
                            <v-col>
                                <v-autocomplete outlined :items="hours" dense></v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<script>
import { httpServer } from "@/main";
import CalendarLine from '@/components/CalendarLine.vue';

export default {
    data() {
        return {
            choosenDate: new Date(),
            screensList: {
                list: []
            },
            hours: [7, 15, 19, 23],
            users: ["Малинкин Павел", "Кабикин Николай", "Скапишев Николай", "Климов Артем"]
        };
    },
    mounted() {
        let newDate = { date: new Date() };
        httpServer.post("/Production/DateListScreen", newDate)
            .then(response => (this.screensList = response.data));
    },
    watch: {
        screensList(newValue, oldValue) {
            return this.screenslist;
        },
    },
    methods: {
        changeDate(val) {
            let x = this.choosenDate.setDate(this.choosenDate.getDate() + val);
            this.choosenDate = new Date(x);
            let newDate = { date: this.choosenDate };
            httpServer.post("/Production/DateListScreen", newDate)
                .then(response => (this.screensList = response.data));
        },
    },
    computed: {
        screenList() {
            let arr = [];
            this.screensList.list.forEach((elem, ind) => {
                if (elem === null) {
                    arr.push(1);
                }
                else {
                    arr.push(0);
                }
            });
            for (let i = arr.length - 1; i > -1; i--) {
                if (arr[i] === 1) {
                    this.screensList.list.splice(i, 1);
                }
            }
            return this.screensList;
        },
    },
    components: { CalendarLine }
}
</script>