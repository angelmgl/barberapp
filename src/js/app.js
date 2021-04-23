let page = 1;

document.addEventListener('DOMContentLoaded', () => {
    initApp(); // generate service cards in services section
    
    showSection(); // show initial section
    
    changeSection(); // change between tabs and sections
    
    // navigate between prev and next
    nextPage(); 
    prevPage();

    pagination() // check the current page to display buttons
})

function initApp() {
    showServices();
}

function showSection() {
    // hide other sections
    const $prevSection = document.querySelector(".visible");
    if($prevSection) $prevSection.classList.remove("visible");

    const currentSection = document.getElementById(`step-${page}`);
    currentSection.classList.add("visible");

    // highlight current tab
    const tab = document.querySelector(`[data-step="${page}"]`);

    // delete current class on the previous tab
    const prevTab = document.querySelector(".current");
    if(prevTab) prevTab.classList.remove("current");
    tab.classList.add("current");
}

function changeSection() {
    const $links = document.querySelectorAll(".tabs > button");

    $links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            page = parseInt(e.target.dataset.step);

            showSection(); 
            pagination();
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

function nextPage() {
    const $nextBtn = document.getElementById("next");
    $nextBtn.addEventListener('click', () => {
        page++;
        console.log(page);
        pagination();
    });
}

function prevPage() {
    const $prevBtn = document.getElementById("prev");
    $prevBtn.addEventListener('click', () => {
        page--;
        console.log(page);
        pagination();
    });
}

function pagination() {
    const $nextBtn = document.getElementById("next");
    const $prevBtn = document.getElementById("prev");

    if(page === 1) {
        $prevBtn.classList.add("hide");
        $nextBtn.classList.remove("hide");
    } else if(page === 3) {
        $prevBtn.classList.remove("hide");
        $nextBtn.classList.add("hide");
    } else {
        $prevBtn.classList.remove("hide");
        $nextBtn.classList.remove("hide");
    }

    showSection();
}