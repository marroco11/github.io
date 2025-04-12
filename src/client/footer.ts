"use strict";

export async function LoadFooter() {
    return fetch ("views/components/footer.html")
        .then(response => response.text())
        .then( html => {
         const footerElement = document.querySelector("footer");
         if(footerElement){
             footerElement.innerHTML = html;
         }else{
             console.warn("[Warning] No <footer> element not found in DOM]");
         }

        })
        .catch (error => console.log("[ERROR] Failed to load footer: ", error));
}