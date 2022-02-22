
/* L'id du produit servira de paramétre pour afficher les données liées au produit. On se sert de l'url de la page pour récupérer l'id */
const searchParams = new URLSearchParams(location.search) // Fournit des méthodes utilitaires liés à l'URL. location.search correspond à "?id=....."
const productId = searchParams.get("id")  // Retourne la valeur du paramétre id
console.log(productId)

/*  Pour activer le serveur distant de l'API, dans le terminal se mettre sur le répertoire back et déclencher la commance "npm start" (cf. README)*/
const baseUrlApi = 'http://localhost:3000/api/products/'

const fetchProducts = () => { // fetchProducts() renvoie une promesse contenant les données de l'API

  return fetch(`${baseUrlApi}`) 
    .then(response => response.json())
    .catch(error => console.log('error', error));
}

const buildProductPage = async (productId) => { // buildProductPage() va créer les éléments contenus dans la page produit et définir les valeurs et propriétés de ces éléments
    //buildProductPage() est une fonction asynchrone s'exécutant lorsqu'elle dispose des résultats de la promesse issue de fetchProducts()
    const products = await fetchProducts(); // products représente le tableau des données classé par produit
    
    const product = products.find(element => element._id === productId) 
    
    const productLogo = document.createElement('img')
    productLogo.src = `../images/logo.png`
    productLogo.alt = "Photographie d'un canapé"
    document.querySelector('div.item__img').appendChild(productLogo)
    
    const productName = document.getElementById('title')
    productName.textContent = product.name

    const productPrice = document.getElementById('price')
    productPrice.textContent = product.price
    
    const productDescription = document.getElementById('description')
    productDescription.textContent = product.description

    for (let productColor of product.colors) { // Crée les éléments en fonction du tableau de couleurs du produit
      let productColorOption = document.createElement('option')
      productColorOption.value = productColor
      productColorOption.textContent = productColor
      document.querySelector('select#colors').appendChild(productColorOption)
    }
    
   
}
buildProductPage(productId);

 //-------------------Local Storage-----------

const addToLocalStorage = (productId,productColor,quantity) => { 
  
  let productsList = JSON.parse(localStorage.getItem("product")) // Récupération du contenu du local storage de la key product pour ajouter des éléments

  if (productsList === null) { // Si productList est vide il renvoie null et ne peut exécuter la fonction. Il est nécessaire alors d'avoir un tableau vide pour pousser le premier élément
    productsList = []
  }

  console.log(productsList)

  let productSelected = {
    id : productId,
    color : productColor, //couleur sélectionné
    quantity : Number(quantity)
  } 

  if (productsList.find(element => element.id == productSelected.id && element.color == productSelected.color)){ // Si un élément du tableau productList a les mêmes id ET couleur que le produit sélectionné 
    
    let existingProduct = productsList.find(element => element.id == productSelected.id && element.color == productSelected.color)
    existingProduct.quantity += productSelected.quantity
  } else {
    productsList.push(productSelected)
  }
  
  
  localStorage.setItem("product", JSON.stringify(productsList))  
}

document.querySelector("button#addToCart").addEventListener("click", function(){
  let productColor = document.querySelector('select#colors').value //couleur sélectionné
  let quantity = document.querySelector('input#quantity').value
  
  if (productColor.value =="" || quantity < 1){ // La fonction s'execute si tous les champs sont renseignés et que le nombre d'articles selectionné est entre 0 et 100
    window.alert("Veuillez choisir une couleur et une quantité d'articles.")

  } else if (Number(quantity) > 100){
    window.alert("Vous avez excéder la quantité d'articles autorisée.")
  } else {
    addToLocalStorage(productId,productColor,quantity)
  }   
})







/* 
 <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
                <div class="cart__item__img">
                  <img src="../images/product01.jpg" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>Nom du produit</h2>
                    <p>Vert</p>
                    <p>42,00 €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article> 

*/

