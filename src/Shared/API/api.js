const BASE_URL = "https://safidentback.onrender.com";

const api = {
    get: async(endpoint) => {
        try{
            const response = await fetch(BASE_URL + endpoint,{
                headers:{},
            });
            const data = await response.json();
            return data;
        }catch(error){
            console.error('error GET', error);
            throw error;
        }
    },

post: async (endpoint, body) => {
    try {
    const response = await fetch(BASE_URL + endpoint, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
} catch (error) {
    console.error("Error en la petición POST:", error);
    throw error;
}
},

put: async (endpoint, body) => {
    try {
    const response = await fetch(BASE_URL + endpoint, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
} catch (error) {
    console.error("Error en la petición POST:", error);
    throw error;
}
},


};



export default api;