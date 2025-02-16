// IIFE

"use strict";

(function(){

    function CheckLogin() {
        console.log("Checking user login status...");

        const loginNav = document.getElementById("loginNav");

        if(!loginNav) {
            console.warn("lognav element not found, skipping CheckLogin().");
            return;
        }

        const userSession = sessionStorage.getItem("user");

        if (userSession) {
            loginNav.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
            loginNav.href = "#";

            loginNav.addEventListener("click", (event) => {
                event.preventDefault();
                sessionStorage.removeItem("user");
                location.href = "login.html";
            })
        }

    }

    function updateActiveNewLink() {
        console.log("updateActiveNewLink....");

        const currentPage = document.title.trim();
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach((link) => {
            if(link.textContent === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * dynamically load the
     * @constructor
     */
    async function LoadHeader() {
        console.log("Loading Header...");

        return fetch("header.html")
            .then(response => response.text())
            .then(data => {
                document.querySelector('header').innerHTML = data;
                updateActiveNewLink();
            })
            .catch(error => {console.error("Unable to load header.", error)});
    }

    function DisplayLoginPage () {
        console.log("DisplayLoginPage called...");

        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");

        messageArea.style.display = "none";

        if (!loginButton) {
            console.error("Unable to login buton not found")
            return;
        }

        loginButton.addEventListener("click", async(event) => {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                // the await keyword tell javascript to pause here (thread) until the fetch request completes
                const response = await fetch("data/users.json");

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                const jsonData = await response.json();
                //console.log("fetched json data", jsonData);

                const users = jsonData.users;

                if (!Array.isArray(users)) {
                    throw new Error(`Unable to load users.`);
                }
                let success = false;
                let authenticateUser = null;

                for (const user of users) {
                    if (user.username === username && user.password === password) {
                        success = true;
                        authenticateUser = user;
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticateUser.displayName,
                        EmailAddress: authenticateUser.emailAddress,
                        Username: authenticateUser.username,
                    }));
                    messageArea.classList.remove("alert", "alert-danger");
                    messageArea.style.display = "none";
                    location.href = "contact-list.html";
                } else {
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid user or password, please try again.";
                    messageArea.style.display = "block";

                    document.getElementById("username").focus();
                    document.getElementById("username").select();
                }
            } catch(error) {
                console.error("Login failed.", error);
            }
        });
        cancelButton.addEventListener("click", (event) => {
            document.getElementById("loginForm").reset();
            location.href = "index.html";
        })
    }

    function DisplayRegisterPage () {
        console.log("DisplayRegisterPage called...");
    }

    // redirect the user back to contactlist.html
    function handleCancelClick() {
        location.href = "contact-list.html";
    }

    function handleEditClick (event, contact, page) {
        // prevent default form submission
        event.preventDefault();

        if (!validateForm()) {
            alert("Please enter a valid email address");
            return;
        }

        // retrieve update values from the form fields
        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        contact.fullName = fullName;
        contact.emailAddress = emailAddress;
        contact.contactNumber = contactNumber;


        // save the update contact back to local storage (csv format)
        localStorage.setItem(page, contact.serialize());

        location.href="contact-list.html"
    }

    /**
     * handles the process of adding a new contact
     * @param event - the event object to prevent the default form submission
     */
    function handleAddClick(event) {
        event.preventDefault();

        if (!validateForm()) {
            alert("Form contains errors. Please correct them before submitting");
            return;
        }
        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        // create and save new contact
        AddContact(fullName, contactNumber, emailAddress);

        // redirect to contact list
        location.href = "contact-list.html";

    }

    function addEventListenerOnce(elementId, event, handler) {
        // retrieve tje element from the dom
        const element = document.getElementById(elementId);

        if (element) {
            element.removeEventListener(event, handler);
            element.addEventListener(event, handler);
        } else {
            console.log(`[WARN] Element with id ${elementId} not found!`);
        }
    }

    /**
     * validate the entire form by checking the validity of each input field
     * @returns {boolean} - return true if all field pass validation, false otherwise
     */
    function validateForm() {
        return (
            validateInput("fullName") &&
            validateInput("contactNumber") &&
            validateInput("emailAddress")
        );
    }

    function validateInput(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-Error`);
        const rule = VALIDATION_RULES[fieldId];

        if (!field || !errorElement || !rule) return false;

        if (field.value.trim() === "") {
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }

        if (!rule.regex.test(field.value)) {
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }

        // ✅ Clear error if validation passes
        errorElement.textContent = "";
        errorElement.style.display = "none";
        return true;
    }


    function attachValidationListeners(){
        console.log("[INFO] Attaching validation listeners");

        // iterate over each field defined in VALIDATION_RULES
        Object.keys(VALIDATION_RULES).forEach((fieldId) => {
            const field = document.getElementById(fieldId);
            if(!field){
                console.warn("[WARNING] Field `${fieldId}` Attaching validation listener for field ]");
                return;
            }
            // attach event listener using a centralized v
            addEventListenerOnce(fieldId, "input", () => validateInput(fieldId));
        });
    }

    const VALIDATION_RULES = {
        fullName: {
            regex: /^[A-Za-z\s]+$/,
            errorMessage: "Full Name must contain only letters and spaces."
        },
        contactNumber: {
            regex: /^\d{3}-\d{3}-\d{4}$/,
            errorMessage: "Contact Number must be in format ###-###-####."
        },
        emailAddress: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: "Invalid email address."
        }
    };



    function AddContact(fullName, contactNumber, emailAddress) {
        console.log("[DEBUG] AddContact() triggered..");

        if (!validateForm()) {
            alert("Please enter a valid email address");
            return;
        }
        let contact = new core.User(fullName.value, contactNumber.value, emailAddress.value);
        if (contact.serialize()){
            // the primary key for a contact --> contact_ + date & time
            let key = `contact_${Date.now()}`;
            localStorage.setItem(key, contact.serialize());
        } else {
            console.error(`[ERROR] Add contact serialization failed.`);
        }

        // redirect to contact list page
        location.href = "contact-list.html";
    }

    function DisplayEditPage() {
        console.log("DisplayEditPage() called...");

        const page = location.hash.substring(1);
        const editButton = document.getElementById("editButton");
        const cancelButton = document.getElementById("cancelButton");

        switch(page){
            case "add":
                // add contact
                const heading = document.querySelector("main>h1").textContent = "Add Contact";


                // update browser tip
                document.title = "Add Contact";

                if (editButton) {
                    editButton.innerHTML = `<i class = "fa-solid fa-user-plus fa-sm"></i> Add`;
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-primary");
                }

                addEventListenerOnce(editButton, "click", handleAddClick);
                addEventListenerOnce(cancelButton, "click", handleCancelClick);
                break;

            default: {
                // edit contact
                const contact = new core.Contact();
                const contactDate = localStorage.getItem(page);

                if (contactDate) {
                    contact.deserialize(contactDate);
                }
                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("emailAddress").value = contact.emailAddress;

                const editButton = document.getElementById("editButton");
                const cancelButton = document.getElementById("cancelButton");

                if (editButton) {
                    editButton.addEventListener("click", (event) => {
                        event.preventDefault();

                        contact.fullName = document.getElementById("fullName").value;
                        contact.contactNumber = document.getElementById("contactNumber").value;
                        contact.emailAddress = document.getElementById("emailAddress").value;

                        if (editButton) {
                            editButton.innerHTML = `<i class = "fa-solid fa-user-plus fa-sm"></i> Add`;
                            editButton.classList.remove("btn-primary");
                            editButton.classList.add("btn-primary");
                        }

                        addEventListenerOnce(editButton, "click",
                            (event) => handleEditClick(event, contact, page));
                        addEventListenerOnce(cancelButton, "click", handleCancelClick);

                        localStorage.setItem(page, contact.serialize());
                        location.href = "contact-list.html";


                    })
                }

                if (cancelButton) {
                    cancelButton.addEventListener("click", (event) => {
                        location.href = "contact-list.html";
                    })
                }

                break;
            }
        }
    }

    async function DisplayWeather() {

        const apiKey = "53d687f39f8d2cc056865c32b4f2c032";
        const city = "Manila";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);

            // not 200 OK
            if (!response.ok) {
                throw new Error("Failed to fetch weather data from openWeatherMap");
            }
            const data = await response.json();
            console.log("Weather API Response", data);

            const weatherDataElement = document.getElementById("weather-data");

            weatherDataElement.innerHTML = `<strong>City: </strong> ${data.name} <br>
                                            <strong>Tempature: </strong> ${data.main.temp} <br>
                                            <strong>Weather: </strong> ${data.weather[0].description}`;
        } catch (error) {
            console.error("Error fetching weather data", error);
            document.getElementById("weather-data").textContent = "Unable to fetch weather data";
        }
    }

    function DisplayContactListPage(){
        console.log("Called DisplayContactListPage()");

        if (localStorage.length > 0){
            let contactList = document.getElementById("contactList");
            let data = "";

            let keys = Object.keys(localStorage);
            console.log(keys);

            let index = 1;
            for (const key of keys){

                if (key.startsWith("contact_")) {
                    let contactData = localStorage.getItem(key);

                    try {
                        console.log(contactData);
                        let contact = new Contact();
                        contact.deserialize(contactData); // deserialize contact csv to contact object

                        data += `<tr>
                                 <th scope="row" class="text-center">${index}</th>
                                 <td>${contact.fullName}</td>
                                 <td>${contact.contactNumber}</td>
                                 <td>${contact.emailAddress}</td>
                                 <td class="text-center">
                                    <button value="${key}" class="btn btn-warning btn-sm edit">
                                        <i class="fa-solid fa-pen-to-square"></i> Edit
                                    </button>
                                </td>
                                 <td class="text-center">
                                    <button value="${key}" class="btn btn-warning btn-sm delete">
                                        <i class="fa-solid fa-trash"></i> Delete
                                    </button>
                                 </td>
                                 </tr>`;
                        index++;
                    }catch(error){
                        console.error("Error deserializing contact data");
                    }
                }else{
                    console.warn("Skipping non-contact key")
                }
            }
            contactList.innerHTML = data;
        }


        const addButton = document.getElementById("addButton");
        if (addButton){
            addButton.addEventListener("click", () => {
                location.href = "edit.html#add"
            });
        }

        const deleteButtons = document.querySelectorAll("button.delete");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", function() {
                if (confirm("Delete contact, please confirm.")) {
                    localStorage.removeItem(this.value);
                    location.href = "contact-list.html";
                }
            });
        });

        const editButtons = document.querySelectorAll("button.edit");
        editButtons.forEach((button) => {
            button.addEventListener("click", function() {
                // concatenate the value from the edit line to the edit.html
                location.href = "edit.html#" + this.value;
            });
        })
    }




    function DisplayHomePage(){
        console.log("Calling DisplayHomePage()...");

        let aboutUsBtn = document.getElementById("AboutUsBtn");

        // calling weathermap.org
        DisplayWeather();

        // arrow notation
        aboutUsBtn.addEventListener("click", () => {
            location.href = "about.html";
        });

        // add article with paragraph to the body
        document.insertAdjacentHTML(
            "beforeend",
            `<article class="container">
                    <p id="ArticleParagraph" class="mt-3">This is my article paragraph.</p>
                  </article>`
        );


    }

    function DisplayAboutPage(){
        console.log("Calling DisplayAbout()...");

    }

    function DisplayProductPage(){
        console.log("Calling DisplayProduct()...");
    }

    function DisplayServicesPage(){
        console.log("Calling DisplayServices()...");
    }

    function DisplayContactPage() {
        console.log("Calling DisplayContact()...");

        let sendButton = document.getElementById("sendButton");

        console.log(sendButton);
        let subscribeCheckBox = document.getElementById("subscribeCheckBox");

        sendButton.addEventListener("click", function(event) {
            event.preventDefault();

            // Run validation
            if (!validateForm()) {
                alert("Please fill out the form correctly before submitting.");
                return;
            }

            if (subscribeCheckBox.checked) {
                AddContact(
                    document.getElementById("fullName").value,
                    document.getElementById("contactNumber").value,
                    document.getElementById("emailAddress").value
                );
            }

            alert("Form submitted successfully");
        });

    }


    async function Start()
    {
        console.log("Starting...");
        console.log(`Current document title: ${document.title}`);

        // lead navbar
        await LoadHeader().then( () => {
            CheckLogin();

        });

        switch (document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "Products":
                DisplayProductPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "Contact":
                attachValidationListeners()
                DisplayContactPage();
                break;
            case "Contact List":
                DisplayContactListPage();
                break;
            case "Edit Contact":
                attachValidationListeners()
                DisplayEditPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Register":
                DisplayRegisterPage();
                break;
            default:
                console.error("No matching case for the page title.");
        }
    }
    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded and parsed");
        Start();
    });

})()