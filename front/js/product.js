
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



