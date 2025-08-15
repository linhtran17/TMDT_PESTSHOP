import axios from 'axios';

const URL_BASE = "http://localhost:8000/api"

const instance = axios.create({})

export default {
    get: function(url, params) {
        return instance.get(URL_BASE + url, params)
    }
    
}

