"use strict";
import { LoadHeader, updateActiveLink } from './header';

// Defining a dictionary for route mapping

type RouteMap = {[key: string] : string};

export class Router {

    private routes: RouteMap;

    constructor(routes : RouteMap) {
        this.routes = routes;
        this.init();
    }

    init() {

        window.addEventListener("DOMContentLoader", () => {
            const path = location.hash.slice(1) || "/";
            console.log(`[INFO] Initial Page Load: ${path}`);
            this.loadRoute(path);
        })
        // popstate fires when user clicks forward or backwards page button
        window.addEventListener('popstate', () => {
            this.loadRoute(location.hash.slice(1));
        });
    }

    navigate(path : string) : void {
        location.hash = path;
    }

    loadRoute(path : string) : void {
        // get base path
        const basePath = path.split('#')[0];

        if (!this.routes[basePath]) {
            console.warn('[WARNING] Route not found');
            location.hash = '/404';
            path = '/404';
            return;
        }

        fetch(this.routes[basePath])
            .then(response => {
                if (!response.ok) throw new Error(`Unable to load route: ${this.routes[basePath]}`);
                return response.text();
            })
            .then(html => {
                const mainElement = document.querySelector('main');

                if(mainElement){
                    mainElement.innerHTML = html;
                }else{
                    console.error("[ERROR <main> element not found in DOM");
                }
                // ensures header is reloaded every page change
                LoadHeader().then(() => {
                    document.dispatchEvent(new CustomEvent('routeLoaded', { detail: basePath }));
                });
            })
            .catch(error => console.error("[ERROR] error loading page: ", error));

    }
}