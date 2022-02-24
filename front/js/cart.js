
//---------------Données provenant de l'API-----------
const baseUrlApi = 'http://localhost:3000/api/products/'

const fetchProducts = () => { // fetchProducts() renvoie une promesse contenant les données de l'API

  return fetch(`${baseUrlApi}`) 
    .then(response => response.json())
    .catch(error => console.log('error', error));
}

//---------------Panier------------------------
// Item désigne les éléments choisis présents dans le local storage. Product désigne le produit et ses caractéristiques présents dans l'API

let itemsList = JSON.parse(localStorage.getItem("cart"))
console.log(itemsList)


//---------------buildCartItems--------------

const buildCartItems = async (itemsList) => {

  const products = await fetchProducts(); // products représente le tableau des données classé par produit  
  
  for (let item of itemsList){

    let sectionCartItems = document.querySelector("section#cart__items")// Element parent des items
    let product = products.find(element => element._id === item.id)   
    
  
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
  
  console.log(deleteItemData)

  const newItemsList = itemsList.filter(element => element.id !== deleteItemData.id || element.color !== deleteItemData.color) //Tableau filtrant l'Item du localStorage dont l'id et la couleur correspondent à l'article du panier à supprimer
  
  itemsList = newItemsList // L'ancien tableau est mis à jour avec les élément du nouveau tableau
  
  localStorage.setItem("cart", JSON.stringify(itemsList)); // Mis à jour de la clé Cart dans le local Storage
  deleteItem.remove(); // Suppression de l'article sur la page panier

  countTotalQuantity() // Calcule le nombre d'article et le prix total.
  }
});

//--------------Mise à jour de la quantité ---------------

document.querySelector("section#cart__items").addEventListener('change', function(e) {
  
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

  let SumTotalQuantity = 0
  let SumTotalPrice = 0

  for (let i=0; i < itemQuantity.length; i++) { 
    console.log(itemPrice[i].innerHTML)
    SumTotalQuantity += Number(itemQuantity[i].value)
    SumTotalPrice += Number(itemQuantity[i].value) * Number(itemPrice[i].innerHTML.replace(' €','')) //Quantité * Prix

  }  

  totalQuantity.innerHTML = SumTotalQuantity
  totalPrice.innerHTML = SumTotalPrice 
}

