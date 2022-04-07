const BaseURL = 'https://viacep.com.br/ws/';

const api = {
    getCep: async (cep) => {
        let response = await fetch(BaseURL + cep + '/json');
        let json = response.json();
        return json;
    }
};

document.querySelector('.menu-hamb-area').addEventListener('click', () => {
    document.querySelector('.menu-modal').classList.toggle('active');
    document.querySelector('.nav-menu').classList.toggle('active');
    document.querySelector('.menu-hamb-area').classList.toggle('active');
    document.querySelector('.menu-hamb').classList.toggle('active');
});

document.querySelectorAll('.service div').forEach((item) => {
    item.addEventListener('click', (ev) => {
        if (document.querySelector('.service div.active')) {
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

document.querySelectorAll('video').forEach((item) => {
    item.addEventListener('click', (ev) => {
        ev.target.play()
        ev.target.controls = true;
    })
})

let translateCount = 0;
let slideCount = 0;
const writeCarousel = () => {
    let span = '<span data-slide="0" class="active"></span>'
    for (let i = 1; i < slideCount; i++) {
        span += `<span data-slide='${i}'></span>`;
    }
    document.querySelector('.carousel-count').innerHTML = span
}

const setCurrentSlide = () => {
    document.querySelector('.carousel-count span.active').classList.remove('active')
    document.querySelector(`[data-slide='${translateCount}']`).classList.add('active')
}

const carouselItems = document.querySelectorAll('.carousel-item').length
const setTranslateCarousel = (value) => {
    const windowWidth = window.innerWidth;
    translateCount += value
    let translatePercent = 0

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

    if (translateCount < 0) {
        translateCount = slideCount - 1
    } else if (translateCount >= slideCount) {
        translateCount = 0
    }

    // Reescreve a cada clique para caso o usuário redimensione a tela com o sistema aberto
    writeCarousel();
    setCurrentSlide();
    return translateCount * translatePercent
}

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

const formName = document.querySelector('#form-cep');
const formEmail = document.querySelector('#form-cep');
const formTel = document.querySelector('#form-cep');
const formCep = document.querySelector('#form-cep');
const formAddress = document.querySelector('#form-address');
const formNumber = document.querySelector('#form-number');
const formCity = document.querySelector('#form-city');
const formState = document.querySelector('#form-state');

formCep.addEventListener('focusout', async (item) => {
    const cep = item.target.value;
    let regexCep = /[0-9]{8}/;
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
    alert('Dados no console!')
    console.log(personalData)
})

writeCarousel();
setTranslateCarousel(0)
setCurrentSlide()