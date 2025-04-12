"use strict";
import { loadHeaderBar } from './header';
export class Router {
    constructor(routes) {
        this.routes = routes;
        this.init();
    }
    init() {
        window.addEventListener("DOMContentLoader", () => {
            const path = location.hash.slice(1) || "/";
            console.log(`[INFO] Initial Page Load: ${path}`);
            this.loadRoute(path);
        });
        // popstate fires when user clicks forward or backwards page button
        window.addEventListener('popstate', () => {
            this.loadRoute(location.hash.slice(1));
        });
    }
    navigate(path) {
        location.hash = path;
    }
    loadRoute(path) {
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
            if (!response.ok)
                throw new Error(`Unable to load route: ${this.routes[basePath]}`);
            return response.text();
        })
            .then(html => {
            const mainElement = document.querySelector('main');
            if (mainElement) {
                mainElement.innerHTML = html;
            }
            else {
                console.error("[ERROR <main> element not found in DOM");
            }
            // ensures header is reloaded every page change
            loadHeaderBar().then(() => {
                document.dispatchEvent(new CustomEvent('routeLoaded', { detail: basePath }));
            });
        })
            .catch(error => console.error("[ERROR] error loading page: ", error));
    }
}
//# sourceMappingURL=router.js.map