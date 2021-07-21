// Récupération des données peluches de l'API
function getArticles() {
  fetch("http://localhost:3000/api/teddies")
    .then(function (res) {
      return res.json();
    })
//gestion de la non connection au serveur
    .catch((error) => {
      let products_bloc = document.querySelector(".products-home-page");
      products_bloc.innerHTML =
        "un problème de lien avec le serveur a été détecté.<br> Vérifier la connection du serveur local<br>Si le problème persiste, merci de nous contacter par l'intermédiaire du formulaire CONTACT";
    })
// Affichage des données de chaque produit dans le HTML
    .then(function (listAPI) {
      const articles = listAPI;
      for (let article in articles) {

        //création d'une variable DIV dans la classe PRODUCTS où on va mettre une class PRODUCT
        let productBloc = document.createElement("div"); 
        document.querySelector(".products").appendChild(productBloc); 
        productBloc.classList.add("product");

        //création du lien pour page produit
        let productLink = document.createElement("a");
        productBloc.appendChild(productLink);
        productLink.href = `Template/product.html?id=${listAPI[article]._id}`;
        productLink.classList.add("new-link");

        //création d'une DIV pour la photo du produit
        let productImgDiv = document.createElement("div"); 
        productLink.appendChild(productImgDiv);
        productImgDiv.classList.add("product__img");

        //intégration de l'image dans la DIV précédente
        let productImg = document.createElement("img");
        productImgDiv.appendChild(productImg);
        productImg.src = listAPI[article].imageUrl;

        //création d'un bloc infos produits pour nom et prix
        let productInfosDiv = document.createElement("div");
        productLink.appendChild(productInfosDiv);
        productInfosDiv.classList.add("product__infos");

        //nom du produit
        let productInfoTitle = document.createElement("div");
        productInfosDiv.appendChild(productInfoTitle);
        productInfoTitle.classList.add("product__infos__title");
        productInfoTitle.innerHTML = listAPI[article].name;

        //prix du produit
        let productInfoPrice = document.createElement("div");
        productInfosDiv.appendChild(productInfoPrice);
        productInfoPrice.classList.add("product__infos__price");

        // Formatage du prix en €
        listAPI[article].price = listAPI[article].price / 100;
        productInfoPrice.innerHTML = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(listAPI[article].price);
      }
    });
}

getArticles();