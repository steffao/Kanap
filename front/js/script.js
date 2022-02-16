
/*  Pour activer le serveur distant de l'API, dans le terminal se mettre sur le répertoire back et déclencher la commance "npm start" (cf. README)*/
const baseURL = 'http://localhost:3000/api/products/' // baseURL est l'URL de l'API


const fetchProducts = () => { // fetchProducts() renvoie une promesse contenant les données de l'API

// var requestOptions = {
//   method: 'GET',
//   redirect: 'follow',
//   cache: 'force-cache'
// };
return fetch(`${baseURL}`) 
  .then(response => response.json()) // Si promesse respectée => Données de l'API disponible
  .catch(error => console.log('error', error)); // Si promesse non respectée => Message d'erreur dans la console
}



const buildSectionProducts = async () => { // buildSectionProducts() va créer les éléments contenus dans la section.items et définir les valeurs et propriétés de ces éléments
    //buildSectionProducts() est une fonction asynchrone s'exécutant lorsqu'elle dispose des résultats de la promesse issue de fetchProducts()
    const products = await fetchProducts(); // products représente le tableau des données classé par produit
    console.log(products[2]._id)
    
    for (let product of products) { // Cette boucle va itérer les éléments product (products[i]) du tableau products

        let productPage = document.createElement('a') // création de l'élément a et ajout du href
        productPage.href = `./product.html?id=${product._id}`
        document.querySelector('section.items').appendChild(productPage)
        
        let productArticle = document.createElement('article') // création de l'élément article
        productPage.appendChild(productArticle)

        let productImage = document.createElement('img') // création de l'élément image et ajout des propriétés src et alt
        productImage.src = product.imageUrl
        productImage.alt = product.altTxt
        productArticle.appendChild(productImage)

        let productName = document.createElement('h3') // création de l'élément h3 et ajout de la classe et de la valeur
        productName.classList.add('productName')
        productName.textContent = product.name
        productArticle.appendChild(productName)

        let productDescription = document.createElement('p') // création de l'élément p et ajout de la classe et de la valeur
        productDescription.classList.add('productDescription')
        productDescription.textContent = product.description
        productArticle.appendChild(productDescription)

    }
   
}
buildSectionProducts();



