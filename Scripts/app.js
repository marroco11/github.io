"use strict";

//IIFE - Immediately Invoked Function Expression

(function() {


    function DisplayHomePage() {
            console.log("calling DisplayHomePage()...");

            let aboutUsBtn = document.getElementById("AboutUsBtn");
            aboutUsBtn.addEventListener("click", function() {
                location.href = "about.html";
            })

            let MainContent = document.getElementsByTagName("main")[0];

            let MainParagraph = document.createElement("p");
            MainParagraph.setAttribute("id", "mainParagraph");
            MainParagraph.setAttribute("class", "mt-3");

            MainParagraph.textContent = "This is the main paragraph";
            MainContent.appendChild(MainParagraph);

            let FirstString = "This is";
            let SecondString = `${FirstString} the Main Paragraph`;
            MainParagraph.textContent = SecondString;
            MainContent.appendChild(MainParagraph);

            let DocumentBody = document.body;
            let Article = document.createElement("article");
            let ArticleParagraph = `<p id ="ArticleParagraph" class= "mt-3">This is my article paragraph</p>`;

            Article.innerHTML = ArticleParagraph;
            ArticleParagraph.setAttribute("class", "container");

            DocumentBody.appendChild(Article);
    }

   function DisplayAboutPage() {
        console.log("calling DisplayAboutPage()...");
   }

   function DisplayProductsPage () {
        console.log("calling DisplayProductsPage()...");
   }

   function DisplayServicesPage(){
        console.log("calling DisplayServicesPage()...");
   }

   function DisplayContactsPage(){
        console.log("calling DisplayServicesPage()...");
    }

    function Start() {
        console.log("Starting...");

        switch(document.title){
                case "Home":

                DisplayHomePage();

                    break;

                case "About":
                    DisplayAboutPage();

                    break;

                case "Products":

                    DisplayProductsPage();

                    break;

                case "Services":

                    DisplayServicesPage();
                    break;

                case "Contacts":

                    DisplayContactsPage();

                    break;

        }

    }
    window.addEventListener("Load",Start);
})()