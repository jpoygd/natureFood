function Producto(img, nombreDelItem, precioPorKiloDelItem){
    this.imagen = img;
    this.nombre = nombreDelItem;
    this.textoPrecioPorKilo = "Precio por kilo $";
    this.precioPorKilo = precioPorKiloDelItem;
   
    
    this.tipoDeProducto = function(){ return this.nombre;}
    this.precioProducto = function(){ return this.textoPrecioPorKilo + this.precioPorKilo;}
    
  }
  
  let bananas = new Producto("imagen","Banana", 80);
  let frutillas = new Producto("imagen","Frutilla", 360);
  let kiwis = new Producto("imagen","Kiwi", 240);
  let naranjas = new Producto("imagen","Naranja Ombligo", 46);
  let duraznos = new Producto("imagen","Durazno", 250);
  let manzanasRojas = new Producto("imagen","Manzana Deliciosa", 170);
  let pomelosRosados = new Producto("imagen","Pomelo Rosado", 260);
  let limones = new Producto("imagen","Limón", 95);

  console.log(bananas.tipoDeProducto() + bananas.precioProducto());

  //lista de productos comprados

  let productosSeleccionados = [bananas, frutillas, naranjas, limones];