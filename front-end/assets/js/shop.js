let cart = document.querySelector(".shopCart__recap"); //stockage de la CLASS dans une variable
let localStorage2 = JSON.parse(localStorage.getItem("products")); //stockage des données du LS dans une variable
console.log(localStorage2)

//récup des class dans des variables
function displayCart() {
  let test = document.querySelector(".empty-cart");
  let cartCard = document.querySelector(".shopCart");
  let emptyCart = document.querySelector(".if-empty-cart");

  // si on a des données dans localStorage on met la div en colonne.
  if (localStorage.getItem("products")) {
    cartCard.style.display = "flex";
    cartCard.style.flexDirection = "column";
    cartCard.style.justifyContent = "space-around";
    emptyCart.style.display = "none";
  }

  // Pour chaque objet dans le tableau copié du localStorage, on crée les divs de l'affichage du panier et on les remplit avec les données du tableau.
  for (let produit in localStorage2) {
    let productRow = document.createElement("div");
    cart.insertBefore(productRow, test); //création de la DIV avant la class  "empty-cart" (variable TEST)
    productRow.classList.add("shopCart__recap__row", "product-row");

    //création des DIV en prévision de la récup des données du LS
    let productName = document.createElement("div");
    productRow.appendChild(productName);
    productName.classList.add("shopCart__recap__title", "data-title");
    productName.innerHTML = localStorage2[produit].name;

    let productQuantity = document.createElement("div");
    productRow.appendChild(productQuantity);
    productQuantity.classList.add("shopCart__recap__title", "data-quantity");
    productQuantity.innerHTML = localStorage2[produit].quantity;

    let productPrice = document.createElement("div");
    productRow.appendChild(productPrice);
    productPrice.classList.add("shopCart__recap__title", "data-price");

    let priceTotal = parseFloat(localStorage2[produit].price * localStorage2[produit].quantity);
    
    // Affichage du prix avec le formatage € pour les lignes unitaires
    productPrice.innerHTML = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(priceTotal);

    //création d'une 2ème variable productPrice pour résolution du pb quand addition de montant avec séparateur de milliers
    let productPrice2 = document.createElement("div");
    productRow.appendChild(productPrice2);
    productPrice2.classList.add("price2"); //cette CLASS sert pour le TOTAL GENERAL et paramétré en DISPLAY : NONE
    productPrice2.innerHTML = priceTotal;
  }
}
//affichage du montant TOTAL
function countTotalInCart() {
  let arrayPrice = []; //création d'une colonne tableau avec les prix unitaire 
  let totalPrice = document.querySelector(".total"); //récupération de la CLASS TOTAL du HTML

  // On récupére chaque prix pour les mettre dans le tableau
  let allPrice = document.querySelectorAll(".price2"); //la CLASS PRICE permet de les récupérer
  for (let price in allPrice) {
    arrayPrice.push(allPrice[price].innerHTML); //intégration dans le tableau
  }

  // Suppression des lignes UNDEFINED du tableau
  arrayPrice = arrayPrice.filter((e) => {
    return e != undefined;
  });

  // Conversion en nombre des prix en créant un nouveau tableau pour convertir la même donnée dans la même variable
  arrayPrice = arrayPrice.map((x) => parseFloat(x));

  // Addition des prix du tableau ==> permet de ne pas avoir de message d'erreur si LS vide grace a ala valeur initiale à 0
  const reducer = arrayPrice.reduce((acc, value) => acc + value, 0);
  arrayPrice = reducer

  // Affichage du TOTAL avec formatage € dans le HTML
  totalPrice.innerText = `Total : ${(arrayPrice = new Intl.NumberFormat(
    "fr-FR",
    {
      style: "currency",
      currency: "EUR",
    }
  ).format(arrayPrice))}`;
}

 // Vider le panier
function toEmptyShop() {
  const ToEmptyShop = document.querySelector(".to-empty-cart");
  ToEmptyShop.addEventListener("click", () => {
    localStorage.clear();
  });
}

//gestion de l'envoi au back
//récupération des données saisies dans le formulaire
function formInformations() {
  let inputLastName = document.querySelector("#lastname");
  let inputName = document.querySelector("#name");
  let inputAdress = document.querySelector("#adress");
  let inputPostal = document.querySelector("#postal");
  let inputCity = document.querySelector("#city");
  let inputMail = document.querySelector("#mail");
  let inputPhone = document.querySelector("#phone");
  const submit = document.querySelector("#submit");
  let error = document.querySelector(".error");

  // gestion des champs non renseignés
  submit.addEventListener("click", (e) => {
    if (
      !inputLastName.value ||
      !inputName.value ||
      !inputAdress.value ||
      !inputPostal.value ||
      !inputCity.value ||
      !inputMail.value ||
      !inputPhone.value
    ) {
      error.innerHTML = "Merci de compléter l'ensemble des champs";
      error.style.color = "white";
      error.style.background = "red";
      error.style.padding = "2px 5px 2px 5px";
      e.preventDefault();
    } else if (
      isNaN(inputPhone.value)) {
      e.preventDefault();
      error.innerText = "Votre numéro de téléphone n'est pas valide";
      error.style.color = "white";
      error.style.background = "red";
      error.style.padding = "2px 5px 2px 5px";
    } else if (isNaN(inputPostal.value)) {
      e.preventDefault();
      error.innerText = "Votre code postal n'est pas valide";
      error.style.color = "white";
      error.style.background = "red";
      error.style.padding = "2px 5px 2px 5px";
    } else {

      // Creation d'une tableau shopId qui contient les infos du client et le panier
      let shopId = [];
      JSON.parse(localStorage.getItem("products")).forEach((produit) =>{ 
        shopId.push(produit._id);
      });
      const clientShop = {
        contact: {
          firstName: inputName.value,
          lastName: inputLastName.value,
          address: inputAdress.value,
          city: inputCity.value,
          email: inputMail.value,
        },
        products: shopId,
      };
      console.log(clientShop)

      // -------  Envoi de la requête POST au back-end --------
      // Création de l'entête de la requête avec les données client + panier
      const options = {
        method: "POST",
        body: JSON.stringify(clientShop),
        headers: { "Content-Type": "application/json" },
      };
      console.log(options);
      //Préparation du prix formaté pour l'afficher sur la prochaine page
      let confirmationPrice = document.querySelector(".total").innerText; //récupération du Total de la CLASS dans la variable
      confirmationPrice = confirmationPrice.split(" :"); //séparation en 2 colonnes pour avoir uniquement le total
      console.log("prix pour confirmations : " + confirmationPrice)
      //Envoie de la requête avec l'en-tête. On changera de page avec un localStorage qui ne contiendra plus que l'order id et le prix.
      fetch("http://localhost:3000/api/teddies/order", options)
        .then(res => res.json())
        .then((data) => {
          localStorage.setItem("orderId", data.orderId); //on récupére l'ID de confirmation de commande de l'API
          localStorage.setItem("total", confirmationPrice[1]); //on récupére le montant total de la commande pour l'afficher dans la confirmation de commande
          console.log("orderId de l'API : " + data.orderId);
          console.log("prix en retour de l'API : " + confirmationPrice[1]);

          //ouverture de la page confirmation avec récupération des 2 dernières données stockées dans le LS
          document.location.href = "../Template/confirmation.html";
        })
        .catch((err) => {
          alert("Il y a eu une erreur : " + err);
        });
    }
  });
}


main();

function main() {
  displayCart();
  countTotalInCart();
  toEmptyShop();
  formInformations();
}