const cartContainer = document.querySelector(".cart-container")
const productList = document.querySelector(".product-list")
const cartList = document.querySelector(".cart-list")
const cartTotalValue = document.getElementById("cart-total-value")
const cartCountInfo = document.getElementById("cart-count-info")
let cartItemId = 0



function eventListeners() {
    document.querySelector(".navbar-toggler").addEventListener("click", () => {
        document.querySelector(".navbar-collapse").classList.toggle("show-navbar")
    })


    document.getElementById("cart-btn").addEventListener("click", () => {
        cartContainer.classList.toggle("show-cart-container")
    })


    productList.addEventListener("click", purchaseProduct)

    cartList.addEventListener("click", deleteProduct)
}
eventListeners()

function updateCartInfo(){
    let cartInfo = findCartInfo()
    cartCountInfo.textContent = cartInfo.productCount
    cartTotalValue.textContent = cartInfo.total
}




function presentProducts() {
    for(i = 0; i < productArray.length; i++){
        productList.innerHTML += `
            <div class="product-item">
                <div class="product-img">
                    <img src="${productArray[i].imgSrc}" alt="product image">
                    <button class="add-to-cart-btn">
                        <i class="fas fa-shopping-cart"></i>Add to Cart
                    </button>
                </div>
                <div class="product-content">
                    <h3 class="product-name">${productArray[i].name}</h3>
                    <span class="product-category">${productArray[i].category}</span>
                    <p class="product-price">$${productArray[i].price}</p>
                </div>
            </div>
        `
    }
}
presentProducts()


function purchaseProduct (e){
    if(e.target.classList.contains("add-to-cart-btn")){
        let product = e.target.parentElement.parentElement
        getProductInfo(product)
    }
}

function getProductInfo(product){
    let productInfo = {
        id: cartItemId,
        imgSrc: product.querySelector(".product-img img").src,
        name: product.querySelector(".product-name").textContent,
        category: product.querySelector(".product-category").textContent,
        price: product.querySelector(".product-price").textContent
    }
    cartItemId++
    addToCartList(productInfo)
    saveProductInStorage(productInfo)
}


function addToCartList(product){
    cartList.innerHTML += `
        <div class="cart-item"  data-id=${product.id}>
            <img src=${product.imgSrc} alt="product image">

            <div class="cart-item-info">
                <h3 class="cart-item-name">${product.name}</h3>
                <span class="cart-item-category">${product.category}</span>
                <span class="cart-item-price">${product.price}</span>
            </div>

            <button class="cart-item-del-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `
}

function saveProductInStorage(item){
    let products = getProductFromStorage()
    products.push(item)
    localStorage.setItem("products", JSON.stringify(products))
    updateCartInfo()
}

function getProductFromStorage(){
    return localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : []
}

function loadCart(){
    let products = getProductFromStorage()
    if(products.length < 1){
        cartItemId = 1
    }else{
        cartItemId = products[products.length - 1].id
        cartItemId++
    }
    products.forEach(product => addToCartList(product))

    updateCartInfo()
}
loadCart()

function findCartInfo(){
    let products = getProductFromStorage()
    let total = products.reduce((acc,product) => {
        let price = parseFloat(product.price.substr(1))
        return acc + price
    }, 0)
    return{
        total: total.toFixed(2),
        productCount: products.length
    }
}

function deleteProduct(e){
    let cartItem
    if(e.target.tagName === "BUTTON"){
        cartItem = e.target.parentElement
        cartItem.remove()
    }else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement
        cartItem.remove()
    }
    let products = getProductFromStorage()
    let updatedProducts = products.filter(product => {
        return product.id != parseInt(cartItem.dataset.id)
    })
    localStorage.setItem("products", JSON.stringify(updatedProducts))
    updateCartInfo()
}