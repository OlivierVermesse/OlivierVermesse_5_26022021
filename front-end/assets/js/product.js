//récupération des éléments de l'URL sélectionné
let params = new URL(document.location).searchParams;
let id = params.get("id");

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
      return response.json();
    })
    //gestion de l'erreur de connection à la page
    .catch((error) => {
      let productPage = document.querySelector(".productPage");
      productPage.innerHTML = "un problème de lien avec le serveur a été détecté.<br> Vérifier la connection du serveur local<br>Si le problème persiste, merci de nous contacter par l'intermédiaire du formulaire CONTACT";
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
      let colorChoice = document.getElementById("colorChoice");
      for (let i = 0; i < article.colors.length; i++) {
        let option = document.createElement("option");
        option.innerText = article.colors[i];
        colorChoice.appendChild(option);
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
    if (bearQt.value > 0 && bearQt.value < 100) {
      let productAdded = {
          name: productBlocName.innerHTML,
          price: parseFloat(productBlocPrice.innerHTML),
          quantity: parseFloat(document.querySelector("#bearQt").value),
          _id: id, 
      };

      // ACTION DU BOUTON PANIER
      let arrayProductsInCart = []; 
      
      //on vérifie si dans le LS on a déjà des données avec la clé PRODUCTS et on récup la liste et ajoute les données dans la tableau
      if (localStorage.getItem("products") !== null) {
        arrayProductsInCart = JSON.parse(localStorage.getItem("products"));
      }
      arrayProductsInCart.push(productAdded);
      localStorage.setItem("products", JSON.stringify(arrayProductsInCart));

      // Message d'ajout au panier
      confirmation.style.visibility = "visible"; 
      confirmationText.innerHTML = `Vous avez ajouté ${bearQt.value} ours ${productBlocName.innerHTML} à votre panier !`;
      setTimeout("location.reload(true);", 4000);
    } else {
      //mise en forme texte si quantité n'est pas valable
      confirmation.style.visibility = "visible";
      confirmationText.classList.add("input_error");
      confirmationText.innerText = "Erreur dans la quantité. Merci d'indiquer votre quantité entre 1 et 99.";
      setTimeout("location.reload(true);", 4000);
    }
  });
}

main();

function main() {
  getArticles();
  addToCart();
}