// Dados da api ViaCEP (podem ser trocados por outra API sem afetar o funcionamento do site)
const BaseURL = 'https://viacep.com.br/ws/';
const api = {
    getCep: async (cep) => {
        let response = await fetch(BaseURL + cep + '/json');
        let json = response.json();
        return json;
    }
};

// Menu mobile (visível em telas com menos de 1024px)
document.querySelector('.menu-hamb-area').addEventListener('click', () => {
    document.querySelector('.menu-modal').classList.toggle('active');
    document.querySelector('.nav-menu').classList.toggle('active');
    document.querySelector('.menu-hamb-area').classList.toggle('active');
    document.querySelector('.menu-hamb').classList.toggle('active');
});

// Botão 'VER ARTIGOS"
document.querySelectorAll('.service div').forEach((item) => {
    item.addEventListener('click', (ev) => {
        if (document.querySelector('.service div.active')) {
            // Se o artigo selecionado já estiver ativo, ele será desativado ao clicar novamento no mesmo lugar
            if (document.querySelector('.service div.active') === ev.currentTarget) {
                document.querySelector('.service div.active').classList.remove('active');
            } else {
                document.querySelector('.service div.active').classList.remove('active');
                ev.currentTarget.classList.add('active');
            }
        } else {
            ev.currentTarget.classList.add('active');
        }
    })
})

// Reprodução de vídeo
document.querySelectorAll('video').forEach((item) => {
    item.addEventListener('click', (ev) => {
        ev.target.play()
        ev.target.controls = true;
    })
})

// Inicialização do carousel
let translateCount = 0;
let slideCount = 0;

// Contagem de slides
const writeCarousel = () => {
    let span = '<span data-slide="0" class="active"></span>'
    for (let i = 1; i < slideCount; i++) {
        span += `<span data-slide='${i}'></span>`;
    }
    document.querySelector('.carousel-count').innerHTML = span
}

// Verificação do slide atual
const setCurrentSlide = () => {
    document.querySelector('.carousel-count span.active').classList.remove('active')
    document.querySelector(`[data-slide='${translateCount}']`).classList.add('active')
}

// Divisão de vídeos em slides baseado no tamanho da tela (responsividade do carousel)
const carouselItems = document.querySelectorAll('.carousel-item').length
const setTranslateCarousel = (value) => {
    const windowWidth = window.innerWidth;
    let translatePercent = 0
    translateCount += value

    // Impede o carousel de bugar quando os slides não são completos (3 espaços e 2 vídeos = 0.66)
    translateCount < 0 ? translateCount = Math.ceil(slideCount - 1) : false

    if (windowWidth > 768) {
        slideCount = carouselItems / 3;
        translatePercent = 300;
    } else if (windowWidth <= 768 && windowWidth > 425) {
        slideCount = carouselItems / 2;
        translatePercent = 200;
    } else {
        slideCount = carouselItems;
        translatePercent = 100;
    }

    // Checagem de reinício de carousel
    if (translateCount < 0) {
        translateCount = slideCount - 1
    } else if (translateCount >= slideCount) {
        translateCount = 0
    }

    // Reescreve a cada clique caso o usuário redimensione a tela com o sistema aberto
    writeCarousel();
    setCurrentSlide();
    return translateCount * translatePercent
}

// Botões do carousel
document.querySelector('#carousel-prev').addEventListener('click', () => {
    const translateValue = setTranslateCarousel(-1)
    document.querySelectorAll('.carousel-item').forEach((item) => {
        item.style.transform = `translateX(-${translateValue}%)`
    })
})
document.querySelector('#carousel-next').addEventListener('click', () => {
    const translateValue = setTranslateCarousel(+1)
    document.querySelectorAll('.carousel-item').forEach((item) => {
        item.style.transform = `translateX(-${translateValue}%)`
    })
})

// Formulário
const formName = document.querySelector('#form-cep');
const formEmail = document.querySelector('#form-cep');
const formTel = document.querySelector('#form-cep');
const formCep = document.querySelector('#form-cep');
const formAddress = document.querySelector('#form-address');
const formNumber = document.querySelector('#form-number');
const formCity = document.querySelector('#form-city');
const formState = document.querySelector('#form-state');

// Executa a API ao tirar o foco do campo CEP (evita requisições desnecessárias à API)
formCep.addEventListener('focusout', async (item) => {
    const cep = item.target.value;
    let regexCep = /[0-9]{8}/;
    // Evita requisição com CEPS que contém letras
    if (regexCep.test(cep)) {
        const cepInfo = await api.getCep(cep);
        if (!cepInfo.erro) {
            formAddress.value = cepInfo.bairro + ', ' + cepInfo.logradouro;
            formCity.value = cepInfo.localidade;
            formState.value = cepInfo.uf;
        } else {
            alert('Cep Inválido!');
            formCep.value = '';
        }
    } else {
        alert('Cep Inválido!');
        formCep.value = '';
    }
})

// Separa os dados do formulário em uma variável para um possível POST
document.querySelector('#user-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const personalData = {
        name: formName.value,
        email: formEmail.value,
        tel: formTel.value,
        cep: formCep.value,
        address: formAddress.value,
        number: formNumber.value,
        city: formCity.value,
        state: formState.value
    };
    console.log(personalData)
})

// Inicialização de funções fundamentais
writeCarousel();
setTranslateCarousel(0)
setCurrentSlide()