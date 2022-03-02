
//---------------Données provenant de l'API-----------
const baseUrlApi = 'http://localhost:3000/api/products/'


const fetchProduct = (id) => { // fetchProduct() renvoie une promesse contenant les données de l'API selon le paramétre id passé

  return fetch(`${baseUrlApi}${id}`) 
    .then(response => response.json())
    .catch(error => console.log('error', error));
}

//---------------Panier------------------------
// Item désigne les éléments choisis présents dans le local storage. Product désigne le produit et ses caractéristiques présents dans l'API

const itemsList = JSON.parse(localStorage.getItem("cart"))

//---------------buildCartItems--------------

const buildCartItems = async (itemsList) => {
  if (itemsList){
    for (let item of itemsList){

      let sectionCartItems = document.querySelector("section#cart__items")// Element parent des items
      let product = await fetchProduct(item.id)
    
      let itemArticle = document.createElement('article')//Création de l'article contenant un item
      itemArticle.classList.add('cart__item')
      itemArticle.setAttribute("data-id", item.id)
      itemArticle.setAttribute("data-color", item.color)
  
      itemArticle.innerHTML =`
          <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${product.name}</h2>
              <p>${item.color}</p>
              <p class=itemPrice>${product.price} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        `
      
      sectionCartItems.appendChild(itemArticle)    
    } 
  
    countTotalQuantity() // Calcule le nombre d'article et le prix total.
  }
  

  
}

buildCartItems(itemsList)

//--------------Supprimer du Panier---------------

document.querySelector("section#cart__items").addEventListener('click', function(e) {
  
  let deleteBtn = e.target // Bouton cliqué
  let deleteItem = deleteBtn.closest("article") // Article parent du bouton cliqué
  let deleteItemData = { // Onjet contenant le data attr de l'<article> parent du bouton cliqué
    id : deleteItem.dataset.id,
    color : deleteItem.dataset.color,
  }
    
  if(deleteBtn.classList.contains('deleteItem')) { // Si l'élément du bouton existe
  
   const newItemsList = itemsList.filter(element => element.id !== deleteItemData.id || element.color !== deleteItemData.color) //Tableau filtrant l'Item du localStorage dont l'id et la couleur correspondent à l'article du panier à supprimer
  
  
  
  localStorage.setItem("cart", JSON.stringify(newItemsList)); // Mis à jour de la clé Cart dans le local Storage
  deleteItem.remove(); // Suppression de l'article sur la page panier

  countTotalQuantity() // Calcule le nombre d'article et le prix total.
  }
});



  

//--------------Mise à jour de la quantité ---------------

document.querySelector("section#cart__items").addEventListener('change', function(e) {
  
  if ( Number(e.target.value) < 0 || Number(e.target.value) == "" ){
    e.target.value = 0
    alert("Veuillez saisir un nombre d'articles entre 1 et 100")
  } else if(Number(e.target.value > 100)) {
    e.target.value = 100
    alert("Veuillez saisir un nombre d'articles entre 1 et 100")
  }
  console.log(e.target.value)
  
  let modifiedInput = e.target // input modifié
  let modifiedItem = modifiedInput.closest("article") // Article parent du bouton cliqué
  let modifiedItemData = { // Onjet contenant le data attr de l'<article> parent du bouton cliqué
    id : modifiedItem.dataset.id,
    color : modifiedItem.dataset.color,
    quantity : modifiedInput.value
  }

  if(modifiedInput.classList.contains('itemQuantity')) { // Si l'élément input existe

  const foundItem = itemsList.find(element => element.id == modifiedItemData.id || element.color == modifiedItemData.color) //Tableau filtrant l'Item du localStorage dont l'id et la couleur correspondent à l'article du panier à supprimer
  
  
  foundItem.quantity = Number(modifiedItemData.quantity)
   
  localStorage.setItem("cart", JSON.stringify(itemsList)); // Mise à jour de la clé Cart dans le local Storage

  countTotalQuantity() // Calcule le nombre d'article et le prix total.
  }
});

//-------------Calcul des totaux------------------------
const countTotalQuantity = () => { // Calcule le nombre d'article et le prix total. Cette fonction est appelé chaque fois que le panier est mis à jour. 

  let totalQuantity = document.querySelector('span#totalQuantity') // Quantité d'article
  let itemQuantity = document.querySelectorAll('input.itemQuantity')

  let totalPrice = document.querySelector('span#totalPrice') // Prix
  let itemPrice = document.querySelectorAll('p.itemPrice')

  let sumTotalQuantity = 0
  let sumTotalPrice = 0

  for (let i=0; i < itemQuantity.length; i++) { 
  
    sumTotalQuantity += Number(itemQuantity[i].value)
    sumTotalPrice += Number(itemQuantity[i].value) * Number(itemPrice[i].innerHTML.replace(' €','')) //Quantité * Prix

  }  

  totalQuantity.innerHTML = sumTotalQuantity
  totalPrice.innerHTML = sumTotalPrice 
}

//-----------------------Form------------------

//Prénom

function validateName(elementValue){ // Fonction servant pour les noms et prénoms
  const namePattern = /^[a-zA-Z-' ]+$/; // Autorise uniquement les lettres maj/min, les espaces, apostrophes et tirets

  return namePattern.test(elementValue); 
}

const firstNameInput = document.querySelector('input#firstName')

const firstNameErrorMsg = document.querySelector('p#firstNameErrorMsg')

firstNameInput.addEventListener("change", function () {
  firstNameInput.value = firstNameInput.value.trim()
  if (validateName(firstNameInput.value) == false) {
    firstNameErrorMsg.innerHTML = "Caractère(s) non autorisé(s). Veuillez saisir à nouveau votre prénom."
  } else {
    firstNameErrorMsg.innerHTML = ""
  }
})

//Nom

const lastNameInput = document.querySelector('input#lastName')
const lastNameErrorMsg = document.querySelector('p#lastNameErrorMsg')

lastNameInput.addEventListener("change", function () {
  lastNameInput.value = lastNameInput.value.trim()
  if (validateName(lastNameInput.value) == false) {
    lastNameErrorMsg.innerHTML = "Caractère(s) non autorisé(s). Veuillez saisir à nouveau votre nom."
  } else {
    lastNameErrorMsg.innerHTML = ""
  }
})

//Address

function validateAddress(elementValue){ // Fonction servant pour les noms et prénoms
  const addressPattern = /^[a-zA-Z0-9\s,.'"-/()]+$/; // Autorise uniquement les lettres maj/min, chiffres, points, les espaces, apostrophes, tirets, slashs, guillemets, parenthèses
  return addressPattern.test(elementValue); 
}

const addressInput = document.querySelector('input#address')
const addressErrorMsg = document.querySelector('p#addressErrorMsg')

addressInput.addEventListener("change", function () {
  addressInput.value = addressInput.value.trim()
  if (validateAddress(addressInput.value) == false) {
    addressErrorMsg.innerHTML = "Caractère(s) non autorisé(s). Veuillez saisir à nouveau votre adresse."
  } else {
    addressErrorMsg.innerHTML = ""
  }
})

//City

function validateCity(elementValue){ // Fonction servant pour les noms et prénoms
  const cityPattern = /^[a-zA-Z0-9\s,.'"-/()]+$/; // Autorise uniquement les lettres maj/min, chiffres, points, les espaces, apostrophes, tirets, slashs, guillemets, parenthèses
  return cityPattern.test(elementValue); 
}

const cityInput = document.querySelector('input#city')
const cityErrorMsg = document.querySelector('p#cityErrorMsg')

cityInput.addEventListener("change", function () {
  cityInput.value = cityInput.value.trim()
  if (validateCity(cityInput.value) == false) {
    cityErrorMsg.innerHTML = "Caractère(s) non autorisé(s). Veuillez saisir à nouveau votre ville."
  } else {
    cityErrorMsg.innerHTML = ""
  }
})

//Email

function validateEmail(elementValue){ // http://zparacha.com/validate-email-address-using-javascript-regular-expression
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Autorise uniquement les lettres maj/min, chiffres, points, underscores, tirets AVANT et APRES l'@ obligatoire et 2 à 4 lettres après le dernier point obligatoire
  return emailPattern.test(elementValue); 
}

const emailInput = document.querySelector('input#email')
const emailErrorMsg = document.querySelector('p#emailErrorMsg')

emailInput.addEventListener("change", function () {
  if (validateEmail(emailInput.value) == false) {
    emailErrorMsg.innerHTML = "Votre adresse email n'est pas valide"
  } else {
    firstNameErrorMsg.innerHTML = ""
  }
})

//------------Envoi commande---------------

// Objet Contact

let order = document.querySelector('input#order')

const isFormValid = () => { // Vérifie la conformité du formulaire en verifiant la totalité des fonctions paramètres
  if ((validateName(firstNameInput.value) && validateName(lastNameInput.value) && validateAddress(addressInput.value) &&
  validateCity(cityInput.value) && validateEmail(emailInput.value))==true
  ){ 
    return true
  } else {
      alert("Veuillez saisir tous les champs du formulaire.")
      return false
  }
}
const buildContactObject = () => { // crée l'objet contact contenant toutes les infos des champs du Formulaire . Cet objet est nécessaire à la requête API POST

  let orderForm = document.querySelector('form.cart__order__form'); // Formulaire de base
  let formData = new FormData(orderForm); // Methode appliquée au formulaire
  
  let contactObject = {}
  
  for (let pair of formData.entries()) { // Construction de l'objet sur la base de l'objet de type Form Data
  
    contactObject[pair[0]] = pair[1] // Ajout dans l'objet contactObject  
  } 
  return contactObject
}

// Tableau product Id du panier

const isCartEmpty = () => { // vérifie que le tableau product id (panier) n'est pas vide
  if (buildProductIdsArray().length > 0) {
    return true
  } else {
    alert("Vous n'avez sélectionné aucun produit.")
    return false

  }
} 

const buildProductIdsArray = () => { // crée le tableau product contenant toutes les product id présente dans le panier. Ce tableau est nécessaire à la requête API POST

  let articles = document.querySelectorAll('article.cart__item')
  let productIdArray = []

  for (let article of articles) {

    productIdArray.push(article.dataset.id)
  }
  
  return productIdArray
}

//---------Submit order------------

order.addEventListener("click", function(e) { 
  e.preventDefault() // Annule le comportement de e soit l'input order
  if (isFormValid() && isCartEmpty()) { // Vérifie que l'objet contact et le tableau product sont conformes et non vides
    
    
    fetch(`${baseUrlApi}/order`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}, // Header précisant le type de fichiers envoyé
      body: JSON.stringify({contact: buildContactObject(), products: buildProductIdsArray()}) // Object contenant le tableau products et l'object contact
      
    })
      .then(response => response.json()) // La response renvoie une promesse
      .then(data => 
        {localStorage.clear();// le local storage se vide et le panier aussi de facto
        window.location.href = `./confirmation.html?orderId=${data.orderId}`}) // 2e then , la promesse renvoie la réponse de l'API. location.href permet la redirection vers la page confirmation.
      // On récupère l'orderId contenu dans la réponse API et on l'insère comme paramètre de la page confirmation pour le récupérer plus tard via location.get
      
      .catch(error => {
      console.error('Error:', error);
    });    
  } else {
      return false
  }
})




