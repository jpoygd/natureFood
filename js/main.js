//botones
const decreseQty = document.querySelector(".decreasePrice");
const increseQty = document.querySelector(".increasePrice");
const addToCartBtn = document.querySelector(".button");
const cartBtn = document.querySelector(".cartBtn");
const closeCartBtn = document.querySelector(".closeShoppingCart");
const clearCartBtn = document.querySelector(".removeShoppingCart");
const checkoutBtn = document.querySelector(".buttonCheckOut");

//textos
let productName = document.querySelector(".name");
let priceByK = document.querySelector(".price");
let weightSelected = document.querySelector(".cantOfKilos");
let finalPrice = document.querySelector(".finalPrice");
let cartItems = document.querySelector(".cart-items");
let cartTotal = document.querySelector(".finalPriceShoppingCart");

//DOM cards
const cardDOM = document.querySelector(".productContainer");
const cartContent = document.querySelector(".shoppingCartProductSpace");
const cartDOM = document.querySelector(".shoppingCart");
const cartOverlay = document.querySelector(".openCart");

//items en el carrito
let cart = [];
let buttonsDOM = [];

//tomando los datos del JSON
class Products {
    async getProducts(){
        try{
            let result = await fetch('productos.json');
            let data = await result.json();
            // tomo los productos que quiero
            let products = data.items;
            products = products.map(item =>{
                const {price, type, image, id} = item;
                return {type,price,image,id}
            })
            return products;
        }catch (error) {
            console.log(error);
        }
    }
}

// mostrando los productos
class Display {
    displayProducts(products){
        let result = '';
        products.forEach(product => {
            result += `
            <div class="card">
            <div class="productImage">
                <img src=${product.image} class="cardImg" alt="Banana">
            </div>
            <div class="productDescription">
                <h3 class="name">${product.type}</h3>
                <h3 class="finalPrice">$${product.price}</h3>
                <p>Precio por Kg.</p>
                <button class="button" data-id="${product.id}">¡AL CARRITO!</button>
            </div>
        </div>
        `;
        });
        cardDOM.innerHTML = result;
    }

    getBagButtons(){
        const buttons = [...document.querySelectorAll(".button")];
        buttonsDOM = buttons;
        buttons.forEach(button =>{
            let id = button.dataset.id;
            let inCart = cart.find(items => items.id === id);
            if(inCart){
                button.innerHTML = "¡AGREGADO!";
                button.disabled = true;
            }
            else{
                button.addEventListener('click', (event)=>{
                    event.target.innerText = "¡AGREGADO!";
                    event.target.disabled = true;
                    
                    let cartItem = {...Storage.getProduct(id), amount:1};
                    cart = [...cart, cartItem];
                    Storage.saveCart(cart);
                    
                    this.setCartValues(cart);
                    this.addCartItem(cartItem);
                    this.showCart();
                });
            }
        });
    }

    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item =>{
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }

    addCartItem(product){
        const div = document.createElement('div');
        div.classList.add('itemsShoppingCart');
        div.innerHTML = ` <div class="row">
        <div class="col-xl-3">
        <img src=${product.image} class="imgShoppingCart"  alt="Banana">
        </div>
        <div class="col-xl-7 amountToPayShoppingCart">
            <h3>${product.type}</h3>
            <p>$<span class="priceItemShoppinCart">${product.price}</span></p>
            <a class="removeShoppingCart" href="#" data-id=${product.id}>Eliminar del pedido</a>
        </div>
        <div class="col-lx-2 cantSelectorShoppingCart">
            <img src="img/increasecart.png" alt="aumentar cantidad" class="increaseCantShoppingCart" data-id=${product.id}>
            <p><span class="cantShoppingCart">${product.amount}</span>kg</p>
            <img src="img/decreasecart.png" alt="disminuir cantidad" class="decreaseCantShoppingCart" data-id=${product.id}>
        </div>
    </div>`;
    cartContent.appendChild(div);
    }
    
    showCart(){
        cartOverlay.classList.add('cartOpen');
        cartDOM.classList.add('showCart');
    }

    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }
    populateCart(cart){
        cart.forEach(item =>this.addCartItem(item));
    }
    hideCart(){
        cartOverlay.classList.remove('cartOpen');
        cartDOM.classList.remove('showCart');
    }
    cartLogic(){
        //limpiar carrito
        clearCartBtn.addEventListener('click', ()=>{
            this.clearCart();
        });

        cartContent.addEventListener('click', event=>{
            if(event.target.classList.contains('removeShoppingCart')){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement.parentElement);
                this.removeItem(id);
            }
            else if(event.target.classList.contains('increaseCantShoppingCart')){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 0.5;

                Storage.saveCart(cart);
                this.setCartValues(cart);

                addAmount.nextElementSibling.innerText = tempItem.amount + ' kg';
            }
            else if(event.target.classList.contains('decreaseCantShoppingCart')){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 0.5;

                if(tempItem.amount > 0.5){
                    Storage.saveCart(cart)
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount + ' kg';
                }
                else{
                    cartContent.removeChild(lowerAmount.parentElement.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        });
    }
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        console.log(cartContent.children);

        while(cartContent.children.length > 0){
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `¡AL CARRITO!`;
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);

    }
}

//Local Storage
class Storage {
 static saveProducts(products){
     localStorage.setItem("products", JSON.stringify(products));
 }
 static getProduct(id){
     let products = JSON.parse(localStorage.getItem('products'));
     return products.find(product => product.id === id);
 }
//guardando el carrito
static saveCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart));
}
static getCart(){
    return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
}
}

//Que arranque la cosa..
document.addEventListener("DOMContentLoaded", ()=>{
    const showProducts = new Display();
    const products = new Products();

    showProducts.setupAPP();

    products.getProducts().then(products => {
        showProducts.displayProducts(products);
        Storage.saveProducts(products);
    }).then(()=>{
        showProducts.getBagButtons();
        showProducts.cartLogic()
    });       
});

//completar pedido
function checkout(){
    alert('Gracias por tu compra!');
}



//Saludo del inicio
function showGreating(){

    let date = new Date();
    let realHour = date.getHours();
    
    if(realHour >= 6 && realHour < 12){
        message = 'Buen Día!';
    } else if(realHour >= 12 && realHour < 20){
        message = 'Buenas Tardes!';
    } else {
        message = 'Buenas Noches!';
    }
  
    document.getElementById('greeting').innerHTML = message;
    }


  