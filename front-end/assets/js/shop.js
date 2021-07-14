let cart = document.querySelector(".shopCart__recap"); //stockage de la CLASS dans une variable
let localStorageProd = JSON.parse(localStorage.getItem("products")); //stockage des données du LS dans une variable
console.log(localStorageProd)


main();

function main() {
  displayCart();
  countTotalInCart();
  toEmptyShop();
}

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
  for (let produit in localStorageProd) {
    let productRow = document.createElement("div");
    cart.insertBefore(productRow, test); //création de la DIV avant la class  "empty-cart" (variable TEST)
    productRow.classList.add("shopCart__recap__row", "product-row");

    //création des DIV en prévision de la récup des données du LS
    let productName = document.createElement("div");
    productRow.appendChild(productName);
    productName.classList.add("shopCart__recap__title", "data-title");
    productName.innerHTML = localStorageProd[produit].name;

    let productQuantity = document.createElement("div");
    productRow.appendChild(productQuantity);
    productQuantity.classList.add("shopCart__recap__title", "data-quantity");
    productQuantity.innerHTML = localStorageProd[produit].quantity;

    let productPrice = document.createElement("div");
    productRow.appendChild(productPrice);
    productPrice.classList.add("shopCart__recap__title", "data-price");

    let priceTotal = parseFloat(localStorageProd[produit].price * localStorageProd[produit].quantity);
    
    // Affichage du prix avec le formatage € pour les lignes unitaires
    productPrice.innerHTML = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(priceTotal);

    console.log(productPrice)

    //création d'une 2ème variable productPrice pour résolution du pb quand addition de montant avec séparateur de milliers
    let productPriceForTotal = document.createElement("div");
    productRow.appendChild(productPriceForTotal);
    productPriceForTotal.classList.add("priceForTotal"); //cette CLASS sert pour le TOTAL GENERAL et paramétré en DISPLAY : NONE
    productPriceForTotal.innerHTML = priceTotal;

    console.log(productPriceForTotal)
  }
}
/****************************************************************************************** */
// let totalPrice = document.querySelector(".total");
// let allPrice = document.querySelectorAll(".priceForTotal");
// let totalPriceInit = 0;

// function countTotalInCart() {
//   if (localStorage.getItem("products")) {
//     for (let priceToSum in allPrice) {
//       totalPriceInit =+ allPrice[priceToSum];
//       console.log(totalPriceInit)
//       console.log(priceToSum)
//     }
//     console.log(totalPriceInit)
//   }
// }
/************************************************************************************************ */
//affichage du montant TOTAL
function countTotalInCart() {
  let arrayPrice = []; //création d'une colonne tableau avec les prix unitaire 
  let totalPrice = document.querySelector(".total"); //récupération de la CLASS TOTAL du HTML

  // On récupére chaque prix pour les mettre dans le tableau
  let allPrice = document.querySelectorAll(".priceForTotal"); //la CLASS priceForTotal permet de les récupérer
  for (let price in allPrice) {
    arrayPrice.push(allPrice[price].innerHTML); //intégration dans le tableau
  }
  console.log(arrayPrice)

  // Suppression des lignes UNDEFINED du tableau
  arrayPrice = arrayPrice.filter((e) => {
    return e != undefined;
  });
  console.log(arrayPrice)

  // Conversion en nombre des prix en créant un nouveau tableau pour convertir la même donnée dans la même variable
  arrayPrice = arrayPrice.map((x) => parseFloat(x));
  console.log(arrayPrice)

  // Addition des prix du tableau ==> permet de ne pas avoir de message d'erreur si LS vide grace a ala valeur initiale à 0
  const reducer = arrayPrice.reduce((acc, value) => acc + value, 0);
  arrayPrice = reducer
  console.log(arrayPrice)

  //Affichage du TOTAL avec formatage € dans le HTML
  totalPrice.innerText = `Total : ${(arrayPrice = new Intl.NumberFormat(
    "fr-FR",
    {
      style: "currency",
      currency: "EUR",
    }
  ).format(arrayPrice))}`;
  console.log(arrayPrice)
}
// /*************************************************************************************** */
 // Vider le panier
function toEmptyShop() {
  const ToEmptyShop = document.querySelector(".to-empty-cart");
  ToEmptyShop.addEventListener("click", () => {
    localStorage.clear();
  });
}

////Prépa package et envoi à l'API
//sélection du bouton Envoyer du formulaire
const btnEnvoyerForm = document.querySelector("#submit");

btnEnvoyerForm.addEventListener("click", (e)=> {
  e.preventDefault();
  // récupération des valeurs du formulaire
  const formValues = {
    lastname : document.querySelector("#lastname").value,
    name : document.querySelector("#name").value,
    adress : document.querySelector("#adress").value,
    postal : document.querySelector("#postal").value,
    city : document.querySelector("#city").value,
    mail : document.querySelector("#mail").value,
    phone : document.querySelector("#phone").value
  }
  console.log("formValues")
  console.log(formValues);

  //Creation d'une tableau shopId qui contient les infos du client et le panier
  let shopId = [];
  JSON.parse(localStorage.getItem("products")).forEach((produit) =>{ 
    shopId.push(produit._id);
  });
  const clientShop = {
    contact: {
      firstName: formValues.name,
      lastName: formValues.lastname,
      address: formValues.adress,
      city: formValues.city,
      email: formValues.mail,
    },
    products: shopId,
  };
  console.log("clientShop");
  console.log(clientShop);

      // -------  Envoi de la requête POST au back-end --------
      // Création de l'entête de la requête avec les données client + panier
  const options = {
    method: "POST",
    body: JSON.stringify(clientShop),
    headers: { "Content-Type": "application/json" },
  };
  console.log("options");
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
//         .catch((err) => {
//           alert("Il y a eu une erreur : " + err);
});