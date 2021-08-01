let cart = document.querySelector(".shopCart__recap"); 
let localStorageProd = JSON.parse(localStorage.getItem("products")); 

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

  // si on a des données dans localStorage on met la div en colonne en activant le CSS.
  if (localStorage.getItem("products")) {
    cartCard.style.display = "flex";
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

    //création d'une 2ème variable productPrice pour résolution du pb quand addition de montant avec séparateur de milliers
    let productPriceForTotal = document.createElement("div");
    productRow.appendChild(productPriceForTotal);
    productPriceForTotal.classList.add("priceForTotal"); //cette CLASS sert pour le TOTAL GENERAL et paramétré en DISPLAY : NONE
    productPriceForTotal.innerHTML = priceTotal;
    }
  }

function countTotalInCart() {
  let arrayPrice = []; 
  let totalPrice = document.querySelector(".total");

  // On récupére chaque prix pour les mettre dans le tableau
  let allPrice = document.querySelectorAll(".priceForTotal");
  for (let price in allPrice) {
    arrayPrice.push(allPrice[price].innerHTML);
  }

  // Suppression des lignes UNDEFINED du tableau
  arrayPrice = arrayPrice.filter((e) => {
    return e != undefined;
  });

  // Conversion en nombre des prix en créant un nouveau tableau pour convertir la même donnée dans la même variable
  arrayPrice = arrayPrice.map(x => parseFloat(x));

  // Addition des prix du tableau ==> permet de ne pas avoir de message d'erreur si LS vide grace a ala valeur initiale à 0
  const reducer = arrayPrice.reduce((acc, value) => acc + value, 0);
  arrayPrice = reducer

  //Affichage du TOTAL avec formatage € dans le HTML
  totalPrice.innerText = `Total : ${(arrayPrice = new Intl.NumberFormat(
    "fr-FR",
    {
      style: "currency",
      currency: "EUR",
    }
  ).format(arrayPrice)
  )}`;
}

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

  //regles de gestion de validation des formulaires
  function verification() {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regexPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const regexLastname = /^[a-zA-Z -]+$/;
    const regexName = /^[a-zA-Z -]+$/;
    const regexPostal = /^\d{5}$/;
    const erreurs = [];

    if (!formValues.lastname) erreurs.push("- Le nom n'est pas renseigné ou");
    if (!formValues.lastname.match(regexLastname)) erreurs.push("le nom ne doit pas contenir de chiffre/caractére spécial.");
    if (!formValues.name) erreurs.push("- Le prénom n'est pas renseigné ou");
    if (!formValues.name.match(regexName)) erreurs.push("le prénom ne doit pas contenir de chiffre/caractére spécial.");
    if (!formValues.adress) erreurs.push("- L'adresse n'est pas renseignée.");
    if (!formValues.postal) erreurs.push("- Le code postal n'est pas renseigné ou");
    if (!formValues.postal.match(regexPostal)) erreurs.push("le code postal doit contenir 5 chiffres.");
    if (!formValues.city) erreurs.push("- La ville n'est pas renseignée.");
    if (!formValues.phone) erreurs.push("- Le numéro de téléphone n'est pas renseigné ou");
    if (!formValues.phone.match(regexPhone)) erreurs.push("le numéro de téléphone n'est pas valide (entre 10 et 12 chiffres).");
    if (!formValues.mail) erreurs.push("- L'email n'est pas renseigné ou");
    if (!formValues.mail.match(regexEmail)) erreurs.push("le format de l'email n'est pas correct.")

    if (erreurs.length > 0) {
       alert("Le formulaire n'a pas pu être validé car :\n" + erreurs.join("\n"));
    }
    return (erreurs.length == 0);
 }

// //si formulaire 100% OK alors on passe la fonction d'envoi
  if(verification()) {
    sentIfOk();
  } else {
    // alert("Veuillez vérifier la saisie de votre formulaire");
  }

  //création de la fonction pour gérer la validation du formulaire
  function sentIfOk() {
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
        city: formValues.postal + " " + formValues.city,
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
    let confirmationPrice = document.querySelector(".total").innerText; 
    confirmationPrice = confirmationPrice.split(" :");
    console.log("prix pour confirmations : " + confirmationPrice)

        //Envoie de la requête avec l'en-tête. On changera de page avec un localStorage qui ne contiendra plus que l'order id et le prix.
    fetch("http://localhost:3000/api/teddies/order", options)
      .then(res => res.json())
      .then((data) => {
        localStorage.setItem("orderId", data.orderId);
        localStorage.setItem("total", confirmationPrice[1]);
        console.log("orderId de l'API : " + data.orderId);
        console.log("prix en retour de l'API : " + confirmationPrice[1]);

        //ouverture de la page confirmation avec récupération des 2 dernières données stockées dans le LS
        document.location.href = "../Template/confirmation.html";
      })
  }
});