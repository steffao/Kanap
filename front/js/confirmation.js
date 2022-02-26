
/* On se sert de l'url de la page pour récupérer l'order id */
const searchParams = new URLSearchParams(location.search) // Fournit des méthodes utilitaires liés à l'URL
const orderId = searchParams.get("orderId")  // Retourne la valeur du paramétre orderId

const getOrderId = (orderId) => {
    const orderIdSpan = document.querySelector('span#orderId')
    orderIdSpan.innerHTML = orderId
}
getOrderId(orderId)

