//récupération des éléments de l'URL sélectionné
let params = new URL(document.location).searchParams;
let id = params.get("id"); //récupération uniquement de l'ID

function checkIf404() {
  window.addEventListener("error", (e) => {
      let container = document.querySelector(".productPage");
      container.innerHTML = `<p style="color: black"> Cette page n'existe pas. <a style="color: black" class="back-to-home" href="../index.html" >Retourner dans la boutique ?</a></p>`;
      container.style.padding = "500px 0";
      container.style.fontSize = "26px";
      let backToHomeLink = document.querySelector(".back-to-home");
      backToHomeLink.style.textDecoration = "underline";
    },
    false
  );
}

//récupération des class de l'HTML pour les mettre dans une variable
const productBlocImg = document.querySelector(".img");
const productBlocName = document.querySelector(".productBloc__infos__title");
const productBlocDescription = document.querySelector(".productBloc__infos__description");
const productBlocPrice = document.querySelector(".productBloc__infos__price");
const bearQt = document.querySelector("#bearQt");
const colorChoice = document.querySelector("#colorChoice");

//fonction d'affichage des données de l'article sélectionné
function getArticles() {
  // On récupère le produit sélection via l'ID
  fetch(`http://localhost:3000/api/teddies/${id}`)
    .then(function (response) {
      return response.json(); //on le met au format JSON
    })
    //gestion de l'erreur de connection à la page
    .catch((error) => {
      let productPage = document.querySelector(".productPage");
      productPage.innerHTML = "un problème de lien avec le serveur a été détecté.<br> Vérifier la connection du serveur local<br>Si le problème persiste, merci de nous contacter par l'intermédiaire du formulaire CONTACT";
      productPage.style.textAlign = "center";
      productPage.style.padding = "50px 0";
    })
    //si on a une réponse > récupération des infos est placement dans les variables des CLASS
    .then(function (resultatAPI) {
      article = resultatAPI;
      productBlocName.innerHTML = article.name;
      productBlocImg.src = article.imageUrl;
      productBlocDescription.innerText = article.description;

      // Formatage du prix pour l'afficher en euros
      article.price = article.price / 100;
      productBlocPrice.innerText = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(article.price);

      // Gestion de la liste des couleurs
      let colorChoice = document.getElementById("colorChoice"); //récupération de l'ID du DOM et intégration dans variable
      for (let i = 0; i < article.colors.length; i++) { //récupération de l'ensemlbe des couleurs de l'API pour cet ID
        let option = document.createElement("option"); //création d'un élément couleur et intégration dans un variable
        option.innerText = article.colors[i]; //intégration de chaque couleur dans l'élèment
        colorChoice.appendChild(option); //rattachement de la liste des couleurs à la variable colorChoice pour affichage dans DOM
      }
    });
}
    //création de la fonction d'ajout au panier
    function addToCart() {
    //récup de la CLASS et intégration dans variable
    const addToCartBtn = document.querySelector(".add-to-cart"); 
    const confirmation = document.querySelector(".added-to-cart-confirmation");
    const confirmationText = document.querySelector(".confirmation-text");
    
    addToCartBtn.addEventListener("click", () => {
        if (bearQt.value > 0 && bearQt.value < 100) { //réalisation de la fonction si sup à 0 ET inf à 100
        let productAdded = { //création de la variable qui récupérera les données ajoutées
            name: productBlocName.innerHTML, //récup du nom
            price: parseFloat(productBlocPrice.innerHTML),//récup du prix
            quantity: parseFloat(document.querySelector("#bearQt").value), //récup de la quantité
            _id: id, //récup de l'ID
        };

      // ACTION DU BOUTON PANIER
        let arrayProductsInCart = []; //création du tableau qui stockera les données ajoutées
      
      //on vérifie si dans le LS on a déjà des données avec la clé PRODUCTS et on récup la liste et ajoute les données dans la tableau
      if (localStorage.getItem("products") !== null) {
        arrayProductsInCart = JSON.parse(localStorage.getItem("products"));
      }
        arrayProductsInCart.push(productAdded); //on ajoute le produit ajouté via le bouton à la liste du tableau
        localStorage.setItem("products", JSON.stringify(arrayProductsInCart)); //on donne la clé PRODUCTS à cette lig
      

      // Message d'ajout au panier
      confirmation.style.visibility = "visible"; //modification de la donnée du CSS afin de faire apparaitre le message
      confirmationText.innerHTML = `Vous avez ajouté ${bearQt.value} ours ${productBlocName.innerHTML} à votre panier !`;
      setTimeout("location.reload(true);", 4000); //ligne de retour en invisible avec le délai
    } else {
      //mise en forme texte si quantité n'est pas valable
      confirmation.style.visibility = "visible";
      confirmationText.style.background = "red";
      confirmationText.style.border = "red";
      confirmationText.style.color = "white";
      confirmationText.innerText = "Erreur dans la quantité. Merci d'indiquer votre quantité entre 1 et 99.";
    }
  });
}

main();

function main() {
  checkIf404();
  getArticles();
  addToCart();

}