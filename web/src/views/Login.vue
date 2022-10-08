<template>
    <v-container align-content-center>
        <v-card max-width="400" class="mx-auto">  
            <v-row >
                <v-col>LOGIN</v-col>
            </v-row>
            <v-row >
                <v-col cols="10" class="mx-auto">
                    <v-text-field 
                        label="Имя пользователя"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row >
                <v-col cols="10" class="mx-auto">
                    <v-text-field 
                        label="Пароль"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-btn color="primary">ВОЙТИ</v-btn>
        </v-card>  
    </v-container>
</template>