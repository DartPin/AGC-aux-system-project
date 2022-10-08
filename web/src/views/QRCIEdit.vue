
<template>
    <v-container>
        <v-row>
            <v-col cols="1">
                <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
                >
                <template v-slot:activator="{ on}">
                    <v-icon v-on="on">mdi-cog-outline</v-icon>
                </template>
                    <v-container @click='edit()'>редактировать</v-container>
                </v-menu>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="8"><h1>Протокол работы команды улучшения {{qrciData.number}}</h1></v-col>
            <v-spacer></v-spacer>
            <v-col cols="3">
                <v-row>
                    <v-col cols="4">Дата открытия:</v-col>
                    <v-col cols="8">
                        <v-text-field disabled outlined dense v-model="qrciData.dateOpen"></v-text-field></v-col>      
                </v-row>
            </v-col>       
        </v-row>
        
        <v-container class="elevation-1" style="font-size: 14px">
            <v-row>
                <v-col cols="2">Производство</v-col>
                <v-col cols="4">
                    <v-text-field disabled outlined dense v-model="departments[qrciData.department].name"></v-text-field>
                </v-col>
                <v-spacer></v-spacer>
            </v-row>
            <v-row>
                <v-col cols="2">Лидер команды</v-col>
                <v-col cols="4">
                    <v-autocomplete
                        outlined
                        dense
                        :items="userName"
                        item-text='name' 
                        item-value="idUser"
                        v-model="qrciData.lider"
                    ></v-autocomplete>
                </v-col>
                <v-col cols="2">Участники</v-col>
                <v-col cols="4">
                    <v-autocomplete
                            outlined
                            dense
                            :items="userName"
                            item-text='name' 
                            item-value="idUser"
                            v-model="qrciData.team"
                            multiple
                    ></v-autocomplete>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="2">Спонсор команды</v-col>
                <v-col cols="4">
                        <v-autocomplete
                            outlined
                            dense
                            :items="userName"
                            item-text='name' 
                            item-value="idUser"
                            v-model="qrciData.sponsor"
                        ></v-autocomplete>                    
                </v-col>
                <v-col cols="2">Классификация проблемы</v-col>
                <v-col cols="4">
                    <v-text-field disabled outlined dense v-model="qrciData.problemClassification.name"></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="2">Формулировка проблемы</v-col>
                <v-col cols="10" v-if="qrciData.problemClassification.id === 0"><v-text-field outlined dense v-model="problemText"></v-text-field></v-col>
                <template v-if="qrciData.problemClassification.id === 1">
                <v-col cols="2">
                    <v-autocomplete
                            outlined
                            dense
                            :items="models"
                            item-text='model' 
                            item-value="id"
                            v-model="qrciData.problem.problemData.model"
                    ></v-autocomplete>
                </v-col>
                <v-col cols="2">
                    <v-autocomplete
                            outlined
                            dense
                            :items="models[indexModel-1].articles"
                            item-text='art' 
                            item-value="id"
                            v-model="qrciData.problem.problemData.article"
                    ></v-autocomplete>
                </v-col>
                <v-col cols="2">
                    <v-text-field outlined dense label="Участок" v-model="qrciData.problem.problemData.place"></v-text-field>
                </v-col>
                <v-col cols="2">
                    <v-text-field outlined dense label="Дефект" v-model="qrciData.problem.problemData.defect"></v-text-field>
                </v-col>
                <v-col cols="2">
                    <v-text-field outlined dense label="Количество" v-model="qrciData.problem.problemData.quantity"></v-text-field>
                </v-col>
                </template>
                <template v-if="qrciData.problemClassification.id === 2">
                <v-col cols="4">
                    <v-autocomplete
                            outlined
                            dense
                            :items="KUProblems"
                            label="вид простоя"
                            item-text='name' 
                            item-value="id"
                            v-model="qrciData.problem.problemData.downtime"
                    ></v-autocomplete>
                </v-col>
                <v-col cols="3">
                    <v-text-field outlined dense label="Участок" v-model="qrciData.problem.problemData.place"></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field outlined dense label="Время в минутах" v-model="qrciData.problem.problemData.time"></v-text-field>
                </v-col>
                </template>
                <template v-if="qrciData.problemClassification.id === 3">
                <v-col cols="5">
                    <v-autocomplete
                            outlined
                            dense
                            :items="models"
                            item-text='model' 
                            item-value="id"
                            v-model="qrciData.problem.problemData.model"
                    ></v-autocomplete>
                </v-col>
                <v-col cols="5">
                    <v-autocomplete
                            outlined
                            dense
                            :items="models[indexModel-1].articles"
                            item-text='art' 
                            item-value="id"
                            v-model="qrciData.problem.problemData.article"
                    ></v-autocomplete>
                </v-col>
                </template>
                <template v-if="qrciData.problemClassification.id === 4">
                <v-col cols="3">
                    <v-autocomplete
                            outlined
                            dense
                            :items="models"
                            item-text='model' 
                            item-value="id"
                            v-model="qrciData.problem.problemData.model"
                    ></v-autocomplete>
                </v-col>
                <v-col cols="2">
                    <v-autocomplete
                            outlined
                            dense
                            :items="models[indexModel-1].articles"
                            item-text='art' 
                            item-value="id"
                            v-model="qrciData.problem.problemData.article"
                    ></v-autocomplete>
                </v-col>
                <v-col cols="3">
                    <v-text-field outlined dense label="Дефект" v-model="qrciData.problem.problemData.defect"></v-text-field>
                </v-col>
                <v-col cols="2">
                    <v-text-field outlined dense label="Количество" v-model="qrciData.problem.problemData.quantity"></v-text-field>
                </v-col>
                </template>
            </v-row>
            <v-row>
                <v-col cols="2">Эта проблема может быть с другими заготовками или артиклями</v-col>
                <v-col cols="4"><v-text-field outlined dense v-model="qrciData.anotherArticle"></v-text-field></v-col>
                <v-col cols="2">Место и причины НЕОБНАРУЖЕНИЯ несоответствия</v-col>
                <v-col cols="4"><v-text-field outlined dense v-model="qrciData.place"></v-text-field></v-col>
            </v-row>
            <v-row>
                <v-col cols="2">Коренные причины ВОЗНИКНОВЕНИЯ несоответствия</v-col>
                <v-col cols="10"><v-text-field outlined dense v-model="qrciData.rootCause"></v-text-field></v-col>
            </v-row>
        </v-container>
        <v-container class="elevation-1">
            <v-tabs align-with-title>
                <v-tab>ПРОТОКОЛ</v-tab>
                <v-tab>5WHY</v-tab>
            </v-tabs>
        </v-container>
        <v-container class="elevation-1">  
            <v-row style="margin: 10px 0 0 0">          
                <v-btn @click="showInputRow = true" class="mx-auto" v-if="!showInputRow">+ДОБАВИТЬ</v-btn>
                <v-btn @click="pushNewRow()" class="mx-auto" v-if="showInputRow">СОХРАНИТЬ</v-btn>
            </v-row>
            <v-row v-if="showInputRow">
                <v-row>
                    <v-col cols="4"><v-text-field outlined dense label="Тема" v-model="newRow.theme"></v-text-field></v-col>
                    <v-col cols="4"><v-text-field outlined dense label="Действие" v-model="newRow.action"></v-text-field></v-col>
                    <v-col cols="4">
                        <v-autocomplete
                            outlined
                            dense
                            :items="userName"
                            item-text='name' 
                            item-value="idUser"
                            v-model="newRow.responsible"
                        ></v-autocomplete> 
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="2"><CalendarLine v-model="newRow.date"></CalendarLine></v-col>
                    <v-col cols="2"><v-text-field outlined dense label="%" v-model="newRow.percent"></v-text-field></v-col>
                    <v-col cols="2"><v-text-field outlined dense label="Статус" v-model="newRow.status"></v-text-field></v-col>
                    <v-col cols="6"><v-text-field outlined dense label="Примечание/Результат" v-model="newRow.comment"></v-text-field></v-col>
                </v-row>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-data-table
                        :headers="headers"
                        :items="qrciData.qrciRows"
                        :items-per-page="20"
                        class="elevation-1"
                    >
                        <template v-slot:item.percent="{ item }">
                            <v-progress-linear
                            v-model="item.percent"
                            height="25"
                            >
                            <strong>{{ Math.ceil(item.percent) }}%</strong>
                            </v-progress-linear>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-dialog v-model="photoDialog" width="500px">
                                <template v-slot:activator="{on}">
                                    <v-icon small class="mr-2" style="margin-right:10px" v-on="on" @click="numStr = item.id">
                                        mdi-file-image-plus-outline
                                    </v-icon>
                                </template>
                                <v-card>
                                    <label>File
                                        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
                                    </label>
                                    <v-btn @click="submitFile()">Загрузить</v-btn>
                                </v-card>
                            </v-dialog>
                            <v-icon small class="mr-2" @click="editItem(item)">
                                mdi-pencil
                            </v-icon>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row> 
            <v-row>
                <v-carousel>
                    <v-carousel-item v-for="(item,i) in photos" :key="i" :src="item" reverse-transition="fade-transition"
                        transition="fade-transition"></v-carousel-item>
                </v-carousel>
            </v-row>
            <v-row>
                <v-spacer></v-spacer>
                <v-col cols="2"><v-btn @click="saveQRCI()">СОХРАНИТЬ</v-btn></v-col>
                <v-spacer></v-spacer>
                <v-col cols="2"><v-btn>ОТМЕНИТЬ</v-btn></v-col>
                <v-spacer></v-spacer>
            </v-row>
        </v-container>
        
    </v-container>
</template>

<script>
import CalendarLine from '@/components/CalendarLine.vue';
import axios from 'axios';
import {httpServer} from "@/main";

    export default{
    data() {
        return {
            photoDialog: false,
            date: null,
            file: '',
            users: [],
            menu: false,
            models: [],
            showInputRow: false,
            indexModel: 1,
            problemIndex: 0,
            numStr: 0,
            problemText: "",
            problems: [
                {name: "Прочее", id: 0},
                {name: "NRFT", id: 1},
                {name: "KU", id: 2},
                {name: "CAD", id: 3},
                {name: "Качество", id: 4}
            ],
            KUProblems: [
                {name: "аварийный простой", id: 0},
                {name: "настройка линии", id: 1},
                {name: "переход", id: 2}
            ],
            departments: [
                {name: "Закаленное стекло", idDepart: 0},
                {name: "Триплекс", idDepart: 1},
                {name: "ARG", idDepart: 2},
                {name: "AVO", idDepart: 3},
                {name: "БРЛ-6", idDepart: 4},
                {name: "Тех. обслуживание", idDepart: 5},
            ],
            headers: [
                { text: 'Тема',align: 'center', value: 'theme' },
                { text: 'Действия',align: 'center', value: 'action' },
                { text: 'Ответственный',align: 'center', value: 'responsible' },
                { text: 'Дата',align: 'center', value: 'date' },
                { text: 'Выполнение',align: 'center', value: 'percent' },
                { text: 'Статус',align: 'center', value: 'status.title' },
                { text: 'Коментарий',align: 'center', value: 'comment' },
                { text: 'Действие', align: 'center', value: 'actions'}
            ],
            newRow: {
                id: '',
                theme: '',
                action: '',
                responsible: '',
                date: '',
                percent: '',
                status: '',
                comment: '',
                status: {
                    title: "В работе",
                    index: 0
                },
                photos: [],
                newPhotos: []
            },
            qrciData: {
                department: '',
                number: '',
                dateOpen: "",
                lider: "",
                team: "",
                sponsor: "",
                problemClassification: "",
                problem: {
                    problemIndex: 1,
                    problemData: {
                        model: "",
                        article: "",
                        place: "",
                        defect: "",
                        quantity: "",
                        time: "",
                        downtime: "",
                        problemText: ""
                    }
                },
                anotherArticle: "",
                place: "",
                rootCause: "",
                qrciRows: [],
                dateClose: ""
            }
        };
    },
    mounted(){
      httpServer.get('Users')
            .then(response => (
                this.users = response.data
        ))
      httpServer.get('Models')
            .then(response => (
                this.models = response.data
        ))
      httpServer.get('Quality/Department/' + this.$route.params.depart + '/QRCI/' + this.$route.params.id)
            .then(response => (
                this.qrciData = response.data
            ))

    },
    beforeUpdate(){
    },
    methods:{
        saveQRCI(){
            if (this.qrciData.problemClassification.id === 0) {
                this.qrciData.problem.problemData.problemText = this.problemText
            } else if  (this.qrciData.problemClassification.id === 1){
                this.qrciData.problem.problemData.problemText = this.models[this.qrciData.problem.problemData.model-1].model + ' ' + this.qrciData.problem.problemData.article + ' ' + this.qrciData.problem.problemData.defect + ' на участке ' + this.qrciData.problem.problemData.place + ' в количестве ' + this.qrciData.problem.problemData.quantity + 'шт'        
            } else if (this.qrciData.problemClassification.id === 2){
                this.qrciData.problem.problemData.problemText = this.KUProblems[this.qrciData.problem.problemData.downtime].name + " на участке " + this.qrciData.problem.problemData.place + " в количестве " + this.qrciData.problem.problemData.time + " мин."
            } else if  (this.qrciData.problemClassification.id === 3){
                this.qrciData.problem.problemData.problemText = "Низкая производительность на " + this.models[this.qrciData.problem.problemData.model-1].model + ' ' + this.qrciData.problem.problemData.article         
            } else if  (this.qrciData.problemClassification.id === 4){
                this.qrciData.problem.problemData.problemText = this.models[this.qrciData.problem.problemData.model-1].model + ' ' + this.qrciData.problem.problemData.article + ' ' + this.qrciData.problem.problemData.defect +  ' в количестве ' + this.qrciData.problem.problemData.quantity + 'шт'        
            }


          httpServer.post('Quality/Department/' + this.$route.params.depart + '/QRCI/' + this.$route.params.id, this.qrciData)
        },
        pushNewRow(){
            if (this.newRow.id != ''){
                this.qrciData.qrciRows[this.newRow.id] = this.newRow
            } else if (this.newRow.id === 0) {
                this.qrciData.qrciRows[0] = this.newRow
            } else {
                this.newRow.id = this.qrciData.qrciRows.length
                this.qrciData.qrciRows.push(this.newRow)
            }
            this.newRow = {
                id: "",
                theme: '',
                action: '',
                responsible: '',
                date: '',
                percent: '',
                comment: '',
                status: {
                    title: "В работе",
                    index: 0
                },
                photos: [],
                newphotos: []
            } 
            this.showInputRow = false
        },
        submitFile(){
            let formData = new FormData();
            if (this.qrciData.qrciRows[this.numStr].newPhotos != undefined){
                this.qrciData.qrciRows[this.numStr].newPhotos.push({
                    row: this.numStr,
                    title: this.file.name
                })
            } else {
                this.qrciData.qrciRows[this.numStr].newPhotos = []
                this.qrciData.qrciRows[this.numStr].newPhotos.push({
                    row: this.numStr,
                    title: this.file.name
                })
            }
            formData.append('file', this.file);
          httpServer.post( 'single-file',
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              }
            ).then(function(){
            console.log('SUCCESS!!');
            })
            .catch(function(){
            console.log('FAILURE!!');
            });
            this.file = ""
            this.photoDialog = false
        },
        handleFileUpload(){
            this.file = this.$refs.file.files[0];
        },
        editItem(item){
            this.newRow = item
            this.showInputRow = true
        },
    },
    computed: {
        userName(){
            let arr=[]
            this.users.forEach(elem =>{
                arr.push({
                    name: elem.sirname + " " + elem.name,
                    id: elem.idUser
                })
            })
            return arr
        },
        photos(){
            let arr = []
            
            this.qrciData.qrciRows.forEach(element =>{
                element.photos.forEach(photo =>{
                    let str = photo.title.split('.')
                      arr.push('getImage/'+str[0])
                  })
            })
            console.log(arr)
            return arr
        }  
        
    },
    components: { CalendarLine}
}
</script>