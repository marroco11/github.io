// IIFE
"use strict";
import { LoadHeader } from "./header";
import { LoadFooter } from "./footer";
import { Router } from "./router";
import { AuthGuard } from "./authguard";
import { AddContact, addEventListenerOnce, attachValidationListeners, DisplayWeather, handleEditClick, validateForm } from "./utils";
import { deleteContact, fetchContact, fetchContacts } from "./api/contacts";
const pageTitles = {
    "/": "views/pages/home.html",
    "/about": "views/pages/about.html",
    "/login": "views/pages/login.html",
    "/register": "views/pages/register.html",
    "/contact": "views/pages/contact.html",
    "/services": "views/pages/services.html",
    "/products": "views/pages/products.html",
    "/contact-list": "views/pages/contact-list.html",
    "/edit": "views/pages/edit.html",
    "/404": "views/pages/404.html"
};
const routes = {
    "/": "views/pages/home.html",
    "/about": "views/pages/about.html",
    "/login": "views/pages/login.html",
    "/register": "views/pages/register.html",
    "/contact": "views/pages/contact.html",
    "/services": "views/pages/services.html",
    "/products": "views/pages/products.html",
    "/contact-list": "views/pages/contact-list.html",
    "/edit": "views/pages/edit.html",
    "/404": "views/pages/404.html"
};
const router = new Router(routes);
(function () {
    function DisplayLoginPage() {
        console.log("DisplayLoginPage called...");
        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");
        const loginForm = document.getElementById("loginForm");
        if (!loginButton) {
            console.error("Login button not found");
            return;
        }
        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            try {
                // the await keyword tell javascript to pause here (thread) until the fetch request completes
                // const response = await fetch("data/users.json");
                const response = await fetch("/users");
                if (!response.ok)
                    throw new Error(`HTTP error: ${response.status}`);
                const jsonData = await response.json();
                const users = jsonData.users;
                let authenticateUser = users.find((user) => user.Username === username && user.Password === password);
                if (authenticateUser) {
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticateUser.displayName,
                        EmailAddress: authenticateUser.emailAddress,
                        Username: authenticateUser.username,
                    }));
                    if (messageArea) {
                        messageArea.classList.remove("alert", "alert-danger");
                        messageArea.style.display = "none";
                    }
                    LoadHeader().then(() => {
                        router.navigate("/contact-list");
                    });
                }
                else {
                    if (messageArea) {
                        messageArea.classList.add("alert", "alert-danger");
                        messageArea.textContent = "Invalid user or password, please try again.";
                        messageArea.style.display = "block";
                    }
                    document.getElementById("username").focus();
                    document.getElementById("username").select();
                }
            }
            catch (error) {
                console.error("[ERROR] Login failed.", error);
            }
        });
        // handle error event
        if (cancelButton && loginForm) {
            cancelButton.addEventListener("click", (event) => {
                loginForm.reset();
                router.navigate("/");
            });
        }
        else {
            console.warn("cancelButton not found.");
        }
    }
    function DisplayRegisterPage() {
        console.log("DisplayRegisterPage called...");
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
        AddContact(fullName, contactNumber, emailAddress, router);
        // redirect to contact list
        router.navigate("contact-list");
    }
    async function DisplayEditPage() {
        console.log("DisplayEditPage() called...");
        // extract contact id from the path
        //const page = location.hash.split("#")[2];
        const hashPaths = location.hash.split("#");
        //http://localhost:3000/#/edit#add
        //hashParts: split(#) -> ["", "edit", "add"]
        const page = hashPaths.length > 2 ? hashPaths[2] : "";
        const editButton = document.getElementById("editButton");
        const pageTitle = document.querySelector("main > h1");
        const cancelButton = document.getElementById("cancelButton");
        if (!pageTitle || !editButton || !cancelButton) {
            console.error("main title not found!");
            return;
        }
        if (page === "add") {
            document.title = "Add Contact";
            pageTitle.textContent = "Add Contact";
            editButton.innerHTML = `<i class = "fa-solid fa-user-plus fa-sm"></i> Add`;
            editButton.classList.remove("btn-primary");
            editButton.classList.add("btn-success");
        }
        else {
            editButton.innerHTML = `<i class = "fa-solid fa-user-plus fa-sm"></i> Edit`;
            editButton.classList.remove("btn-success");
            editButton.classList.add("btn-primary");
            try {
                document.title = "Edit Contact";
                pageTitle.textContent = "Edit Contact";
                const contact = await fetchContact(page);
                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("emailAddress").value = contact.emailAddress;
            }
            catch (error) {
                console.error(`[ERROR] Failed to fetch contact: ${error}`);
                router.navigate("/contact-list");
                return;
            }
            // Attach event listeners for edit and cancel buttons
            addEventListenerOnce("editButton", "click", async (event) => {
                event.preventDefault();
                if (page === "add") {
                    const fullName = document.getElementById("fullName").value.trim();
                    const contactNumber = document.getElementById("contactNumber").value.trim();
                    const emailAddress = document.getElementById("emailAddress").value.trim();
                    await AddContact(fullName, contactNumber, emailAddress, router);
                }
                else {
                    await handleEditClick(event, page, router);
                }
            });
            addEventListenerOnce("cancelButton", "click", (event) => {
                event.preventDefault();
                router.navigate("/contact-list");
            });
            attachValidationListeners();
        }
    }
    async function DisplayContactListPage() {
        console.log("Called DisplayContactListPage()");
        const contactList = document.getElementById("contactList");
        if (!contactList) {
            console.warn("[WARNING] Element with ID 'contactList' not found");
            return;
        }
        try {
            const contacts = await fetchContacts();
            let data = "";
            let index = 1;
            contacts.forEach((contact) => {
                data += `<tr>
                                 <th scope="row" class="text-center">${index}</th>
                                 <td>${contact.fullName}</td>
                                 <td>${contact.contactNumber}</td>
                                 <td>${contact.emailAddress}</td>
                                 <td class="text-center">
                                    <button value="${contact.id}" class="btn btn-warning btn-sm edit">
                                        <i class="fa-solid fa-pen-to-square"></i> Edit
                                    </button>
                                </td>
                                 <td class="text-center">
                                    <button value="${contact.id}" class="btn btn-warning btn-sm delete">
                                        <i class="fa-solid fa-trash"></i> Delete
                                    </button>
                                 </td>
                                 </tr>`;
                index++;
            });
            contactList.innerHTML = data;
            const addButton = document.getElementById("addButton");
            if (addButton) {
                addButton.addEventListener("click", () => {
                    router.navigate("/edit#add");
                });
            }
            document.querySelectorAll("button.delete").forEach((button) => {
                button.addEventListener("click", async function (event) {
                    const targetButton = event.target;
                    const contactId = targetButton.value;
                    if (confirm("Delete contact, please confirm.")) {
                        try {
                            await deleteContact(contactId);
                            await DisplayContactListPage();
                        }
                        catch (error) {
                            console.error(`[ERROR] Failed to delete contact: ${error}`);
                        }
                    }
                });
            });
            document.querySelectorAll("button.edit").forEach((button) => {
                button.addEventListener("click", function (event) {
                    const targetButton = event.target;
                    const contactKey = targetButton.value;
                    router.navigate(`/edit#${contactKey}`);
                });
            });
        }
        catch (error) {
            console.error(`[ERROR] Failed to display contacts: ${error}`);
        }
    }
    function DisplayHomePage() {
        console.log("Calling DisplayHomePage()...");
        const aboutUsBtn = document.getElementById("AboutUsBtn");
        if (aboutUsBtn) {
            aboutUsBtn.addEventListener("click", () => {
                router.navigate("/about");
            });
        }
        DisplayWeather();
    }
    function DisplayAboutPage() {
        console.log("Calling DisplayAbout()...");
    }
    function DisplayProductPage() {
        console.log("Calling DisplayProduct()...");
    }
    function DisplayServicesPage() {
        console.log("Calling DisplayServices()...");
    }
    function DisplayContactPage() {
        console.log("Calling DisplayContact()...");
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckBox = document.getElementById("subscribeCheckBox");
        let contactListButton = document.getElementById("showcontactList");
        if (!sendButton) {
            console.warn("[WARNING] Element with ID 'sendButton' not found");
            return;
        }
        sendButton.addEventListener("click", function (event) {
            event.preventDefault();
            if (!validateForm()) {
                alert("Please fill out the form");
                return;
            }
            if (subscribeCheckBox.checked) {
                const fullName = document.getElementById("fullName").value;
                const contactNumber = document.getElementById("contactNumber").value;
                const emailAddress = document.getElementById("emailAddress").value;
                AddContact(fullName, contactNumber, emailAddress, router);
            }
            alert("Form submitted successfully");
        });
        if (contactListButton) {
            contactListButton.addEventListener("click", function (event) {
                event.preventDefault();
                router.navigate("/contactList");
            });
        }
    }
    document.addEventListener("routerLoaded", (event) => {
        if (!(event instanceof CustomEvent) || typeof event.detail !== "string") {
            console.warn("[WARNING] Element with ID 'customEvent' not found");
            return;
        }
        const newPath = event.detail;
        console.log(`Route Loaded: ${newPath}`);
        LoadHeader().then(() => {
            handlePageLogin(newPath);
        });
    });
    function handlePageLogin(path) {
        document.title = pageTitles[path] || "Untitled Page";
        switch (path) {
            case "/":
            case "/home":
                DisplayHomePage();
                break;
            case "/about":
                DisplayAboutPage();
                break;
            case "/contact":
                DisplayContactPage();
                attachValidationListeners();
                break;
            case "/products":
                DisplayProductPage();
                break;
            case "/contact-list":
                DisplayContactListPage();
                break;
            case "/edit":
                DisplayEditPage();
                attachValidationListeners();
                break;
            case "/services":
                DisplayServicesPage();
                break;
            case "/login":
                DisplayLoginPage();
                break;
            case "/register":
                DisplayRegisterPage();
                break;
            default:
                console.log(`No display logic found for ${path}`);
        }
    }
    async function Start() {
        console.log("Starting...");
        console.log(`Current document title: ${document.title}`);
        // lead navbar
        await LoadHeader();
        await LoadFooter();
        AuthGuard();
        const currentPath = location.hash.slice(1) || "/";
        router.navigate(currentPath);
    }
    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded and parsed");
        Start();
    });
})();
//# sourceMappingURL=app.js.map