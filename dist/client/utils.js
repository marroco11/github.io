import { Contact } from "./contact";
import { createContact, updateContact } from "./api/contacts/index.js";
const VALIDATION_RULES = {
    fullName: {
        regex: /^[A-Za-z\s]+$/,
        errorMessage: "Full Name must contain only letters and spaces."
    },
    contactNumber: {
        regex: /^\d{3}-\d{3}-\d{4}$/,
        errorMessage: "Contact Number must be number format ###-###-###."
    },
    emailAddress: {
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        errorMessage: "Invalid email address."
    }
};
export function validateInput(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-Error`);
    const rule = VALIDATION_RULES[fieldId];
    if (!field || !errorElement || !rule) {
        console.log(`[WARN] Validation rule not found for ${fieldId}`);
        return false;
    }
    if (field.value.trim() === "") {
        errorElement.textContent = rule.errorMessage;
        errorElement.style.display = "block";
        return false;
    }
    // check if the input fails to match the regex pattern
    if (!rule.regex.test(field.value)) {
        errorElement.textContent = rule.errorMessage;
        errorElement.style.display = "block";
        return false;
    }
    // clear the error message if validation passes
    errorElement.textContent = "";
    errorElement.style.display = "none";
    return true;
}
export function validateForm() {
    return (validateInput("fullName") &&
        validateInput("contactNumber") &&
        validateInput("emailAddress"));
}
export function addEventListenerOnce(elementId, event, handler) {
    const element = document.getElementById(elementId);
    if (element) {
        element.removeEventListener(event, handler);
        element.addEventListener(event, handler);
    }
    else {
        console.log(`[WARN] Element with id ${elementId} not found!`);
    }
}
export function attachValidationListeners() {
    console.log("[INFO] Attaching validation listeners");
    Object.keys(VALIDATION_RULES).forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (!field) {
            console.warn(`[WARNING] Field ${fieldId} not found. Attaching validation listener for field`);
            return;
        }
        addEventListenerOnce(fieldId, "input", () => validateInput(fieldId));
    });
}
export function DisplayWeather() {
    const apiKey = "e229a6d97d6f2c65b31cc7975b6fdeb3";
    const city = "Istanbul";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => {
        if (!response.ok)
            throw new Error("Failed to fetch weather data");
        return response.json();
    })
        .then((data) => {
        const weatherElement = document.getElementById("weather-data");
        if (weatherElement) {
            weatherElement.innerHTML =
                `<strong>City: </strong> ${data.name} <br>
                     <strong>Tempature: </strong> ${data.main.temp} <br>
                     <strong>Weather: </strong> ${data.weather[0].description}`;
        }
        else {
            console.warn("[WARN] Element with ID 'weather-data' is not found");
        }
    })
        .catch(error => {
        console.error("[ERROR] Failed to attempt fetching the data:", error);
        const weatherElement = document.getElementById("weather-data");
        if (weatherElement) {
            weatherElement.textContent = "Unable to fetch weather data";
        }
    });
}
export async function AddContact(fullName, contactNumber, emailAddress, router) {
    console.log("[DEBUG] AddContact() triggered..");
    if (!validateForm()) {
        alert("Please enter a valid email address");
        return;
    }
    try {
        const newContact = { fullName, contactNumber, emailAddress };
        await createContact(newContact);
        router.navigate("contact-list");
    }
    catch (error) {
        console.log(`[ERROR] Failed to add Contact: ${error}`);
    }
}
export function saveToStorage(key, value) {
    try {
        let storageValue;
        // if it is a contact, use CSV format
        if (key.startsWith("contact_") && value instanceof Contact) {
            const serialized = value.serialize();
            if (!serialized) {
                console.error(`[ERROR] Failed to serialize contact for key: ${key}`);
                return;
            }
            storageValue = serialized;
        }
        else {
            // otherwise store as json
            storageValue = JSON.stringify(value);
        }
        localStorage.setItem(key, storageValue);
        console.log(`[INFO] Data saved to storage: ${key}`);
    }
    catch (error) {
        console.error(`[ERROR] Saving storage key: ${key}`, error);
    }
}
export function handleCancelClick(router) {
    router.navigate("contact-list");
}
export async function handleEditClick(event, contactId, router) {
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
    try {
        await updateContact(contactId, { fullName, contactNumber, emailAddress });
        router.navigate("contact-list");
    }
    catch (error) {
        console.error(`[ERROR] Failed to update contact: ${error}`);
    }
}
export function getFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        if (!data) {
            return null; // if no data found return null
        }
        // Detect if key belongs to a contact
        if (key.startsWith("contact_")) {
            const contact = new Contact();
            contact.deserialize(data); // Deserialize contact
            return contact; // Cast Contact to generic T
        }
        return JSON.parse(data);
    }
    catch (error) {
        console.error(`[ERROR] Failed to retrieve from data from storage: ${key}`);
        return null; // return null instead of crashing
    }
}
export function removeFromStorage(key) {
    try {
        if (localStorage.getItem(key) !== null) {
            localStorage.removeItem(key);
            console.log(`[INFO] Successfully remove data from storage: ${key}`);
        }
        else {
            console.error(`[WARNING] Key '${key}' not found in storage`);
        }
    }
    catch (error) {
        console.error(`[ERROR] Failed to retrieve from storage: ${key}`);
    }
}
//# sourceMappingURL=utils.js.map