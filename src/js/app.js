let page = 1; // control the current section 1 Servicios-2 Datos-3 Resumen
let total = 0; // total to pay

// data of the client
const cita = {
    name: "",
    date: "",
    time: "",
    tel: "",
    services: [],
};

document.addEventListener("DOMContentLoaded", () => {
    initApp(); // generate service cards in services section

    showSection(); // show initial section -1 Servicios

    changeSection(); // change between tabs and sections

    // navigate between prev and next section
    nextPage();
    prevPage();

    pagination(); // check the current page to display buttons
    disabledPastDates(); // disable past dates in date input

    // show the session's resumen without any data
    showResumen();

    getName(); // get the name input value in the form
    getDate(); // get the date input value in the form
    getTime(); // get the time input value in the form
    getTel(); // get the date input value in the form
});

function initApp() {
    showServices();
}

function showSection() {
    // hide other sections
    const $prevSection = document.querySelector(".visible");
    if ($prevSection) $prevSection.classList.remove("visible");

    // select the current section and make it visible
    const currentSection = document.getElementById(`step-${page}`);
    currentSection.classList.add("visible");

    const tab = document.querySelector(`[data-step="${page}"]`); // select current tab

    const prevTab = document.querySelector(".current"); // select previous tab
    if (prevTab) prevTab.classList.remove("current"); // remove its class "current" 
    tab.classList.add("current"); // add class to the current tab
}

function changeSection() {
    // select a nodelist of tabs
    const $links = document.querySelectorAll(".tabs > button");

    $links.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            // change the current page from the data set
            page = parseInt(e.target.dataset.step);

            showSection(); // show the current section
            pagination(); // check the display of the buttons
        });
    });
}

async function showServices() {
    // fetch the data of the API
    try {
        const res = await fetch("./servicios.json");
        const data = await res.json();

        const { servicios } = data;

        // generate HTML for every service
        servicios.forEach((service) => {
            const { id, nombre, precio } = service;

            // DOM scripting
            const $title = document.createElement("P");
            $title.textContent = nombre; // title of the service
            $title.classList.add("service-name");

            // price
            const $price = document.createElement("P");
            $price.textContent = `Gs ${precio.toLocaleString("es-ES")}`;
            $price.classList.add("service-price");

            // create a container for the service
            const $container = document.createElement("DIV");
            $container.classList.add("service");
            $container.onclick = selectService; // add an event
            $container.dataset.serviceId = id; // add a data attribute for id

            // append elements to the container
            $container.appendChild($title);
            $container.appendChild($price);
            // append to the page
            document.getElementById("services").appendChild($container);
        });
    } catch (error) {
        console.log(error);
    }
}

function selectService(e) {
    // force the click on the DIV element
    let element = e.target.tagName === "P" ? e.target.parentElement : e.target;

    if (element.classList.contains("selected")) {
        element.classList.remove("selected");
        const id = parseInt(element.dataset.serviceId);

        removeService(id); // remove from the services array
    } else {
        element.classList.add("selected");

        // create object for the "cita"
        const serviceObj = {
            id: parseInt(element.dataset.serviceId),
            name: element.firstElementChild.textContent,
            price: element.lastElementChild.textContent,
        };

        addService(serviceObj); // add to the services array
    }
}

function removeService(id) {
    const { services } = cita;
    // get an array filtered by id 
    cita.services = services.filter((service) => service.id !== id);

    //console.log(cita.services);
}

function addService(service) {
    const { services } = cita;

    cita.services = [...services, service]; // same as A.push()
    //console.log(cita.services);
}

function nextPage() {
    // button to navigate to the next section
    const $nextBtn = document.getElementById("next");

    $nextBtn.addEventListener("click", () => {
        page++; // current page incremented 
        //console.log(page);
        pagination(); // check the buttons
    });
}

function prevPage() {
    const $prevBtn = document.getElementById("prev");

    $prevBtn.addEventListener("click", () => {
        page--; // current page decressed
        //console.log(page);
        pagination(); // check the buttons again
    });
}

function pagination() {
    const $nextBtn = document.getElementById("next");
    const $prevBtn = document.getElementById("prev");

    if (page === 1) {
        // only shows the next button
        $prevBtn.classList.add("hide");
        $nextBtn.classList.remove("hide");
    } else if (page === 3) {
        // only shows prev button
        $prevBtn.classList.remove("hide");
        $nextBtn.classList.add("hide");
        showResumen(); // load the resumen
    } else {
        // page 2 shows both buttons
        $prevBtn.classList.remove("hide");
        $nextBtn.classList.remove("hide");
    }

    showSection(); // refresh the view based on the page variable
}

function showResumen() {
    // destructuring state "cita"
    const { name, date, time, tel, services } = cita;

    const $resumen = document.getElementById("step-3");
    // clear the previous alert if it exists
    while ($resumen.firstChild) {
        $resumen.removeChild($resumen.firstChild);
    }

    // validate the object fully completed
    if (Object.values(cita).includes("")) {
        // create an alert
        const $noServices = document.createElement("P");
        $noServices.textContent =
            "Faltan datos de servicios, hora, fecha o su nombre";
        $noServices.classList.add("invalid");

        // add it to the DOM
        $resumen.appendChild($noServices);
        //console.log(cita);
        return;
    }

    // create a title for the section resumen
    const $sectionTitle = document.createElement("H2");
    $sectionTitle.textContent = "Resumen de Cita";

    // show the resumen
    const $name = document.createElement("P"); // service's name
    $name.innerHTML = `<span class="bold">Nombre:</span> ${name}`;

    const $date = document.createElement("P"); // service's date
    $date.innerHTML = `<span class="bold">Fecha:</span> ${date}`;

    const $time = document.createElement("P"); // service's time
    $time.innerHTML = `<span class="bold">Hora:</span> ${time}`;

    const $tel = document.createElement("P"); // service's telephone
    $tel.innerHTML = `<span class="bold">Tu teléfono:</span> ${tel}`;

    const $heading = document.createElement("H3"); // service's resumen
    $heading.textContent = "Resumen de servicios";

    // create a container for every service
    const $servicesResumen = document.createElement("DIV");
    $servicesResumen.classList.add("resumen-services");

    $servicesResumen.appendChild($heading); // add the title

    // show every service details
    services.forEach((service) => {
        const { name, price } = service; // client services

        const $serviceContainer = document.createElement("DIV");
        $serviceContainer.classList.add("service-container");

        const $serviceTitle = document.createElement("P");
        $serviceTitle.textContent = name; // service's name

        const $servicePrice = document.createElement("P");
        $servicePrice.textContent = price; // service's price
        $servicePrice.classList.add("service-price");

        // remove the "Gs" and the point from the price
        const totalPrice = parseInt(price.split(" ")[1].replace(".", ""));
        //console.log(totalPrice);

        total += totalPrice; // increment the global variable "total"

        // append content to the service container
        $serviceContainer.appendChild($serviceTitle);
        $serviceContainer.appendChild($servicePrice);
        $servicesResumen.appendChild($serviceContainer);
    });

    // this is the existing DOM element to append
    const $container = document.getElementById("step-3");

    // append all of the details to the DOM
    $container.appendChild($sectionTitle);
    $container.appendChild($name);
    $container.appendChild($date);
    $container.appendChild($time);
    $container.appendChild($tel);
    $container.appendChild($servicesResumen);

    const $total = document.createElement("P");
    $total.classList.add("total");
    $total.innerHTML = `<span class="bold">Total a pagar:</span> Gs ${total.toLocaleString(
        "es-ES"
    )}`;

    $container.appendChild($total); // show the total ammount
}

function getName() {
    // get the client's name to the "cita" object
    const $nameInput = document.getElementById("name");

    $nameInput.addEventListener("input", (e) => {
        const data = e.target.value.trim();

        // validation
        if (data.length < 5) {
            showAlert("Nombre no válido.", "error");
        } else {
            const $alert = document.querySelector(".alert");
            if ($alert) $alert.remove(); // if exists a previous alert, remove it
            cita.name = data;
        }
    });
}

function showAlert(message, type) {
    // if there is already an alert, then don't create another one
    const prevAlert = document.querySelector(".alert");
    if (prevAlert) return;

    // create an alert
    const $alert = document.createElement("DIV");
    $alert.textContent = message;
    $alert.classList.add("alert");

    if (type === "error") {
        $alert.classList.add("error");
    }

    // append to the DOM
    const $form = document.querySelector(".form");
    $form.appendChild($alert);

    // remove the alert after 3 seconds
    setTimeout(() => $alert.remove(), 3000);
}

function getDate() {
    // get the date from the input to the "cita" object
    const $dateInput = document.getElementById("date");

    $dateInput.addEventListener("input", (e) => {
        // create a Date object based on the input
        const date = new Date(e.target.value).getUTCDay();

        // validate if 0 = sunday, 6 = saturday
        if ([0, 6].includes(date)) {
            e.preventDefault();
            $dateInput.value = "";
            showAlert("Solo atendemos de lunes a viernes.", "error");
        } else {
            cita.date = $dateInput.value;
            //console.log(cita);
        }
    });
}

function disabledPastDates() {
    const $dateInput = document.getElementById("date");

    const now = new Date(); // get the current date
    const year = now.getFullYear();
    const month = // add 0 to the dates if they need
        now.getMonth() < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
    const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();

    // AAAA-MM-DD
    const disabledDate = `${year}-${month}-${day}`;
    $dateInput.min = disabledDate; //set up the min attribute
}

function getTel() {
    // get the telephon number from the tel input
    const $telInput = document.getElementById("tel");
    const regexp = /^[0-9]*$/; // only numbers

    $telInput.addEventListener("change", (e) => {
        // tel number needs 10 characters and it must be numbers
        if (e.target.value.length === 10 && regexp.test(e.target.value)) {
            cita.tel = e.target.value;
        } else {
            showAlert("Pon un número válido (ej: 0981123456)", "error");
            cita.tel = "";
            $telInput.value = "";
        }
    });
}

function getTime() {
    // get the time from the time input
    $timeInput = document.getElementById("time");

    $timeInput.addEventListener("change", (e) => {
        const time = e.target.value.split(":")[0];
        // validate the time 8-21 hs
        if (parseInt(time) < 8 || parseInt(time) > 20) {
            showAlert("Solo atendemos de 08:00 a 21:00 hs", "error");
            cita.time = "";
            $timeInput.value = "";
            return;
        }

        cita.time = $timeInput.value;
    });
}
