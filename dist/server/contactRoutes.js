"use strict";
import express from "express";
import Database from "./database.js";
//Express router
const router = express.Router();
/**
 * Handles Get request to retrieve all contacts
 */
router.get('/', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const contacts = await db.collection("contacts").find().toArray();
        res.json(contacts);
    }
    catch (error) {
        console.error("[ERROR] Failed to fetch contacts: ", error);
        res.status(500).json({ message: "Server Connection Error" });
    }
});
/**
 * Handles the GET request to retrieve a single contact
 */
router.get('/:id', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const contact = await db.collection("contacts").findOne({ id: req.params.id });
        if (contact) {
            res.json(contact);
        }
        else {
            res.status(404).json({ message: "No contacts found" });
        }
    }
    catch (error) {
        console.error("[ERROR] Failed to fetch contacts: ", error);
        res.status(500).json({ message: "Server Connection Error" });
    }
});
/**
 * Add a new contact to our contact.json
 */
router.post('/', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const contacts = await db.collection("contacts").find().toArray();
        const newId = contacts.length > 0 ?
            (Math.max(...contacts.map(c => parseInt(c.id))) + 1).toString() : '1';
        const newContact = { id: newId, ...req.body };
        await db.collection("contacts").insertOne(newContact);
        res.status(201).json(newContact);
    }
    catch (error) {
        console.error("[ERROR] Failed to add contacts: ", error);
        res.status(500).json({ message: "Server Connection Error" });
    }
});
/**
 * PUT handles updating a single contact (FULL UPDATE)
 */
router.put('/:id', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const { ...updateData } = req.body;
        const result = await db.collection("contacts")
            .findOneAndUpdate({ id: req.params.id }, { $set: updateData }, { returnDocument: 'after' });
        if (result && result.value) {
            res.json(result.value);
        }
        else {
            const updatedContact = await db.collection("Contact").findOne({ id: req.params.id });
            if (updatedContact) {
                res.json(updatedContact);
            }
            else {
                res.status(404).json({ message: "No contacts found" });
            }
        }
    }
    catch (error) {
        console.error("[ERROR] Failed to add contacts: ", error);
        res.status(500).json({ message: "Server Connection Error" });
    }
});
/**
 * DELETE handles removing a single contact from contacts.json
 */
router.delete('/:id', async (req, res) => {
    try {
        const db = await Database.getInstance().connect();
        const result = await db.collection("contacts").deleteOne({ id: req.params.id });
        if (result.deletedCount > 0) {
            res.json({ message: "Contact deleted successfully." });
        }
        else {
            res.status(404).json({ message: "No contacts found" });
        }
    }
    catch (error) {
        console.error("[ERROR] Failed to fetch contacts: ", error);
        res.status(500).json({ message: "Server Connection Error" });
    }
});
export default router;
//# sourceMappingURL=contactRoutes.js.map