const PRODUCTS=[
{id:"froggy",name:"FROGGY",description:"Всегда серьёзен. Даже когда не надо.",price:7.99,emoji:"🐸",rarity:"common",label:"Common",color:"#dff5ca"},
{id:"potato",name:"POTATO",description:"Что? Просто картошка.",price:7.99,emoji:"🥔",rarity:"common",label:"Common",color:"#ffe8bd"},
{id:"axolotl",name:"AXOLOTL",description:"Всегда рад тебя видеть.",price:8.99,emoji:"🦎",rarity:"rare",label:"Rare",color:"#ffd9e8"},
{id:"ducky",name:"DUCKY",description:"Очень важная утка.",price:7.99,emoji:"🦆",rarity:"common",label:"Common",color:"#d9edfa"},
{id:"sleepy",name:"SLEEPY",description:"Уже устал от твоих планов.",price:8.99,emoji:"🐱",rarity:"rare",label:"Rare",color:"#e8e0fa"},
{id:"sharky",name:"SHARKY",description:"Маленькая акула. Большой вайб.",price:9.99,emoji:"🦈",rarity:"limited",label:"Limited",color:"#d5e8ed"}];
const KEY="meme-buddies-cart-v1", $=id=>document.getElementById(id), euro=n=>new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(n);
let cart={};try{cart=JSON.parse(localStorage.getItem(KEY)||"{}")||{}}catch{cart={}}
let filter="all",query="",toastTimer;
function save(){localStorage.setItem(KEY,JSON.stringify(cart))}
function renderProducts(){const list=PRODUCTS.filter(p=>(filter==="all"||p.rarity===filter)&&(p.name+" "+p.description).toLowerCase().includes(query));$("productGrid").innerHTML=list.length?list.map(p=>'<article class="product-card"><div class="product-visual" style="background:'+p.color+'"><span class="rarity rarity-'+p.rarity+'">'+p.label+'</span><span class="product-emoji" role="img" aria-label="'+p.name+'">'+p.emoji+'</span></div><div class="product-info"><div class="product-titleline"><h3>'+p.name+'</h3><span class="product-price">'+euro(p.price)+'</span></div><p class="product-desc">'+p.description+'</p><button class="add-button" data-add="'+p.id+'">＋ Добавить в корзину</button></div></article>').join(""):'<div class="empty-results">Никого не нашли. Попробуй другой запрос ✦</div>'}
function renderCart(){const count=Object.values(cart).reduce((a,b)=>a+b,0);$("cartCount").textContent=count;const chosen=PRODUCTS.filter(p=>cart[p.id]>0);$("cartItems").innerHTML=chosen.length?chosen.map(p=>'<div class="cart-row"><div><b>'+p.emoji+' '+p.name+'</b><small>'+euro(p.price)+' за штуку</small></div><div class="quantity"><button data-change="'+p.id+'" data-delta="-1" aria-label="Уменьшить">−</button><b>'+cart[p.id]+'</b><button data-change="'+p.id+'" data-delta="1" aria-label="Увеличить">＋</button></div></div>').join(""):'<p class="empty-results">Корзина пока пуста. Твой Buddy уже ждёт! 🐸</p>';$("cartTotal").textContent=euro(PRODUCTS.reduce((s,p)=>s+p.price*(cart[p.id]||0),0))}
function toast(text){$("toast").textContent=text;$("toast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2200)}
function add(id){cart[id]=(cart[id]||0)+1;save();renderCart();toast("Добавлено в корзину ✦")}
function change(id,delta){cart[id]=(cart[id]||0)+delta;if(cart[id]<=0)delete cart[id];save();renderCart()}
function openCart(){$("cartBackdrop").hidden=false;document.body.classList.add("cart-open")}
function closeCart(){$("cartBackdrop").hidden=true;document.body.classList.remove("cart-open")}
$("productGrid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)add(b.dataset.add)});
$("cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-change]");if(b)change(b.dataset.change,Number(b.dataset.delta))});
$("openCart").addEventListener("click",openCart);$("closeCart").addEventListener("click",closeCart);$("cartBackdrop").addEventListener("click",e=>{if(e.target===$("cartBackdrop"))closeCart()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("cartBackdrop").hidden)closeCart()});
$("searchInput").addEventListener("input",e=>{query=e.target.value.trim().toLowerCase();renderProducts()});
document.querySelector(".filters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;filter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts()});
$("checkoutButton").addEventListener("click",()=>toast("Оформление заказов скоро появится ✦"));
$("menuToggle").addEventListener("click",()=>{const open=$("navLinks").classList.toggle("open");$("menuToggle").setAttribute("aria-expanded",String(open));$("menuToggle").textContent=open?"×":"☰"});
$("navLinks").addEventListener("click",e=>{if(e.target.closest("a")){$("navLinks").classList.remove("open");$("menuToggle").setAttribute("aria-expanded","false");$("menuToggle").textContent="☰"}});
$("year").textContent=new Date().getFullYear();renderProducts();renderCart();