// Archivo js para la práctica 2
//********************************

var PrimeraVez = true;  //Para saber si ya hemos ejecutado esta práctica en ese navegador
var Loge; //para saber si está logeado
var Personas = new Array();
var Productos = new Array();
var Entidades = new Array();


function ArrancaSesion(){
   ComprobarPrimeraVez();

   DibujaTablaIndice();
   Loge=localStorage.getItem("EstaLogueado");
   
   if (Loge=='SI'){
     Logueado();
   } 
}

function ComprobarPrimeraVez() {
    if (localStorage.getItem('PrimeraV') !== null) {
        Personas=JSON.parse(localStorage.getItem("GuardaPersonas"));
        Productos=JSON.parse(localStorage.getItem("GuardaProductos"));
        Entidades=JSON.parse(localStorage.getItem("GuardaEntidades"));
        //alert("Cargados");

        } else{
        //Creo las personas, productos y entidades iniciales
        //alert("pasa por primera vez");
        Productos[0]= CreaProducto("SGML","https://tse2.mm.bing.net/th?id=OIP.24lQGkRkrgzIKNP7lk6XGwAAAA&pid=Api");
        Productos[1]= CreaProducto("XML","https://tse2.mm.bing.net/th?id=OIP.WJ4rMoFvm0wXnKsdEw_-9AHaHa&pid=Api");
        Productos[2]= CreaProducto("HTML","https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/300px-HTML5_logo_and_wordmark.svg.png");
        Productos[3]= CreaProducto("HTTP","https://www.fastweb.it/var/storage_feeds/CMS/articoli/39e/39eb35d529deffbeeba387aa77e0bba1/640x360.jpg");
        Productos[4]= CreaProducto("CSS","https://tse4.mm.bing.net/th?id=OIP.NyR3eLD83NC7UvBsOG1i4wAAAA&pid=Api");
        Productos[5]= CreaProducto("JavaScript","https://tse3.mm.bing.net/th?id=OIP.ViV1OEesGeL1Qcjvf0HhJgHaIB&pid=Api");
        Personas [0]= CreaPersona("Vannevar Bush","https://images.fineartamerica.com/images-medium-large-5/vannevar-bush-emilio-segre-visual-archivesamerican-institute-of-physics.jpg");
        Personas [1]= CreaPersona("Tim Berners-Lee","https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sir_Tim_Berners-Lee_%28cropped%29.jpg/330px-Sir_Tim_Berners-Lee_%28cropped%29.jpg");
        Entidades[0]= CreaEntidad ("IBM","https://tse3.mm.bing.net/th?id=OIP.kgXNJpthY3bkmtFlmCIRsQHaDX&pid=Api");
        Entidades[1]= CreaEntidad ("CERM","https://tse1.mm.bing.net/th?id=OIP.RQ0G2QmRoIPHwENuxRXaUwHaHc&pid=Api");
        Entidades[2]= CreaEntidad ("W3C","https://tse2.mm.bing.net/th?id=OIP.O5QC22bpE3_KjkeAFlQDaAHaD8&pid=Api");
        //Voy a rellenar todos los campos de HTML
        Productos[2].FechaNaci="29 de octubre de 1991";
        Productos[2].urlWiki="https://es.wikipedia.org/wiki/HTML";
        Productos[2].PeronasParticipantes="Tim Berners-Lee * Dan Connolly * Vannevar Bush";
        Productos[2].EntidadesParticipantes="W3C * CERN";
        // y todos los datos de Tim
        Personas [1].FechaNaci="8 de junio de 1955";
        Personas [1].urlWiki="https://es.wikipedia.org/wiki/Tim_Berners-Lee";

        // y los guardo en localStorage, para guardar una matriz, utilizo JSON
        localStorage.setItem("GuardaPersonas", JSON.stringify(Personas));
        localStorage.setItem("GuardaProductos", JSON.stringify(Productos));
        localStorage.setItem("GuardaEntidades", JSON.stringify(Entidades));
        PrimeraVez=false;
        localStorage.setItem("PrimeraV",PrimeraVez);
        
        } 
}

function VisibilidadControlID (ConID, visible){
    let con= document.getElementById(ConID);
    if (visible==true) {
           con.removeAttribute("hidden");
        }else{
           con.setAttribute("hidden", "hidden");
        }
}

function ValorControlID (ConID){
    let con= document.getElementById(ConID);
    return con.value
}

function Loguearse() {
// con los tres usuarios de la práctica
   let correcto=false;
   if (ValorControlID('usuario')=='x' && ValorControlID('pass')=='x'){
        correcto=true;
        Logueado();      
    }
   if (ValorControlID('usuario')=='y' && ValorControlID('pass')=='y'){
        correcto=true;
        Logueado();      
    }
   if (ValorControlID('usuario')=='z' && ValorControlID('pass')=='z'){
        correcto=true;
        Logueado();      
    }

    if(correcto==false){
        alert("usuario o contraseña incorrecto");
        let con=document.getElementById('usuario');
        con.value='';
        con= document.getElementById('pass');
        con.value='';
        
    }
    
}

function Logueado(){
    Loge='SI';
    localStorage.setItem("EstaLogueado",Loge);
    //acciones a tomar en caso de que el usuario se loguee
   
    let ClaseLogeado=document.getElementsByClassName('logeado');
    for(let i=0; i< ClaseLogeado.length;i++){
        ClaseLogeado[i].removeAttribute("hidden");
    }
    let ClaseSinLogeado=document.getElementsByClassName('Sinlogeado');
    for(let i=0; i< ClaseSinLogeado.length;i++){
        ClaseSinLogeado[i].setAttribute("hidden", "hidden");
    } 

   // Loge=1;
   // alert(Loge);
}
function DesLoguearse(){
    Loge='NO';
    localStorage.setItem("EstaLogueado",Loge);
    //acciones a tomar en caso de que el usuario se logee
    let con=document.getElementById('usuario');
    con.value='';
    con= document.getElementById('pass');
    con.value=''; 

    let ClaseLogeado=document.getElementsByClassName('logeado');
    for(let i=0; i< ClaseLogeado.length;i++){
        ClaseLogeado[i].setAttribute("hidden", "hidden");
    }
    let ClaseSinLogeado=document.getElementsByClassName('Sinlogeado');
    for(let i=0; i< ClaseSinLogeado.length;i++){
        ClaseSinLogeado[i].removeAttribute("hidden");
    }     

}


function CreaPersona (nombre, foto){
    return {
        nombre: nombre,
        FechaNaci :"sin datos",
        FechaMuer :"sin datos",
        urlFoto : foto,
        urlWiki: "sin datos"
        };
}
function CreaProducto (nombre,  foto){
    return {
        nombre: nombre,
        FechaNaci :"sin datos",
        FechaMuer :"sin datos",
        urlFoto :  foto,
        urlWiki: "sin datos",
        PeronasParticipantes: "sin datos",
        EntidadesParticipantes: "sin datos"
        };
}
function CreaEntidad (nombre, foto){
    return {
        nombre: nombre,
        FechaNaci :"sin datos",
        FechaMuer :"sin datos",
        urlFoto :  foto,
        urlWiki: "sin datos",
        PeronasParticipantes: "sin datos"
        };
}

function DameMaxLongi() {
// Máxima longitud de las matrices de personas, entidades y productos
  let Max=new Array();
  Max [0]= Personas.length;
  Max [1]= Productos.length;
  Max [2]= Entidades.length;
  Max.sort((a,b)=>a-b);
  return Max[2];
}


function DibujaTablaIndice() {
    let hasta = DameMaxLongi();
    let codigo ='<tbody>'
 
    
    for ( let i=0; i< hasta; i++) {

         if (Productos.length>i){       
            codigo=codigo + '<tr><td><h2> <a href=\"MostrarElementos.html\" onclick=\"Ir_a(1,'+i+');\">'+
            '<img class=\"ImgIndex\" width=\"25\" height=\"25\" alt=\"foto\" src=\"'+Productos[i].urlFoto+'\"/>&nbsp;' +
            Productos[i].nombre+'&nbsp;</a><input class=\"logeado" id=\"B'+ Productos[i].nombre+ '\" hidden=\"hidden\" type=\"button\" value=\"Borrar\" onclick=\"Borra(1,'+i+');\" /> </h2> </td>';
         }else{
            codigo=codigo+'<tr><td></td>';
            }
         if (Personas.length>i){ 
            codigo=codigo +'<td><h2> <a href=\"MostrarElementos.html\" onclick=\"Ir_a(2,'+i+');\">'+
            '<img class=\"ImgIndex\" width=\"25\" height=\"25\" alt=\"foto\" src=\"'+Personas[i].urlFoto+'\"/>&nbsp;' +
            Personas[i].nombre+'&nbsp;</a><input class=\"logeado" id=\"B'+Personas[i].nombre+'\" hidden=\"hidden\" type=\"button\" value=\"Borrar\" onclick=\"Borra(2,'+i+');\" /></h2> </td>';
         }else{
            codigo=codigo +'<td></td>';
            }

         if (Entidades.length>i){
            codigo=codigo +'<td><h2> <a href=\"MostrarElementos.html\" onclick=\"Ir_a(3,'+i+');\"> '+
            '<img class=\"ImgIndex\" width=\"25\" height=\"25\" alt=\"foto\" src=\"'+Entidades[i].urlFoto+'\"/>&nbsp;' +
            Entidades[i].nombre+'&nbsp;</a><input class=\"logeado" id=\"B'+Entidades[i].nombre+'\" hidden=\"hidden\" type=\"button\" value=\"Borrar\"onclick=\"Borra(3,'+i+');\" /> </h2></td></tr>';
          }else{
            codigo=codigo +'<td></td></tr>';
            }           
    }

    codigo=codigo + '<tr><td style=\"text-align: center\"> <input class=\"logeado" id=\"CrearProducto\" hidden=\"hidden\" type=\"button\" value=\"Crear Producto\" onclick=\"Ir_a_CreaEdita(1);\" /> </td>'+
    '<td style=\"text-align: center\"> <input class=\"logeado" id=\"CrearPersona\" hidden=\"hidden\" type=\"button\" value=\"Crear Persona\" onclick=\"Ir_a_CreaEdita(2);\"/> </td>'+
    '<td style=\"text-align: center\"> <input class=\"logeado" id=\"CrearEntidad\" hidden=\"hidden\" type=\"button\" value=\"Crear Entidad\" onclick=\"Ir_a_CreaEdita(3);\" /> </td> </tr>';
    codigo=codigo +'</tbody>';

    document.getElementById("TI").innerHTML=codigo;
    //alert(Loge);
                        
}

function Borra(tipo, indice){
     // tipo me dice de que matriz borro el indice, si es 1 entonces de Productos, 2 de Personas, 3 de entidades
     // indice me dice el indice que borro de la matriz
     //alert(indice);
   
     if (tipo==1){
        Productos.splice(indice,1);
        localStorage.setItem("GuardaProductos", JSON.stringify(Productos));
     }
     if (tipo==2){
        Personas.splice(indice,1);
        localStorage.setItem("GuardaPersonas", JSON.stringify(Personas));
     }
     if (tipo==3){
        Entidades.splice(indice,1);
        localStorage.setItem("GuardaEntidades", JSON.stringify(Entidades));
     }

     location.reload(true);
     
}

function Ir_a(tipo, indice){
     //Datos para la página que muestra los datos
     // tipo me dice: si es 1 entonces de Productos, 2 de Personas, 3 de entidades
     // indice me dice el indice  de la matriz
     //alert(indice);
     //Guardamos tipo e indice para recogerlo en la página a la que iremos
     localStorage.setItem("GuardaTipo",tipo);
     localStorage.setItem("GuardaIndice",indice);
     //cuando termina esta función, hace el href de <a>
    // window.location="BernerLee.html";
     
}
function Ir_a_CreaEdita(tipo){
     // tipo me dice: si es 1 entonces de Productos, 2 de Personas, 3 de entidades
     // en
     //alert(indice);
     //Guardamos tipo y forma para recogerlo en la página a la que iremos a Crear un elemento
     localStorage.setItem("GuardaTipoCrea",tipo);
     let forma= "Crea";
     localStorage.setItem("GuardaformaPagina",forma);
     window.location="Crea_Edita.html";
     
}

// *****************aunque no es independiente, aqui empiezan las funciones de Crea_Edita.html********************
function PaginaCreaEdita(){
    let forma= localStorage.getItem("GuardaformaPagina"); //para saber si es crear o es editar
    let tipoCrea; //para saber si es persona, producto o entidad lo que creamos
    let tipoEdita;//para saber si es persona, producto o entidad lo que editamos
    let indice; //indice de la matriz que editamos
    let vartexto;
    let varApoyo;
    let varElemento;

    if (forma=="Crea"){
        tipoCrea=localStorage.getItem("GuardaTipoCrea"); //para saber si es persona, producto o entidad
        if (tipoCrea==1){
            varApoyo="Formulario para CREAR producto";
            }
        if (tipoCrea==2){
            varApoyo="Formulario para CREAR persona";
            }
        if (tipoCrea==3){
            varApoyo="Formulario para CREAR entidad";
            }

        vartexto='<caption><h3>'+varApoyo+'</h3><caption> <tbody>'+
        '<tr><td class=\"td1EdiCrea\"> Nombre (obligatorio):</td>'+
        '<td> <input id=\"Text1\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>'+

         '<tr><td class=\"td1EdiCrea\"> Fecha de nacimiento, creación, …​:</td>'+
        '<td> <input id=\"Text2\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>'+

        '<tr><td class=\"td1EdiCrea\"> Fecha de defunción, utilidad, …​:</td>'+
        '<td> <input id=\"Text3\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>'+

        '<tr><td class=\"td1EdiCrea\"> Imagen, retrato, logo, …​, url a la imagen (Obligatorio)​:</td>'+
        '<td> <input id=\"Text4\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>'+

        '<tr><td class=\"td1EdiCrea\"> Wiki, url al elemento​:</td>'+
        '<td> <input id=\"Text5\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>';
        if (tipoCrea==2){
            vartexto=vartexto+'</tbody>';
        }
        if (tipoCrea==1){
            vartexto=vartexto+'<tr><td class=\"td1EdiCrea\"> Personas que han participado en su desarrollo​:</td>'+
            '<td> <input id=\"Text6\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>'+

            '<tr><td class=\"td1EdiCrea\"> Entidades que han participado en su desarrollo:</td>'+
            '<td> <input id=\"Text7\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>'+
            '</tbody>';
        }
        if (tipoCrea==3){
            vartexto=vartexto+'<tr><td class=\"td1EdiCrea\"> Personas que han participado en su desarrollo​:</td>'+
            '<td> <input id=\"Text6\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>'+

            '</tbody>';
        }


      } else{  
        
        tipoEdita=localStorage.getItem("GuardaTipo");
        indice=localStorage.getItem("GuardaIndice");

        if (tipoEdita==1){
            Productos=JSON.parse(localStorage.getItem("GuardaProductos"));
            varApoyo="Formulario para EDITAR producto";
            varElemento=Productos[indice];
            }
        if (tipoEdita==2){
            Personas=JSON.parse(localStorage.getItem("GuardaPersonas"));
            varApoyo="Formulario para EDITAR persona";
            varElemento=Personas[indice];
            }
        if (tipoEdita==3){
            Entidades=JSON.parse(localStorage.getItem("GuardaEntidades"));
            varApoyo="Formulario para EDITAR entidad";
            varElemento=Entidades[indice];
            } 
                  
        vartexto='<caption><h3>'+varApoyo+'</h3><caption> <tbody>'+
        '<tr><td class=\"td1EdiCrea\"> Nombre (obligatorio):</td>'+
        '<td> <input id=\"Text1\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.nombre+'\"/></td></tr>'+

        '<tr><td class=\"td1EdiCrea\"> Fecha de nacimiento, creación, …​:</td>'+
        '<td> <input id=\"Text2\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.FechaNaci+'\"/></td></tr>'+

        '<tr><td class=\"td1EdiCrea\"> Fecha de defunción, utilidad, …​:</td>'+
        '<td> <input id=\"Text3\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.FechaMuer+'\"/></td></tr>'+

        '<tr><td class=\"td1EdiCrea\"> Imagen, retrato, logo, …​, url a la imagen (Obligatorio)​:</td>'+
        '<td> <input id=\"Text4\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.urlFoto+'\"/></td></tr>'+

        '<tr><td class=\"td1EdiCrea\"> Wiki, url al elemento​:</td>'+
        '<td> <input id=\"Text5\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.urlWiki+'\"/></td></tr>';
        if (tipoEdita==2){
            vartexto=vartexto+'</tbody>';
        }
        if (tipoEdita==1){
            vartexto=vartexto+'<tr><td class=\"td1EdiCrea\"> Personas que han participado en su desarrollo​:</td>'+
            '<td> <input id=\"Text6\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.PeronasParticipantes+'\"/></td></tr>'+

            '<tr><td class=\"td1EdiCrea\"> Entidades que han participado en su desarrollo:</td>'+
            '<td> <input id=\"Text7\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.EntidadesParticipantes+'\"/></td></tr>'+
            '</tbody>';
        }
        if (tipoEdita==3){
            vartexto=vartexto+'<tr><td class=\"td1EdiCrea\"> Personas que han participado en su desarrollo​:</td>'+
            '<td> <input id=\"Text6\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.PeronasParticipantes+'\"/></td></tr>'+

            '</tbody>';
         }    


    }
    document.getElementById("TablaCreaEdita").innerHTML=vartexto;
}

function CompruebaGuardar(){
    if (ValorControlID("Text1")=="" || ValorControlID("Text4")==""){
        alert("campos obligatorios sin rellenar");
    }else{
        GuardaElemento();
    }
}

function GuardaElemento(){
    let forma= localStorage.getItem("GuardaformaPagina"); //para saber si es crear o es editar
    let tipoCrea; //para saber si es persona, producto o entidad lo que creamos
    let tipoEdita;//para saber si es persona, producto o entidad lo que editamos
    let indice; //indice de la matriz que editamos
    let vartexto;
    let varApoyo;
    let varElemento;
    let longi;
    if (forma=="Crea"){
        
        tipoCrea=localStorage.getItem("GuardaTipoCrea"); //para saber si es persona, producto o entidad
        
        if (tipoCrea==1){
           varElemento=CreaProducto(ValorControlID("Text1"),ValorControlID("Text4"));
           if(ValorControlID("Text2")==""){
               varElemento.FechaNaci="sin datos";
            }else{
               varElemento.FechaNaci=ValorControlID("Text2");
            }
           if(ValorControlID("Text3")==""){
               varElemento.FechaMuer="sin datos";
            }else{
               varElemento.FechaMuer=ValorControlID("Text3");
            }
           if(ValorControlID("Text5")==""){
               varElemento.urlWiki="sin datos";
            }else{
               varElemento.urlWiki=ValorControlID("Text5");
            }
           if(ValorControlID("Text6")==""){
               varElemento.PeronasParticipantes="sin datos";
            }else{
               varElemento.PeronasParticipantes=ValorControlID("Text6");
            }
           if(ValorControlID("Text7")==""){
               varElemento.EntidadesParticipantes="sin datos";
            }else{
               varElemento.EntidadesParticipantes=ValorControlID("Text5");
            }

           Productos=JSON.parse(localStorage.getItem("GuardaProductos"));
           longi=Productos.push(varElemento);//añade a la matriz
           localStorage.setItem("GuardaProductos", JSON.stringify(Productos));
         }
         if (tipoCrea==2){
           varElemento=CreaPersona(ValorControlID("Text1"),ValorControlID("Text4"));
           
            if(ValorControlID("Text2")==""){
               varElemento.FechaNaci="sin datos";
            }else{
               varElemento.FechaNaci=ValorControlID("Text2");
            }
           if(ValorControlID("Text3")==""){
               varElemento.FechaMuer="sin datos";
            }else{
               varElemento.FechaMuer=ValorControlID("Text3");
            }
           if(ValorControlID("Text5")==""){
               varElemento.urlWiki="sin datos";
            }else{
               varElemento.urlWiki=ValorControlID("Text5");
            }
           Personas=JSON.parse(localStorage.getItem("GuardaPersonas"));
           longi=Personas.push(varElemento);
           localStorage.setItem("GuardaPersonas", JSON.stringify(Personas));
        }
        if (tipoCrea==3){
           varElemento=CreaEntidad(ValorControlID("Text1"),ValorControlID("Text4"));
           if(ValorControlID("Text2")==""){
               varElemento.FechaNaci="sin datos";
            }else{
               varElemento.FechaNaci=ValorControlID("Text2");
            }
           if(ValorControlID("Text3")==""){
               varElemento.FechaMuer="sin datos";
            }else{
               varElemento.FechaMuer=ValorControlID("Text3");
            }
           if(ValorControlID("Text5")==""){
               varElemento.urlWiki="sin datos";
            }else{
               varElemento.urlWiki=ValorControlID("Text5");
            }
           if(ValorControlID("Text6")==""){
               varElemento.PeronasParticipantes="sin datos";
            }else{
               varElemento.PeronasParticipantes=ValorControlID("Text6");
            }

           Entidades=JSON.parse(localStorage.getItem("GuardaEntidades"));
           longi=Entidades.push(varElemento);
           localStorage.setItem("GuardaEntidades", JSON.stringify(Entidades));         

       }
       alert("elemento creado correctamente");
    }else {
        tipoEdita=localStorage.getItem("GuardaTipo");
        indice=localStorage.getItem("GuardaIndice");
        if (tipoEdita==1){
           Productos=JSON.parse(localStorage.getItem("GuardaProductos"));
           varElemento=Productos[indice];

           varElemento.nombre=ValorControlID("Text1");
           varElemento.urlFoto=ValorControlID("Text4");

           if(ValorControlID("Text2")==""){
               varElemento.FechaNaci="sin datos";
            }else{
               varElemento.FechaNaci=ValorControlID("Text2");
            }
           if(ValorControlID("Text3")==""){
               varElemento.FechaMuer="sin datos";
            }else{
               varElemento.FechaMuer=ValorControlID("Text3");
            }
           if(ValorControlID("Text5")==""){
               varElemento.urlWiki="sin datos";
            }else{
               varElemento.urlWiki=ValorControlID("Text5");
            }
           if(ValorControlID("Text6")==""){
               varElemento.PeronasParticipantes="sin datos";
            }else{
               varElemento.PeronasParticipantes=ValorControlID("Text6");
            }
           if(ValorControlID("Text7")==""){
               varElemento.EntidadesParticipantes="sin datos";
            }else{
               varElemento.EntidadesParticipantes=ValorControlID("Text5");
            }

           localStorage.setItem("GuardaProductos", JSON.stringify(Productos));
         }
         if (tipoEdita==2){
           Personas=JSON.parse(localStorage.getItem("GuardaPersonas"));
           varElemento=Personas[indice];

           varElemento.nombre=ValorControlID("Text1");
           varElemento.urlFoto=ValorControlID("Text4");
           
            if(ValorControlID("Text2")==""){
               varElemento.FechaNaci="sin datos";
            }else{
               varElemento.FechaNaci=ValorControlID("Text2");
            }
           if(ValorControlID("Text3")==""){
               varElemento.FechaMuer="sin datos";
            }else{
               varElemento.FechaMuer=ValorControlID("Text3");
            }
           if(ValorControlID("Text5")==""){
               varElemento.urlWiki="sin datos";
            }else{
               varElemento.urlWiki=ValorControlID("Text5");
            }

           localStorage.setItem("GuardaPersonas", JSON.stringify(Personas));
        }
        if (tipoEdita==3){
           Entidades=JSON.parse(localStorage.getItem("GuardaEntidades"));
           varElemento=Entidades[indice];

           varElemento.nombre=ValorControlID("Text1");
           varElemento.urlFoto=ValorControlID("Text4");

           if(ValorControlID("Text2")==""){
               varElemento.FechaNaci="sin datos";
            }else{
               varElemento.FechaNaci=ValorControlID("Text2");
            }
           if(ValorControlID("Text3")==""){
               varElemento.FechaMuer="sin datos";
            }else{
               varElemento.FechaMuer=ValorControlID("Text3");
            }
           if(ValorControlID("Text5")==""){
               varElemento.urlWiki="sin datos";
            }else{
               varElemento.urlWiki=ValorControlID("Text5");
            }
           if(ValorControlID("Text6")==""){
               varElemento.PeronasParticipantes="sin datos";
            }else{
               varElemento.PeronasParticipantes=ValorControlID("Text6");
            }
           localStorage.setItem("GuardaEntidades", JSON.stringify(Entidades));         

       }
       alert("elemento actualizado correctamente");

    }
}


// *****************aunque no es independiente, aqui empiezan las funciones de MostrarElementos.html********************

function PaginaMostrarElementos(){
    let tipoEdita=localStorage.getItem("GuardaTipo");//para saber si es persona, producto o entidad lo que editamos
    let indice=localStorage.getItem("GuardaIndice"); //indice de la matriz que editamos
    let vartexto;
    let varApoyo;
    let varElemento;

   Loge=localStorage.getItem("EstaLogueado");

   if (Loge=='SI'){
      VisibilidadControlID ("Bedita", true);
      }else{
      VisibilidadControlID ("Bedita", false);
   } 
    
            
        
        
    if (tipoEdita==1){
          Productos=JSON.parse(localStorage.getItem("GuardaProductos"));
          varElemento=Productos[indice];
     }
    if (tipoEdita==2){
        Personas=JSON.parse(localStorage.getItem("GuardaPersonas"));
        varElemento=Personas[indice];
     }
    if (tipoEdita==3){
        Entidades=JSON.parse(localStorage.getItem("GuardaEntidades"));
        varElemento=Entidades[indice];
     }

     vartexto= '<tr><td class=\"Ancho1\">	<section><h2>'+ varElemento.nombre+'</h2>'+
               '<p>'+ varElemento.FechaNaci+'</p>';
      if (varElemento.FechaMuer!="sin datos"){
            vartexto=vartexto+'<p>--</p><p>'+ varElemento.FechaMuer+'</p>';

        }
      vartexto=vartexto+'<article><img src=\"'+varElemento.urlFoto+'\" alt=\"'+ varElemento.nombre+'\" width=\"60%\" /></article></section></td>'+
      		'<td class=\"Ancho2\"><section><article>'+
			'<iframe height=\"500px\" width=\"100%\" src=\"'+ varElemento.urlWiki+'\" name='+ varElemento.nombre+'></iframe></article></section></td></tr>';
     
     
     document.getElementById("TablaMuestra").innerHTML=vartexto;
     
     vartexto="";
      if (tipoEdita==1){
          vartexto='<tr><td><i>Personas participantes en su desarrollo: </i><b>'+varElemento.PeronasParticipantes+'</b></td></tr>'+
          '<tr><td><i>Entidades participantes en su desarrollo: </i><b>'+varElemento.EntidadesParticipantes+'</b></td></tr>';
     }
    if (tipoEdita==2){
        vartexto='<tr><td>&nbsp;</td></tr>';
     }
    if (tipoEdita==3){
        vartexto='<tr><td><i>Personas participantes en su desarrollo: </i><b>'+varElemento.PeronasParticipantes+'</b></td></tr>';
     }
    document.getElementById("PieDeMostrar").innerHTML=vartexto;
      
}

function PasarAEdicion(){
     let forma= "Edita";
     localStorage.setItem("GuardaformaPagina",forma);
     window.location="Crea_Edita.html";
}