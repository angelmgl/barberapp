document.addEventListener('DOMContentLoaded', () => {
    initApp();
})

function initApp() {
    showServices();
}

async function showServices() {
    try {
        const res = await fetch("./servicios.json");
        const data = await res.json();
        
        const { servicios } = data;

        // generate HTML
        servicios.forEach( service => {
            const { id, nombre, precio } = service;

            // DOM scripting
            const $title = document.createElement("P");
            $title.textContent = nombre;
            $title.classList.add("service-name");

            // price
            const $price = document.createElement("P");
            $price.textContent = `Gs ${precio.toLocaleString()}`;
            $price.classList.add("service-price");
            
            // container
            const $container = document.createElement("DIV");
            $container.classList.add("service");
            $container.onclick = selectService; // add an event
            $container.dataset.serviceId = id; // add a data attribute

            // append element
            $container.appendChild($title);
            $container.appendChild($price);
            // append to the page
            document.getElementById("services").appendChild($container);
        });
    } catch(error) {
        console.log(error);
    }
}

function selectService(e) {
    // force the click on the DIV element
    let element = e.target.tagName === 'P'
                ? e.target.parentElement
                : e.target;

    element.classList.toggle("selected");
}