import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
    baseURL: "http://10.89.240.84:3000/projeto_senai/",
    headers:{
        'accept':'application/json'
    }
});

api.interceptors.request.use(
    async(config)=>{
        const token = await SecureStore.getItemAsync("token");
        if(token){
            config.headers.Authorization = `${token}`;
        }
        return config;
    },(error) => Promise.reject(error)
)

const sheets = {
    postLogin:(usuario)=>api.post("login/", usuario),
    postUser:(usuario)=>api.post("usuario", usuario),
    getSalas: (sala) => api.get("salas", sala),
    createReserva: (reserva) => api.post("/reserva", reserva),
    getAllReservasPorSala: (id_sala) => api.get(`/reservas/${id_sala}`),
    getReservaPorUsuario: (id_usuario) => api.get (`reserva/${id_usuario}`)
}

export default sheets;