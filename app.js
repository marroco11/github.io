// IIFE

"use strict";

(function(){

    function DisplayHomePage(){
        console.log("Calling DisplayHomePage()...");

        let aboutUsBtn = document.getElementById("AboutUsBtn");
        aboutUsBtn.addEventListener("click", function(){
            location.href = "about.html";
        })

        let mainContent = document.getElementsByTagName("main")[0];

        let mainParagraph = document.createElement("p");
        mainParagraph.setAttribute("id","mainParagraph");
        mainParagraph.setAttribute("class","mt-3");

        mainParagraph.textContent = "This is the main paragraph.";
        mainContent.appendChild(mainParagraph);

        let FirstString = "This is";
        let SecondString = `${FirstString} the main paragraph.`;
        mainParagraph.textContent = SecondString;
        mainContent.appendChild(mainParagraph);

        let DocumentBody = document.body;

        let Article = document.createElement("article");
        let ArticleParagraph = `<p id="ArticleParagraph" class="mt-3">This is the article paragraph.</p>`;

        ArticleParagraph.setAttribute("class","container");
        Article.innerHTML = ArticleParagraph;
        DocumentBody.appendChild(Article);
    }

    function DisplayAboutPage(){
        console.log("Calling DisplayAbout()...");

    }

    function DisplayProductPage(){
        console.log("Calling DisplayProduct()...");
    }

    function DisplayServicesPage(){
        console.log("Calling DisplayServices()...");
    }

    function DisplayContactPage(){
        console.log("Calling DisplayContact()...");
    }

    function Start()
    {
        console.log("Starting...");

        switch (document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "Products":
                DisplayProductPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "Contact":
                DisplayContactPage();
                break;
        }
    }
    window.addEventListener("load", Start);
})();