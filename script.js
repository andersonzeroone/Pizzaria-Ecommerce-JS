const  selector = (el) => document.querySelector(el); 
const  selectorAll = (el) => document.querySelectorAll(el); 
let cart = [];
let modalKey = 0;

let modalCount = 1;

pizzaJson.map((item, index) => {
    
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2).replace('.',',')}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();

        let  key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;
        console.log(pizzaJson[key]);
        
        selector('.pizzaBig img').src = pizzaJson[key].img;
        selector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        selector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        selector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;


        selector('.pizzaInfo--size.selected').classList.remove('selected');

        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) =>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            
            size.querySelector('span').innerHTML= pizzaJson[key].sizes[sizeIndex];
        })
        
       
        selector('.pizzaInfo--qt').innerHTML = modalCount;

        selector('.pizzaWindowArea').style.opacity = 0;
        selector('.pizzaWindowArea').style.display = 'flex';

        setTimeout( () =>{
            selector('.pizzaWindowArea').style.opacity = 1;
        }, 200);
     })

    selector('.pizza-area').appendChild(pizzaItem);    
})

function handleCloseModal(){
    selector('.pizzaWindowArea').style.opacity = 0;
    setTimeout( () =>{
        selector('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

selectorAll('.pizzaInfo--cancelButton,.pizzaInfo--cancelMobileButton').forEach((item) =>{
        item.addEventListener('click',handleCloseModal);
    })

selector('.pizzaInfo--qtmais').addEventListener('click',() =>{
    modalCount++;
    selector('.pizzaInfo--qt').innerHTML = modalCount;
})

selector('.pizzaInfo--qtmenos').addEventListener('click',() =>{
    if( modalCount > 1){
        modalCount--;
        selector('.pizzaInfo--qt').innerHTML = modalCount;
   }
    
})

selectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener( 'click', (e) => {
        selector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
})

selector('.pizzaInfo--addButton').addEventListener('click', ()=> {
    let size = parseInt(selector('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item) => item.identifier == identifier);

    if( key > -1){
        cart[key].quant += modalCount;
    }else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            quant: modalCount
        });
    }
    handleCloseModal();

    upDateCart();
})


selector('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0){
        selector('aside').style.left = '0';
    }
})

selector('.menu-closer').addEventListener('click', () => {
    selector('aside').style.left = '100vw';
})

function upDateCart(){
    selector('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0){
        selector('aside').classList.add('show');

        selector('.cart').innerHTML = '';

        let subTotal = 0;
        let desconto = 0;
        let total = 0;

        for( let i in cart ){
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            
            subTotal += pizzaItem.price * cart[i].quant;
           
            let cartItem = selector('.models .cart--item').cloneNode(true);
            let pizzaUniprice = pizzaItem.price
            let pizzaSizename;
            switch(cart[i].size){
                case 0:
                    pizzaSizename = 'P';
                    break;
            
                case 1:
                    pizzaSizename = 'M';
                     break;
                case 2:
                    pizzaSizename = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name}- ${pizzaSizename} Uni.: ${pizzaUniprice}`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].quant;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
                if( cart[i].quant > 1){
                    cart[i].quant--;
                    
                }else{
                    cart.splice(i,1);
                }
                 upDateCart()
            })

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{

                cart[i].quant++;
                upDateCart()
            })

            selector('.cart').appendChild(cartItem);
        }

        desconto = subTotal * 0.1;
        total = subTotal - desconto;

        selector('.subtotal span:last-child').innerHTML = `$R ${subTotal.toFixed(2)}`;
        selector('.desconto span:last-child').innerHTML = `$R ${desconto.toFixed(2)}`;
        selector('.total span:last-child').innerHTML = `$R ${total.toFixed(2)}`;

    }else{
        selector('aside').classList.remove('show');
        selector('aside').style.left =  '100vw';
    }
}