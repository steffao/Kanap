
/*  Pour activer le serveur distant de l'API, dans le terminal se mettre sur le répertoire back et déclencher la commance "npm start" (cf. README)*/
const baseUrlApi = 'http://localhost:3000/api/products/'

const fetchProducts = () => { // fetchProducts() renvoie une promesse contenant les données de l'API

// var requestOptions = {
//   method: 'GET',
//   redirect: 'follow',
//   cache: 'force-cache'
// };
return fetch(`${baseUrlApi}`) 
  .then(response => response.json()) // Si promesse respectée => Données de l'API disponible
  .catch(error => console.log('error', error)); // Si promesse non respectée => Message d'erreur dans la console
}

const buildSectionProducts = async () => { // buildSectionProducts() va créer les éléments contenus dans la section.items et définir les valeurs et propriétés de ces éléments
    //buildSectionProducts() est une fonction asynchrone s'exécutant lorsqu'elle dispose des résultats de la promesse issue de fetchProducts()
    
    const products = await fetchProducts(); // products représente le tableau des données classé par produit
    
    for (let product of products) { // Cette boucle va lister les produits et leurs caractéristiques

        let productPageLink = document.createElement('a')
        productPageLink.href = `./product.html?id=${product._id}`
        document.querySelector('section.items').appendChild(productPageLink)
        
        let productArticle = document.createElement('article')
        productPageLink.appendChild(productArticle)

        let productImage = document.createElement('img')
        productImage.src = product.imageUrl
        productImage.alt = product.altTxt
        productArticle.appendChild(productImage)

        let productName = document.createElement('h3')
        productName.classList.add('productName')
        productName.textContent = product.name
        productArticle.appendChild(productName)

        let productDescription = document.createElement('p')
        productDescription.classList.add('productDescription')
        productDescription.textContent = product.description
        productArticle.appendChild(productDescription)

    }  
}
buildSectionProducts();



