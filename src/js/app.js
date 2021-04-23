let page = 1;

document.addEventListener('DOMContentLoaded', () => {
    initApp();

    showSection();

    changeSection();
})

function initApp() {
    showServices();
}

function showSection() {
    const currentSection = document.getElementById(`step-${page}`);
    currentSection.classList.add("visible");

    // highlight current tab
    const tab = document.querySelector(`[data-step="${page}"]`);
    tab.classList.add("current");
}

function changeSection() {
    const $links = document.querySelectorAll(".tabs > button");

    $links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            page = parseInt(e.target.dataset.step);

            // hide other sections
            document.querySelector(".visible").classList.remove("visible");

            const $section = document.getElementById(`step-${page}`);
            $section.classList.add("visible");

            // delete current class on the previous tab
            document.querySelector(".current").classList.remove("current");
            // add current class on the current tab
            const currentTab = document.querySelector(`[data-step="${page}"]`);
            currentTab.classList.add("current");
        })
    })
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