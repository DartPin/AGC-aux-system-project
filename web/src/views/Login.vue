<template>
    <div class="auth">
    <v-container align-content-center style="margin: 100px 0 200px 0">
        <v-card max-width="400" class="mx-auto">  
            <v-row >
                <v-col><h1><b>LOGIN</b></h1></v-col>
            </v-row>
            <v-row >
                <v-col cols="10" class="mx-auto">
                    <v-text-field 
                        label="Имя пользователя"
                        v-model="user.login"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row >
                <v-col cols="10" class="mx-auto">
                    <v-text-field 
                        label="Пароль"
                        type="password"
                        v-model="user.password"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row v-show="showAlert">
                <v-col style="color: red">Вы неверно ввели учетную запись или пароль</v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn color="primary" @click="sendLogin()">ВОЙТИ</v-btn>
                </v-col>
            </v-row>
        </v-card>  
    </v-container>
    </div>
</template>

<script>
import { httpServer } from "@/main";

    export default{
        data(){
            return {
                user: {
                    login: "",
                    password: ""
                },
                showAlert: false,
                checkAuth: null
            }
        },
        methods:{
            sendLogin(){
                httpServer.post("/Login", this.user)
                    .then(response => (
                        this.checkAuth = response.data
                    ))
            }
        },
        watch:{
            checkAuth(newValue, oldValue) {
                if (newValue === true){
                    this.$router.push({ path: '/Quality/ListQRCI' })
                } else {
                    this.showAlert = true
                }
            }
        }
    }
</script>

<style scoped>
.auth{
        position: absolute;
        width: 100%;
        background: url('../assets/agc-back.jpg') no-repeat center center fixed;
        background-size: 100% 100%;
    }
</style>