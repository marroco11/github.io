"use strict"

//Import necessary modules and types

import express, { Request, Response } from "express";
import path from 'path';
import {fileURLToPath} from 'url';
import contactRoutes from "./contactRoutes.js";

// Convert path to __dirname equivalent

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Initialize Express app

const app = express();
const port = process.env.PORT || 3000; // give me the port that the environment gives me or use port 3000

async function startServer(){
    try {
        app.listen(port, () => {
            console.log(`[INFO] server running on http://localhost: ${port}`);
        });
    } catch(error) {
        console.error("[ERROR] Failed to Start Server");
        process.exit(1);
    }
}



//Middleware to parse incoming json payloads

app.use(express.json());

// server static files (HTML, CSS, JS, etc...) from the project root
app.use(express.static(path.join(__dirname, '../..')));

// Server static assets from node_modules for client-side and rendering
app.use('/node_modules/@fortawesome/fontawesome-free',
    express.static(path.join(__dirname, '../node_modules/fontawesome-free')));

app.use('/node_modules/bootstrap',
    express.static(path.join(__dirname, '../node_modules/bootstrap')));


//count the contact routes within Node
// delegate all /api/contacts/* requests

app.use('/api/contacts', contactRoutes);


const user = [
    {
        DisplayName : "Optimus Prime",
        EmailAddress : "OPrime@dmail.ca",
        UserName : "OPrime11",
        Password : "12345"
    },
    {
        DisplayName : "Fabian Narvaez",
        EmailAddress : "OkeiGuys@dcmail.ca",
        UserName : "OkeiGuyzzz",
        Password : "Swag123"
    },

    {
        DisplayName : "Bumble Bee Boss",
        EmailAddress : "IamBoss@dmail.ca",
        UserName : "bossbee",
        Password : "buzzbuzz"
    }
];

// Routing
// Route to server the home page (index.html)

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../", "index.html"));
});

app.get('/users', (req: Request, res: Response) => {
    res.json({ user });
});

// Start the server
await startServer();