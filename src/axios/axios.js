import axios from "axios";

const api = axios.create({
    baseURL: "http://10.89.240.89:5000/projeto_senai/",
    headers:{
        'accept':'application/json'
    }
});

const sheets = {
    postLogin:(usuario)=>api.post("login/", usuario),
    postUser:(usuario)=>api.post("usuario", usuario),
    getSalas: (sala) => api.get("salas", sala),
    createReserva: (reserva) => api.post("/reserva", reserva),
}

export default sheets;