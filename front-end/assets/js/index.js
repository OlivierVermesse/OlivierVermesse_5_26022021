// Récupération des données peluches de l'API
function getArticles() {
  fetch("http://localhost:3000/api/teddies")
    .then(function (res) {
      return res.json(); //récupération en format JSON
      console.log(res.json())
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
      console.log(articles)
      for (let article in articles) {

        //création d'une variable DIV dans la classe PRODUCTS où on va mettre une class PRODUCT
        let productBloc = document.createElement("div"); //création de la DIV
        document.querySelector(".products").appendChild(productBloc); //positionnement de la DIV dans la CLASS PRODUCTS
        productBloc.classList.add("product"); //indication que c'est une CLASS nommé PRODUCT

        //création du lien pour page produit
        let productLink = document.createElement("a"); //création de l'attribut A
        productBloc.appendChild(productLink); //ajout de l'atribut dans la DIV précédente en tant qu'enfant
        productLink.href = `Template/product.html?id=${listAPI[article]._id}`; //récupération de l'ID produit et ajout propriété HREF pour le lien produit
        productLink.classList.add("new-link"); //indication que la CLASS est new-link

        //création d'une DIV pour la photo du produit
        let productImgDiv = document.createElement("div"); //création de la DIV
        productLink.appendChild(productImgDiv); //intégration de cette DIV dans l'attribut A
        productImgDiv.classList.add("product__img"); //nommage de la CLASS

        //intégration de l'image dans la DIV précédente
        let productImg = document.createElement("img");//création de l'attribut IMG
        productImgDiv.appendChild(productImg); //rattachement de l'atribut à la DIV PARENTS
        productImg.src = listAPI[article].imageUrl; //récupération de l'API du lien de l'image

        //création d'un bloc infos produits pour nom et prix
        let productInfosDiv = document.createElement("div"); //création de la DIV
        productLink.appendChild(productInfosDiv); //rattachement au lien hypertexte
        productInfosDiv.classList.add("product__infos"); //nommage de la DIV avec la CLASS

        //nom du produit
        let productInfoTitle = document.createElement("div"); //création de la DIV
        productInfosDiv.appendChild(productInfoTitle); //rattachement au PARENTS 
        productInfoTitle.classList.add("product__infos__title"); //nommage en CLASS
        productInfoTitle.innerHTML = listAPI[article].name; //récupération du nom selon l'API

        //prix du produit
        let productInfoPrice = document.createElement("div"); //création de la DIV
        productInfosDiv.appendChild(productInfoPrice); //rattachement au PARENTS 
        productInfoPrice.classList.add("product__infos__price");//nommage en CLASS

        // Formatage du prix en €
        listAPI[article].price = listAPI[article].price / 100; //récupération du prix de l'API
        productInfoPrice.innerHTML = new Intl.NumberFormat("fr-FR", { //formatage en € grace au constructeur
          style: "currency",
          currency: "EUR",
        }).format(listAPI[article].price); //intégration du nouveau format dans la donnée de "l'API"
      }
    });
}

getArticles();