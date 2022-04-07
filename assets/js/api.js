const BaseURL = 'https://viacep.com.br/ws/'

const api = {
    getCep: async (cep) => {
        let response = await fetch(BaseURL + cep + '/json');
        return response
    }
}