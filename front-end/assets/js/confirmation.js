function displayOrderIdAndPrice() {
  const totalConfirmation = document.querySelector(".display-price");
  const orderId = document.querySelector(".display-orderid");
  
  totalConfirmation.innerText = localStorage.getItem("total");
  orderId.innerText = localStorage.getItem("orderId");

  // On vide le localStorage pour le prochain panier
  localStorage.clear(); 
}

displayOrderIdAndPrice();