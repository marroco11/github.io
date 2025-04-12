"use strict";
export async function LoadHeader() {
    return fetch("./views/components/header.html")
        .then(response => response.text())
        .then(data => {
        const headerElement = document.querySelector('header');
        if (!headerElement) {
            console.error("[ERROR] header element does not exist");
            return;
        }
        headerElement.innerHTML = data;
        updateActiveLink();
        verifyLogin();
    })
        .catch(error => { console.error("Unable to load header.", error); });
}
export function updateActiveLink() {
    const currentPath = location.hash.slice(1);
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach((link) => {
        const linkPath = link.getAttribute('href')?.replace("#", "") || "";
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
        else {
            link.classList.remove('active');
        }
    });
}
function handleLogout(event) {
    event.preventDefault();
    sessionStorage.removeItem("user");
    console.log("User logged out");
    LoadHeader().then(() => {
        location.hash = "/";
    });
}
function verifyLogin() {
    const loginNav = document.getElementById("loginNav");
    if (!loginNav) {
        console.warn("lognav element not found, skipping verifyLogin().");
        return;
    }
    const userSession = sessionStorage.getItem("user");
    if (userSession) {
        loginNav.innerHTML = `<i class="fa-solid fa-sign-out-alt"></i> Logout`;
        loginNav.removeEventListener("click", handleLogout);
        loginNav.addEventListener("click", handleLogout);
    }
    else {
        loginNav.innerHTML = `<i class="fa-solid fa-sign-in-alt"></i> Login`;
        // router.navigate("/login");
        loginNav.removeEventListener("click", handleLogout);
        loginNav.addEventListener("click", () => location.hash = "/login");
    }
}
//# sourceMappingURL=header.js.map