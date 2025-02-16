"use strict";

/**
 * Represents a Contact with a name, number and email address
 */

(function (core) {
    class Contact {

        /**
         * Constructs a new contact instance
         * @param fullName
         * @param contactNumber
         * @param emailAddress
         */

        constructor(fullName = "", contactNumber = "", emailAddress = "") {
            this._fullName = fullName; // _ underscore = private attribute
            this._contactNumber = contactNumber;
            this._emailAddress = emailAddress;
        }

        /**
         * Gets the full name of the contact
         * @returns {string}
         */

        get fullName() {
            return this._fullName;
        }

        /**
         * sets the full name of the contact. validates input to ensure it is a non-empty string
         * @param fullName
         */

        set fullName(fullName) {
            if (typeof fullName !== "string" || fullName.trim() === "") {
                throw new Error("Invalid full name: it must be a string");
            }
            this._fullName = fullName;
        }

        /**
         * Gets the number of the contact
         * @returns {string}
         */

        get contactNumber() {
            return this._contactNumber;
        }

        /**
         * sets the contact number of the contact. validate input to ensure it matches 10 digit format
         * @param contactNumber
         */

        set contactNumber(contactNumber) {
            const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

            if (phoneRegex.test(contactNumber)) {
                throw new Error("Invalid phone number: must be a 10 digit number");
            }
            this._contactNumber = contactNumber;
        }

        /**
         * gets the email address
         * @returns {string}
         */
        get emailAddress() {
            return this._emailAddress;
        }

        /**
         * sets the email address of the contact. validate input to ensure a standard email format
         * @param address
         */
        set emailAddress(address) {
            const emailRegex = /^[^\s@]+@[\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(address)) {
                throw new Error("Invalid email address: must be non-empty string");
            }
            this._emailAddress = address;
        }

        /**
         * convert the contact details into a human-readable string
         * @returns {string}
         */
        toString() {
            return `Full Name: ${this._fullName}\n
                Contact Number: ${this._contactNumber}\n
                Email Address: ${this._emailAddress}`;

        }

        /**
         * serialize the contact details into a string format suitable for storage
         * @returns {string|null}
         */
        serialize() {
            if (!this._fullName || !this._contactNumber || !this._emailAddress) {
                console.error("One or more of the contact properties are missing or invalid");
                return null;
            }

            return `${this._fullName},${this._contactNumber},${this._emailAddress}`;
        }

        /**
         * deserialize a string (comma-delimited) of contact details and update properties
         * @param data
         */
        deserialize(data) {
            if (typeof data !== "string" || data.split(",").length !== 3) {
                console.error("Invalid data format for deserializing data.");
                return;
            }

            const propArray = data.split(",");
            this._fullName = propArray[0];
            this._contactNumber = propArray[1];
            this._emailAddress = propArray[2];
        }
    }
})(core || (core = {}));