// Archivo js para la práctica final
//********************************


//var PrimeraVez = true;  //Para saber si ya hemos ejecutado esta práctica en ese navegador
var Loge; //para saber si está logeado
var TipoLoge;//para saber si es reader o writer
var NombreUsu; //para saber rápido 
var Personas = new Array();
var Productos = new Array();
var Entidades = new Array();
var Usuarios = new Array();

//var UsuLogeado; //esta variable solo la cargamos en Regis_Edita_Usuarios, para facilitar el trabajo en toda esta pagina


function ArrancaSesion(){
   //ComprobarPrimeraVez();

   //DibujaTablaIndice();
   Loge=localStorage.getItem("EstaLogueado");

   
   if (Loge=='SI' &&  ProbarAutorizacionServidor()==true){
         TipoLoge= localStorage.getItem("Rol");
         NombreUsu= localStorage.getItem("NomUsu");
         Logueado(NombreUsu,TipoLoge);
   } 
}

function ProbarAutorizacionServidor(){
    // va a mirar si tengo autorización del servidor o ya ha expirado. Para evitar que Logue sea SI de algún dia anterior, pues se guarda en localstorage
    let request = new XMLHttpRequest();
    request.open('GET', 'http://127.0.0.1:8000/api/v1/users', false);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
    request.send();
    
    if (request.status== 401){
        return false;
    }else{
        return true;
    }
   
}

function CargaMatrices (tipo){
           
    if(tipo=="todas"){
        CargaMatrices("usuario");
        CargaMatrices("producto");
        CargaMatrices("persona");
        CargaMatrices("entidad");
        return;
    }

    let direccion;
    let indice=0;
    let data;

    switch (tipo) {
        case "usuario":
           direccion='http://127.0.0.1:8000/api/v1/users';
           Usuarios.length=0;
           break;
        case "producto":
           direccion='http://127.0.0.1:8000/api/v1/products?order=id&ordering=ASC';
           Productos.length=0;
           break;
        case "persona":
           direccion='http://127.0.0.1:8000/api/v1/persons?order=id&ordering=ASC';
           Personas.length=0;
           break;
        case "entidad":
           direccion='http://127.0.0.1:8000/api/v1/entities?order=id&ordering=ASC';
           Entidades.length=0;
           break;
    }
    
    let request = new XMLHttpRequest();
    request.open('GET', direccion, false);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
    request.send();

    switch (tipo) {
        case "usuario":
               if (request.status==404){
                   break;
                   }             
                data = JSON.parse(PreparaCadena(request.responseText,"usuario", true));
                
                data.forEach((elemento) => {
                   Usuarios[indice]=CreaUsuario(elemento.username);
                   Usuarios[indice].id=elemento.id;
                   Usuarios[indice].nombrecompleto=FiltraDato(elemento.name);
                   Usuarios[indice].FechaNaci= FiltraDato(elemento.birthDate);
                   Usuarios[indice].email= FiltraDato(elemento.email);
                   Usuarios[indice].rol= elemento.role;
                   Usuarios[indice].Url= FiltraDato(elemento.Url);
                   Usuarios[indice].Activo= elemento.Activo;
                   indice +=1;
                });                   
             
             break;
        case "producto":
               if (request.status==404){
                   break;
                  }               
               
                data = JSON.parse(PreparaCadena(request.responseText,"producto", true));
                //alert(PreparaCadena(request.responseText,"producto", true));
                               
                data.forEach((elemento) => {
                   Productos[indice]=CreaProducto(elemento.name,elemento.imageUrl);
                   Productos[indice].id=elemento.id;
                   Productos[indice].FechaNaci= FiltraDato(elemento.birthDate);
                   Productos[indice].FechaMuer= FiltraDato(elemento.deathDate);
                   Productos[indice].urlWiki=FiltraDato(elemento.wikiUrl);
                   //alert(FiltraDato(elemento.persons));
                   Productos[indice].PersonasParticipantes=FiltraDato(elemento.persons);
                   //alert(Productos[indice].PersonasParticipantes);
                   Productos[indice].EntidadesParticipantes=FiltraDato(elemento.entities);
                   indice +=1;
                  
                });                   
             
            break;
        case "persona":
                if (request.status==404){
                   break;
                   } 
             
                data = JSON.parse(PreparaCadena(request.responseText,"persona", true));

                data.forEach((elemento) => {

                   Personas[indice]=CreaPersona(elemento.name,elemento.imageUrl);
                   Personas[indice].id=elemento.id;
                   Personas[indice].FechaNaci= FiltraDato(elemento.birthDate);
                   Personas[indice].FechaMuer= FiltraDato(elemento.deathDate);
                   Personas[indice].urlWiki=FiltraDato(elemento.wikiUrl);
                   //Productos[indice].PersonasParticipantes=FiltraDato(elemento.persons);
                   //Productos[indice].EntidadesParticipantes=FiltraDato(elemento.entities);
                   indice +=1;
                        
                });                   
             
            break;
        case "entidad":
                if (request.status==404){
                   break;
                   }

                data = JSON.parse(PreparaCadena(request.responseText,"entidad", true));
                data.forEach((elemento) => {

                   Entidades[indice]=CreaEntidad(elemento.name,elemento.imageUrl);
                   Entidades[indice].id=elemento.id;
                   Entidades[indice].FechaNaci= FiltraDato(elemento.birthDate);
                   Entidades[indice].FechaMuer= FiltraDato(elemento.deathDate);
                   Entidades[indice].urlWiki=FiltraDato(elemento.wikiUrl);
                   Entidades[indice].PersonasParticipantes=FiltraDato(elemento.persons);
                   //Productos[indice].EntidadesParticipantes=FiltraDato(elemento.entities);
                   indice +=1;
                        
                });                   
            
            break;
    }

}
function FiltraDato(dato){
   // filtra los datos que me vienen de la BD a mis matrices
   if( dato=="" || dato == null || dato == "-0001-11-30" || dato=="undefined") {
      return "sin datos";
   }else{
      return dato;
      }
}


//************ Funciones varias sobre controles
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

function CambiaValorControlID (ConID, valor){
    let con= document.getElementById(ConID);
    con.value=valor;
}
function CambiaTextoEtiqueta (ConID, texto){
    let con= document.getElementById(ConID);
    con.innerHTML=texto;
}


//******************************
function PreparaCadena (cadena, tipo, lista){
  //Prepara una cadena que me viene de la base de datos, para que la entienda JSON parse
  let Resul = cadena; 
  if (tipo=="usuario"){
    if (lista==true){

       Resul=Resul.replace (/{\"users\":/g,"");
       Resul=Resul.replace (/{\"user\":/g,"");
       Resul=Resul.replace (/}}/g,"}");
       Resul=Resul.replace (/]}/g,"]");
      
    }else{
       cadena.replace (/{\"user\":/g,"");
       cadena.replace (/}}/g,"}");
    }
  }
  if (tipo=="producto"){
    if (lista==true){
       
 /*    Resul=Resul.replace (/{\"products\":/g,"");
       Resul=Resul.replace (/{\"product\":/g,"");
       Resul=Resul.replace (/}}/g,"}");
       Resul=Resul.replace (/]}/g,"]");
      
*/
       //Hay que hacerlo de esta forma, porque los productos pueden llevar matrices con corchetes y lo anterior no vale;
       Resul=Resul.replace (/{\"products\":/g,"");
       Resul=Resul.replace (/{\"product\":/g,"");
       Resul=Resul.replace (/}}/g,"}");
       Resul=Resul.replace (/}]}/g,"}]");

    }else{
       cadena.replace (/{\"product\":/g,"");
       cadena.replace (/}}/g,"}");
    }
  }
  if (tipo=="persona"){
    if (lista==true){
       //Hay que hacerlo de esta forma, porque las personas pueden llevar matrices con corchetes y lo anterior no vale;
       Resul=Resul.replace (/{\"persons\":/g,"");
       Resul=Resul.replace (/{\"person\":/g,"");
       Resul=Resul.replace (/}}/g,"}");
       Resul=Resul.replace (/}]}/g,"}]");

     }else{
       cadena.replace (/{\"person\":/g,"");
       cadena.replace (/}}/g,"}");
    }
  }
  if (tipo=="entidad"){
    if (lista==true){
       //Hay que hacerlo de esta forma, porque las entidades pueden llevar matrices con corchetes y lo anterior no vale;

       Resul=Resul.replace (/{\"entities\":/g,"");
       Resul=Resul.replace (/{\"entity\":/g,"");
       Resul=Resul.replace (/}}/g,"}");
       Resul=Resul.replace (/}]}/g,"}]");

     }else{
       cadena.replace (/{\"entity\":/g,"");
       cadena.replace (/}}/g,"}");
    }
  }


  return Resul;
}

function Loguearse() {

   let correcto=false;
   //abro conexión y compruebo que sea correcto
   let usu=ValorControlID('usuario');
   let pas= ValorControlID('pass');

   let request = new XMLHttpRequest();
   request.open('POST', 'http://127.0.0.1:8000/access_token', true);
   request.setRequestHeader('Accept', 'application/json');
   request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded' );
   request.send('username='+usu+'&password='+pas+'&scope=reader%2Bwriter');

   request.onload = function(){
      let data = JSON.parse(this.response);
      if (request.status==200){  //obtenemos el token de autorización
         localStorage.setItem("Token",data.access_token);
         Logueado(usu);
      }
      if (request.status==404){
        alert("usuario o contraseña incorrecto");
        let con=document.getElementById('usuario');
        con.value='';
        con= document.getElementById('pass');
        con.value='';
      } else{
        localStorage.setItem("Contraseña",pass);
      }
      //alert(request.responseText);
   }
 
}


function Logueado(Usu, RolUsu="Ni idea"){ //con este parámetro opcional es para cuando acabo de logearme y no sé la id del usuario
    let activo;
    if (RolUsu=="Ni idea"){
    //ahora busco al usuario para saber si es reader o writer
        activo=IdUsuLogeado(Usu);
        if (activo==false){
           alert("Está usted Inactivado en esta BD. Póngase en contacto con un Writer");
           return;
        }
    }



    Loge='SI';
    localStorage.setItem("EstaLogueado",Loge);
    //acciones a tomar en caso de que el usuario se loguee
    CambiaTextoEtiqueta('LNomUsu', 'Usuario: '+Usu);
   
    let ClaseLogeado=document.getElementsByClassName('logeado');
    for(let i=0; i< ClaseLogeado.length;i++){
        ClaseLogeado[i].removeAttribute("hidden");
    }
    let ClaseSinLogeado=document.getElementsByClassName('Sinlogeado');
    for(let i=0; i< ClaseSinLogeado.length;i++){
        ClaseSinLogeado[i].setAttribute("hidden", "hidden");
    }
    VisibilidadControlID("EdiRegistro",true); 

    
                   
    CargaMatrices("todas");

    if (TipoLoge=="reader"){
       DibujaTablaIndice();
    }else{//writer
       DibujaTablaIndice();
       let ClaseLogeadoW=document.getElementsByClassName('logeadoWriter');
       for(let i=0; i< ClaseLogeadoW.length;i++){
       ClaseLogeadoW[i].removeAttribute("hidden");
       }
    }
    
   
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
    VisibilidadControlID("TI",false);
    VisibilidadControlID("EdiRegistro",false);
}

function IdUsuLogeado(Usu){

    let activo=true;
    
    let request = new XMLHttpRequest();
    request.open('GET', 'http://127.0.0.1:8000/api/v1/users', false);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
    request.send();
   
    let data = JSON.parse(PreparaCadena(request.responseText,"usuario", true));
                  
    data.forEach((elemento) => {

         if(elemento.username ==Usu){

             if (elemento.Activo==0){
               //alert("entra");
               //return false;  este return me saca deñ ForEach, pero no de la función
               //alert("sigue");
               activo=false;
             }
             TipoLoge=elemento.role;
             localStorage.setItem("Rol",TipoLoge);
             localStorage.setItem("IDusu",elemento.id);
             NombreUsu=elemento.username;
             localStorage.setItem("NomUsu",NombreUsu);
         }
            
    });  
                   
  return activo;
  
}


function CreaUsuario (NombreUsu){
    return {
        id: 0,
        username:NombreUsu,
        nombrecompleto: "sin datos",
        FechaNaci :"sin datos",
        email :"sin datos",
        rol :"reader",
        Url: "sin datos",
        Activo:0
        };
}

function CreaPersona (nombre, foto){
    return {
        id: 0,
        nombre: nombre,
        FechaNaci :"sin datos",
        FechaMuer :"sin datos",
        urlFoto : foto,
        urlWiki: "sin datos"
        };
}
function CreaProducto (nombre,  foto){
    return {
        id: 0,
        nombre: nombre,
        FechaNaci :"sin datos",
        FechaMuer :"sin datos",
        urlFoto :  foto,
        urlWiki: "sin datos",
        PersonasParticipantes: "sin datos",
        EntidadesParticipantes: "sin datos"
        };
}
function CreaEntidad (nombre, foto){
    return {
        id: 0,
        nombre: nombre,
        FechaNaci :"sin datos",
        FechaMuer :"sin datos",
        urlFoto :  foto,
        urlWiki: "sin datos",
        PersonasParticipantes: "sin datos"
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

    VisibilidadControlID("TI",true);
    let hasta = DameMaxLongi();
    let codigo ='<tbody>'
 
    for ( let i=0; i< hasta; i++) {

         if (Productos.length>i){       
            codigo=codigo + '<tr><td><h2> <a href=\"MostrarElementos.html\" onclick=\"Ir_a(1,'+i+');\">'+
            '<img class=\"ImgIndex\" width=\"25\" height=\"25\" alt=\"foto\" src=\"'+Productos[i].urlFoto+'\"/>&nbsp;' +
            Productos[i].nombre+'&nbsp;</a><input class=\"logeadoWriter" id=\"B'+ Productos[i].nombre+ '\" hidden=\"hidden\" type=\"button\" value=\"Borrar\" onclick=\"Borra(1,'+i+');\" /> </h2> </td>';
         }else{
            codigo=codigo+'<tr><td></td>';
            }
         if (Personas.length>i){ 
            codigo=codigo +'<td><h2> <a href=\"MostrarElementos.html\" onclick=\"Ir_a(2,'+i+');\">'+
            '<img class=\"ImgIndex\" width=\"25\" height=\"25\" alt=\"foto\" src=\"'+Personas[i].urlFoto+'\"/>&nbsp;' +
            Personas[i].nombre+'&nbsp;</a><input class=\"logeadoWriter" id=\"B'+Personas[i].nombre+'\" hidden=\"hidden\" type=\"button\" value=\"Borrar\" onclick=\"Borra(2,'+i+');\" /></h2> </td>';
         }else{
            codigo=codigo +'<td></td>';
            }

         if (Entidades.length>i){
            codigo=codigo +'<td><h2> <a href=\"MostrarElementos.html\" onclick=\"Ir_a(3,'+i+');\"> '+
            '<img class=\"ImgIndex\" width=\"25\" height=\"25\" alt=\"foto\" src=\"'+Entidades[i].urlFoto+'\"/>&nbsp;' +
            Entidades[i].nombre+'&nbsp;</a><input class=\"logeadoWriter id=\"B'+Entidades[i].nombre+'\" hidden=\"hidden\" type=\"button\" value=\"Borrar\"onclick=\"Borra(3,'+i+');\" /> </h2></td></tr>';
          }else{
            codigo=codigo +'<td></td></tr>';
            }           
    }

    codigo=codigo + '<tr><td style=\"text-align: center\"> <input class=\"logeadoWriter" id=\"CrearProducto\" hidden=\"hidden\" type=\"button\" value=\"Crear Producto\" onclick=\"Ir_a_CreaEdita(1);\" /> </td>'+
    '<td style=\"text-align: center\"> <input class=\"logeadoWriter" id=\"CrearPersona\" hidden=\"hidden\" type=\"button\" value=\"Crear Persona\" onclick=\"Ir_a_CreaEdita(2);\"/> </td>'+
    '<td style=\"text-align: center\"> <input class=\"logeadoWriter" id=\"CrearEntidad\" hidden=\"hidden\" type=\"button\" value=\"Crear Entidad\" onclick=\"Ir_a_CreaEdita(3);\" /> </td> </tr>';
    codigo=codigo +'</tbody>';

    document.getElementById("TI").innerHTML=codigo;
    //alert(Loge);
                        
}

function Borra(tipo, indice){
     // tipo me dice de que matriz borro el indice, si es 1 entonces de Productos, 2 de Personas, 3 de entidades
     // indice me dice el indice que borro de la matriz

     let ID_a_borrar;


//Borro en la matriz de trabajo     
   
     if (tipo==1){
        ID_a_borrar=Productos[indice].id;
        Productos.splice(indice,1);
     }
     if (tipo==2){
        ID_a_borrar=Personas[indice].id;
        Personas.splice(indice,1);
     }
     if (tipo==3){
        ID_a_borrar=Entidades[indice].id;
        Entidades.splice(indice,1);
     }

     //ahora borro en la base de datos
     switch (tipo) {
        case 1:
           direccion='http://127.0.0.1:8000/api/v1/products/'+ID_a_borrar.toString();
           break;
        case 2:
           direccion='http://127.0.0.1:8000/api/v1/persons/'+ID_a_borrar.toString();
           break;
        case 3:
           direccion='http://127.0.0.1:8000/api/v1/entities/'+ID_a_borrar.toString();
           break;
    }
    
    let request = new XMLHttpRequest();
    request.open('DELETE', direccion, false);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
    request.send();

    if (request.status!==204){
       alert('no se ha podido borrar realmente de la BD');
    }


     location.reload(true);
     
}

function Ir_a(tipo, indice){
     //alert('entra en ir a tipo '+ tipo +'   indice '+indice);
     //Datos para la página que muestra los datos
     // tipo me dice: si es 1 entonces de Productos, 2 de Personas, 3 de entidades
     // indice me dice el indice  de la matriz

     //Guardamos tipo e indice para recogerlo en la página a la que iremos
     localStorage.setItem("GuardaTipo",tipo);
     localStorage.setItem("GuardaIndice",indice);
     //cuando termina esta función, hace el href de <a>
   
     
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

    //Si el pollo ha entrado aquí, es que está logeado y es writer
    TipoLoge=localStorage.getItem("Rol");
    NomUsu=localStorage.getItem("NomUsu");
    CambiaTextoEtiqueta("LNomUsu_2","Usuario:  "+NomUsu);


    //Cargo las 3 matrices, las voy a necesitar para las búsquedas. No necesitaría personas si forma="Crea", pero ya me da igual
    CargaMatrices("producto");
    CargaMatrices("persona");
    CargaMatrices("entidad");

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
            varApoyo="Formulario para EDITAR producto";
            varElemento=Productos[indice];
            }
        if (tipoEdita==2){
            varApoyo="Formulario para EDITAR persona";
            varElemento=Personas[indice];
            }
        if (tipoEdita==3){
            varApoyo="Formulario para EDITAR entidad";
            varElemento=Entidades[indice];
            } 
                  
        vartexto='<caption><h3>'+varApoyo+'</h3><caption> <tbody>'+
        '<tr><td class=\"td1EdiCrea\"> Nombre (obligatorio):</td>'+
        '<td> <input id=\"Text1\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.nombre+'\"/></td></tr>'+

        '<tr><td class=\"td1EdiCrea\"> Fecha de nacimiento, creación, …:(aaaa-mm-dd)​</td>'+
        '<td> <input id=\"Text2\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.FechaNaci+'\"/></td></tr>'+

        '<tr><td class=\"td1EdiCrea\"> Fecha de defunción, utilidad, …​:(aaaa-mm-dd)</td>'+
        '<td> <input id=\"Text3\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.FechaMuer+'\"/></td></tr>'+

        '<tr><td class=\"td1EdiCrea\"> Imagen, retrato, logo, …​, url a la imagen (Obligatorio)​:</td>'+
        '<td> <input id=\"Text4\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.urlFoto+'\"/></td></tr>'+

        '<tr><td class=\"td1EdiCrea\"> Wiki, url al elemento​:</td>'+
        '<td> <input id=\"Text5\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.urlWiki+'\"/></td></tr>';
        if (tipoEdita==2){
            vartexto=vartexto+'</tbody>';
        }
        if (tipoEdita==1){
            vartexto=vartexto+'<tr><td class=\"td1EdiCrea\"> Personas que han participado en su desarrollo​:(id1,id2,id3,....)</td>'+
            '<td> <input id=\"Text6\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.PersonasParticipantes+'\"/></td></tr>'+

            '<tr><td class=\"td1EdiCrea\"> Entidades que han participado en su desarrollo:(id1,id2,id3,....)</td>'+
            '<td> <input id=\"Text7\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.EntidadesParticipantes+'\"/></td></tr>'+
            '</tbody>';
        }
        if (tipoEdita==3){
            vartexto=vartexto+'<tr><td class=\"td1EdiCrea\"> Personas que han participado en su desarrollo​:(id1,id2,id3,....)</td>'+
            '<td> <input id=\"Text6\" class=\"TextEdiCrea\" type=\"text\" value=\"'+varElemento.PersonasParticipantes+'\"/></td></tr>'+

            '</tbody>';
         }    


    }
    document.getElementById("TablaCreaEdita").innerHTML=vartexto;
    if (tipoCrea==1){
         document.getElementById("Text6").disabled = true;
         document.getElementById("Text7").disabled = true;
     }
     if (tipoCrea==3){
         document.getElementById("Text6").disabled = true;
     }

}

function CompruebaGuardar(){
    if (ValorControlID("Text1")=="" || ValorControlID("Text4")==""){
        alert("campos obligatorios sin rellenar");
    }else{
        GuardaElemento();
    }
}

function GuardaElemento(){
    // Los tipos son: 1 para producto, 2 para persona y 3 para entidad

    let forma= localStorage.getItem("GuardaformaPagina"); //para saber si es crear o es editar
    let tipoCrea; //para saber si es persona, producto o entidad lo que creamos
    let tipoEdita;//para saber si es persona, producto o entidad lo que editamos
    let indice; //indice de la matriz que editamos
    let vartexto;
    let varetag; //Para guardar los etag del GET
    //let varApoyo;
    //let varElemento;
    let longi;
    if (forma=="Crea"){
        
        tipoCrea=localStorage.getItem("GuardaTipoCrea"); //para saber si es persona, producto o entidad

        vartexto="{\"name\":\""+ValorControlID("Text1")+"\",\"birthDate\":\""+ValorControlID("Text2")+"\",";
        vartexto=vartexto+"\"deathDate\":\""+ValorControlID("Text3")+"\",\"imageUrl\":\""+ValorControlID("Text4")+"\",";
        vartexto=vartexto+"\"wikiUrl\":\""+ValorControlID("Text5")+"\"}";
        let request = new XMLHttpRequest();
        
        if (tipoCrea==1){
          
           request.open('POST', 'http://127.0.0.1:8000/api/v1/products', false);
           request.setRequestHeader('Accept', 'application/json');
           request.setRequestHeader('Content-Type', 'application/json');
           request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
           request.send(vartexto);

           CargaMatrices("producto");
         }
         if (tipoCrea==2){
           request.open('POST', 'http://127.0.0.1:8000/api/v1/persons', false);
           request.setRequestHeader('Accept', 'application/json');
           request.setRequestHeader('Content-Type', 'application/json');
           request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
           request.send(vartexto);

           CargaMatrices("persona");
         }
         if (tipoCrea==3){
           request.open('POST', 'http://127.0.0.1:8000/api/v1/entities', false);
           request.setRequestHeader('Accept', 'application/json');
           request.setRequestHeader('Content-Type', 'application/json');
           request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
           request.send(vartexto);

           CargaMatrices("entidad");         
        }
        if (request.status==201){
           alert("elemento creado correctamente");
       } else{
           alert(request.responseText);
       }
    }else {

        tipoEdita=localStorage.getItem("GuardaTipo");
        indice=localStorage.getItem("GuardaIndice");

        vartexto="{\"name\":\""+ValorControlID("Text1")+"\",\"birthDate\":\""+ValorControlID("Text2")+"\",";
        vartexto=vartexto+"\"deathDate\":\""+ValorControlID("Text3")+"\",\"imageUrl\":\""+ValorControlID("Text4")+"\",";
        vartexto=vartexto+"\"wikiUrl\":\""+ValorControlID("Text5")+"\"}";
        let request = new XMLHttpRequest();

        if (tipoEdita==1){
           
           request.open('GET', 'http://127.0.0.1:8000/api/v1/products/'+Productos[indice].id.toString(), false);
           request.setRequestHeader('Accept', 'application/json');
           //request.setRequestHeader('Content-Type', 'application/json');
           request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
           request.send();
           varetag=request.getResponseHeader("etag");
           //varetag=request.getAllResponseHeaders();
           

           request.open('PUT', 'http://127.0.0.1:8000/api/v1/products/'+Productos[indice].id.toString(), false);
           request.setRequestHeader('Accept', 'application/json');
           request.setRequestHeader('If-Match', varetag);
           request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
           request.setRequestHeader('Content-Type', 'application/json');
           request.send(vartexto);
           
           CargaMatrices("producto");


           
        }
        if (tipoEdita==2){

           request.open('GET', 'http://127.0.0.1:8000/api/v1/persons/'+Personas[indice].id.toString(), false);
           request.setRequestHeader('Accept', 'application/json');
           //request.setRequestHeader('Content-Type', 'application/json');
           request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
           request.send();
           varetag=request.getResponseHeader("etag");
           //varetag=request.getAllResponseHeaders();
           

           request.open('PUT', 'http://127.0.0.1:8000/api/v1/persons/'+Personas[indice].id.toString(), false);
           request.setRequestHeader('Accept', 'application/json');
           request.setRequestHeader('If-Match', varetag);
           request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
           request.setRequestHeader('Content-Type', 'application/json');
           request.send(vartexto);
           
           CargaMatrices("persona");

        }
        if (tipoEdita==3){

           request.open('GET', 'http://127.0.0.1:8000/api/v1/entities/'+Entidades[indice].id.toString(), false);
           request.setRequestHeader('Accept', 'application/json');
           //request.setRequestHeader('Content-Type', 'application/json');
           request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
           request.send();
           varetag=request.getResponseHeader("etag");
           //varetag=request.getAllResponseHeaders();
           

           request.open('PUT', 'http://127.0.0.1:8000/api/v1/entities/'+Entidades[indice].id.toString(), false);
           request.setRequestHeader('Accept', 'application/json');
           request.setRequestHeader('If-Match', varetag);
           request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
           request.setRequestHeader('Content-Type', 'application/json');
           request.send(vartexto);
           
           CargaMatrices("entidad");
       }
        if (request.status==209){
           alert("elemento actualizado correctamente");
       } else{
           alert(request.responseText);
       }
       if (tipoEdita==1){
          if(ValorControlID("Text6")=="sin datos") {
          }else{
              GuardaRelaciones(Productos[indice].id,1,"persona",Productos[indice].PersonasParticipantes.toString(),ValorControlID("Text6"));
          }
          if(ValorControlID("Text7")=="sin datos") {
          }else{
              GuardaRelaciones(Productos[indice].id,1,"entidad",Productos[indice].EntidadesParticipantes.toString(),ValorControlID("Text7"));
          }

       }

       if (tipoEdita==3){
          if(ValorControlID("Text6")=="sin datos") {
          }else{
              GuardaRelaciones(Entidades[indice].id,3,"persona",Entidades[indice].PersonasParticipantes.toString(),ValorControlID("Text6"));
                     
          }

       }
    }
}

function GuardaRelaciones (IDelemento, tipoEdita,Person_Entity, ValorAnterior,ValorActual){
   if (ValorAnterior==ValorActual){
      return true;
   }

   let MatrizAnterior;
   let MatrizActual;
   let direccion;
   let problemas=false;
   let request = new XMLHttpRequest();
   if (tipoEdita==1){
      if(Person_Entity=="persona"){

         if (ValorAnterior !="" && ValorAnterior!="sin datos"){
             MatrizAnterior=TextoMatriz(ValorAnterior);
             for (let i=0; i< MatrizAnterior.length;i++){
                
                direccion='http://127.0.0.1:8000/api/v1/products/'+IDelemento.toString()+'/persons/rem/'+ MatrizAnterior[i].toString();
                request.open('PUT', direccion, false);
                request.setRequestHeader('Accept', 'application/json');
                request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
                request.send();

                if (request.status!=209){
                  alert("problemas ID persona  :" +request.responseText);
                }
            } 
         }
         //ValorActual ya hemos dicho que no puede ser "sin datos"
            if(ValorActual!=""){
             MatrizActual=TextoMatriz(ValorActual);
 
             for (let i=0; i< MatrizActual.length;i++){
                 direccion='http://127.0.0.1:8000/api/v1/products/'+IDelemento.toString()+'/persons/add/'+ MatrizActual[i].toString();
                 request.open('PUT', direccion, false);
                 request.setRequestHeader('Accept', 'application/json');
                 request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
                 request.send();

                 if (request.status!=209){
                    alert("problemas ID persona  :"+request.responseText);
                 }
             } 
			}

     } else{

         if (ValorAnterior !="" && ValorAnterior!="sin datos"){
             MatrizAnterior=TextoMatriz(ValorAnterior);
             for (let i=0; i< MatrizAnterior.length;i++){
                
                direccion='http://127.0.0.1:8000/api/v1/products/'+IDelemento.toString()+'/entities/rem/'+ MatrizAnterior[i].toString();
                request.open('PUT', direccion, false);
                request.setRequestHeader('Accept', 'application/json');
                request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
                request.send();

                if (request.status!=209){
                   alert("problemas ID entidad  :"+request.responseText);
                }
            } 
         }
         //ValorActual ya hemos dicho que no puede ser "sin datos"
            if(ValorActual!=""){
  
             MatrizActual=TextoMatriz(ValorActual);
 
             for (let i=0; i< MatrizActual.length;i++){
                 direccion='http://127.0.0.1:8000/api/v1/products/'+IDelemento.toString()+'/entities/add/'+ MatrizActual[i].toString();
                 request.open('PUT', direccion, false);
                 request.setRequestHeader('Accept', 'application/json');
                 request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
                 request.send();

                 if (request.status!=209){
                    alert("problemas ID entidad  :"+request.responseText);
                 }
             } 
			}
     }

  }else{

         if (ValorAnterior !="" && ValorAnterior!="sin datos"){
             MatrizAnterior=TextoMatriz(ValorAnterior);
             for (let i=0; i< MatrizAnterior.length;i++){
                
                direccion='http://127.0.0.1:8000/api/v1/entities/'+IDelemento.toString()+'/persons/rem/'+ MatrizAnterior[i].toString();
                request.open('PUT', direccion, false);
                request.setRequestHeader('Accept', 'application/json');
                request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
                request.send();

                if (request.status!=209){
                  alert("problemas ID persona  :"+request.responseText);
                }
            } 
         }
         //ValorActual ya hemos dicho que no puede ser "sin datos"
            if(ValorActual!=""){
  
             MatrizActual=TextoMatriz(ValorActual);
 
             for (let i=0; i< MatrizActual.length;i++){
                 direccion='http://127.0.0.1:8000/api/v1/entities/'+IDelemento.toString()+'/persons/add/'+ MatrizActual[i].toString();
                 request.open('PUT', direccion, false);
                 request.setRequestHeader('Accept', 'application/json');
                 request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
                 request.send();

                 if (request.status!=209){
                    alert("problemas ID persona  :"+request.responseText);
                 }
             } 
			}
     }


}
// *****************aunque no es independiente, aqui empiezan las funciones de MostrarElementos.html********************

function PaginaMostrarElementos(){
    // Los tipos son: 1 para producto, 2 para persona y 3 para entidad
    let tipoEdita=localStorage.getItem("GuardaTipo");//para saber si es persona, producto o entidad lo que editamos
    let indice=localStorage.getItem("GuardaIndice"); //indice de la matriz que editamos
    let vartexto;
    let varApoyo;
    let varElemento;

    let RistraPerso;
    let RistraEnti;

    TipoLoge=localStorage.getItem("Rol");
    NomUsu=localStorage.getItem("NomUsu");
  
   

   Loge=localStorage.getItem("EstaLogueado");
    //esta es una pregunta reminiscente de la práctica anterior, lógicmente si hemos entrado en esta página, es por estamos logueados
   
   CambiaTextoEtiqueta("LNomUsu_1","Usuario:  "+NomUsu);

   if (Loge=='SI' && TipoLoge=="writer"){
      VisibilidadControlID ("Bedita", true);
      }else{
      VisibilidadControlID ("Bedita", false);
   } 
    
    //voy a necesitar las 3 a la hora de busca en Personas o entidades relacionadas
    CargaMatrices("producto");
    CargaMatrices("persona");
    CargaMatrices("entidad");    
    if (tipoEdita==1){
        varElemento=Productos[indice];
     }
    if (tipoEdita==2){
        varElemento=Personas[indice];
     }
    if (tipoEdita==3){
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
          RistraPerso=CadenaNombre(1,varElemento.PersonasParticipantes);
          RistraEnti=CadenaNombre(2,varElemento.EntidadesParticipantes);

        // vartexto='<tr><td><i>Personas participantes en su desarrollo: </i><b>'+varElemento.PersonasParticipantes+'</b></td></tr>'+
        //'<tr><td><i>Entidades participantes en su desarrollo: </i><b>'+varElemento.EntidadesParticipantes+'</b></td></tr>';
           vartexto='<tr><td><i>Personas participantes en su desarrollo: </i><b>'+RistraPerso+'</b></td></tr>'+
          '<tr><td><i>Entidades participantes en su desarrollo: </i><b>'+RistraEnti+'</b></td></tr>';
     }
    if (tipoEdita==2){
        vartexto='<tr><td>&nbsp;</td></tr>';
     }
    if (tipoEdita==3){
        RistraPerso=CadenaNombre(1,varElemento.PersonasParticipantes);
        //vartexto='<tr><td><i>Personas participantes en su desarrollo: </i><b>'+varElemento.PersonasParticipantes+'</b></td></tr>';
        vartexto='<tr><td><i>Personas participantes en su desarrollo: </i><b>'+RistraPerso+'</b></td></tr>';

     }
    document.getElementById("PieDeMostrar").innerHTML=vartexto;
      
}

function PasarAEdicion(){
     let forma= "Edita";
     localStorage.setItem("GuardaformaPagina",forma);
     window.location="Crea_Edita.html";
}


//***************** Varias funciones de búsqueta de la página Crea_Edita************

function AlertPerson_id (){
//requiere Personas cargadas
   ID=ValorControlID("Tbusca3");
   let encontrado=false;
   let resul=""; 
   for(let i=0;i< Personas.length;i++){
       if (Personas[i].id==ID){
          resul=Personas[i].nombre;
          encontrado=true;
          break;
       }
   }
   if (encontrado==true){
      alert("la persona con ID "+ID+" es: "+resul);
   }else{
      alert("la persona con ID "+ID+" es: No existe");
   }
   
}

function AlertEntity_id (){
//requiere Entidades cargadas
   ID=ValorControlID("Tbusca4");
   let encontrado=false;
   let resul=""; 
   for(let i=0;i< Entidades.length;i++){
       if (Entidades[i].id==ID){
          resul=Entidades[i].nombre;
          encontrado=true;
          break;
       }
   }
   if (encontrado==true){
      alert("la entidad con ID "+ID+" es: "+resul);
   }else{
      alert("la entidad con ID "+ID+" es: No existe");
   }
         
}

function AlertPerson_nombre (){
//requiere Personas cargadas
   nom=ValorControlID("Tbusca1");
   let encontrado=false;

   let resul=""; 
   for(let i=0;i< Personas.length;i++){
       if (Personas[i].nombre==nom){
          resul=Personas[i].id;
          encontrado=true;
          break;
       }
   }
   if (encontrado==true){
      alert("la persona de nombre "+nom+" tiene ID: "+resul);
   }else{
      alert("la persona de nombre "+nom+" tiene ID: No existe");
   }
}

function AlertEntity_nombre (){
//requiere Entidades cargadas
   nom=ValorControlID("Tbusca2");
   let encontrado=false;
   let resul=""; 
   for(let i=0;i< Entidades.length;i++){
       if (Entidades[i].nombre==nom){
          resul=Entidades[i].id;
          encontrado=true;
          break;
       }
   }
   if (encontrado==true){
      alert("la entidad de nombre "+nom+" tiene ID: "+resul);
   }else{
      alert("la entidad de nombre "+nom+" tiene ID: No existe");
   }
}

//***********************Varias utilidades***************************

function MatrizTexto (M){
   let resul="";
   //Pasa una matriz de enteros a texto separado por comas
   // m=[1,2] el resultado es 1,2
   for(let i=0; i<M.length;i++){
      if(i==M.length-1){
          resul= resul+M[i];
      }else{
          resul= resul+M[i]+",";
      }
   }

   return resul;
}

function TextoMatriz(T){
   let resul;
   //paso texto de enteros separados por comas a elementos enteros en una matriz
   resul=T.split(",");
   return resul;
}

function CadenaNombre(tipo, Matriz){
   //esta función va a servir para devolver una cadena con los nombre de las personas (tipo1) o las entidades (tipo=2)
   // que se muestran en la página Mostrar elementos
   let resul="";
   let M;
    if (Matriz!="sin datos"){
      M=TextoMatriz(Matriz.toString());

      if (tipo==1){
          for(let i=0;i<M.length;i++){
             resul=resul+Elemento_Nombre("persona",M[i])+"; ";
          }
		  
      }
      if (tipo==2){
          for(let i=0;i<M.length;i++){
             resul=resul+Elemento_Nombre("entidad",M[i])+"; ";
          }
      }
   }

   return resul;
}

function Elemento_Nombre (tipo, ID){
//devuelve el nombre de un elemento por la ID
let resul="No existe";

    switch (tipo) {
        case "usuario":
           for (i=0;i<Usuarios.length;i++){
              if (Usuarios[i].id==ID){
                 resul=Usuarios[i].username;
              }
           }
           break;
        case "producto":
           for (i=0;i<Productos.length;i++){
              if (Productos[i].id==ID){
                 resul=Productos[i].nombre;
              }
           }
           break;
        case "persona":
           for (let i=0;i<Personas.length;i++){
              if (Personas[i].id==ID){
                 resul=Personas[i].nombre;
              }
           }
           break;
        case "entidad":
           for (i=0;i<Entidades.length;i++){
              if (Entidades[i].id==ID){
                 resul=Entidades[i].nombre;
              }
           }
           break;
   }
   return resul;

}

function Elemento_ID (tipo, nom){
//devuelve elID de un elemento por el nombre
let resul="No existe";

    switch (tipo) {
        case "usuario":
           for (i=0;i<Usuarios.length;i++){
              if (Usuarios[i].nombrecompleto==nom){
                 resul=Usuarios[i].id;
              }
           }
           break;
        case "producto":
           for (i=0;i<Productos.length;i++){
              if (Productos[i].nombre==nom){
                 resul=Productos[i].id;
              }
           }
           break;
        case "persona":
           for (i=0;i<Personas.length;i++){
              if (Personas[i].nombre==nom){
                 resul=Personas[i].id;
              }
           }
           break;
        case "entidad":
           for (i=0;i<Entidades.length;i++){
              if (Entidades[i].nombre==nom){
                 resul=Entidades[i].id;
              }
           }
           break;
   }
   return resul;
}

function ExisteID(tipo, ID){
let resul=false;

    switch (tipo) {
        case "usuario":
           for (i=0;i<Usuarios.length;i++){
              if (Usuarios[i].id==ID){
                 resul=true;
                 break;
              }
           }
           break;
        case "producto":
           for (i=0;i<Productos.length;i++){
              if (Productos[i].id==ID){
                 resul=true;
                 break;
              }
           }
           break;
        case "persona":
           for (i=0;i<Personas.length;i++){
              if (Personas[i].id==ID){
                 resul=true;
                 break;
              }
           }
           break;
        case "entidad":
           for (i=0;i<Entidades.length;i++){
              if (Entidades[i].id==ID){
                 resul=true;
                 break;
              }
           }
           break;
   }
   return resul;

}

function ExisteNombre(tipo, nombre){
let resul=false;

    switch (tipo) {
        case "usuario":
           for (i=0;i<Usuarios.length;i++){
              if (Usuarios[i].username==nombre){
                 resul=true;
                 break;
              }
           }
           break;
        case "producto":
           for (i=0;i<Productos.length;i++){
              if (Productos[i].nombre==nombre){
                 resul=true;
                 break;
              }
           }
           break;
        case "persona":
           for (i=0;i<Personas.length;i++){
              if (Personas[i].nombre==nombre){
                 resul=true;
                 break;
              }
           }
           break;
        case "entidad":
           for (i=0;i<Entidades.length;i++){
              if (Entidades[i].nombre==nombre){
                 resul=true;
                 break;
              }
           }
           break;
   }
   return resul;

}


// *****************aunque no es independiente, aqui empiezan las funciones de Regis_Edita_Usuario.html********************

function CargaRegisUsu(tipo, indiceRegis=-1){
// tipo me dice desde donde lo estoy llamando, si es 1 es un usuario sin registrar, 2 un usuario writer sin editar a nadie todavía
//si entra un valor de indiceRegis distinto de -1, indica el índice de la matriz a editar
 
     switch (tipo) {
        case 1:
             
            // creo un writer para luego AUTORIZAR que guarde sus datos
            // logueado está en 'NO', pues no pasa nada
            let usu='adminUser';
            let pas= '*adminUser*';

 
            let request = new XMLHttpRequest();
            request.open('POST', 'http://127.0.0.1:8000/access_token', false);
            request.setRequestHeader('Accept', 'application/json');
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded' );
            request.send('username='+usu+'&password='+pas+'&scope=reader%2Bwriter');
            //alert(request.responseText);
            let data = JSON.parse(request.responseText);
            if (request.status==200){  //obtenemos el token de autorización
               localStorage.setItem("Token",data.access_token);
            }
            if (request.status==404){
               alert("probemas de conxión con la base");
            }

           localStorage.setItem("FormaRegis","crear");
           break;
        case 2: 
            TipoLoge=localStorage.getItem("Rol");
            if (TipoLoge=="writer"){
                localStorage.setItem("FormaRegis","EditaW");
            }else{
                localStorage.setItem("FormaRegis","EditaR");
            } 
          
            break;
     }

     window.location="Regis_Edita_Usuario.html";
}

function PaginaRegistro(){
   
   let forma=localStorage.getItem("FormaRegis");
   //let indice=localStorage.getItem("IndiRegis");
   let varTexto;

   Loge=localStorage.getItem("EstaLogueado");
   CargaMatrices("usuario");

    if (Loge=='SI'){
         TipoLoge= localStorage.getItem("Rol");
         NombreUsu= localStorage.getItem("NomUsu");
         CambiaTextoEtiqueta("LNomUsu_3", 'Usuario: '+NombreUsu);
   } else{
         VisibilidadControlID("LNomUsu_3",false);
         }

  
  vartexto='<caption><h3>Formulario de Usuarios</h3><caption> <tbody>';

   switch(forma){
      case "crear":

         VisibilidadControlID("Ayudas",false);
         vartexto=vartexto + '<tr><td class=\"td1EdiCrea\"> Contraseña (obligatorio):</td>'+
         '<td> <input id=\"Text1\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>' +
         
        '<tr><td class=\"td1EdiCrea\"> Usuario (obligatorio):</td>'+
        '<td> <input id=\"Text2\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>';
         break;
      case "EditaW":
         vartexto=vartexto + '<tr><td class=\"td1EdiCrea\"> Activo (inactivo=0, activo=1):</td>'+
         '<td> <input id=\"Text1\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>' +
         
        '<tr><td class=\"td1EdiCrea\"> Usuario:</td>'+
        '<td> <input id=\"Text2\" class=\"TextEdiCrea\" type=\"text\" disabled=\"disabled\"/></td></tr>';
        break;
       case "EditaR":
         VisibilidadControlID("Ayudas",false);
         vartexto=vartexto + '<tr><td class=\"td1EdiCrea\"> Activo (inactivo=0, activo=1):</td>'+
         '<td> <input id=\"Text1\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>' +
         
        '<tr><td class=\"td1EdiCrea\"> Usuario:</td>'+
        '<td> <input id=\"Text2\" class=\"TextEdiCrea\" type=\"text\" disabled=\"disabled\"/></td></tr>';
        break;
   }

 
   vartexto=vartexto +'<tr><td class=\"td1EdiCrea\"> Nombre y Apellidos:</td>'+
   '<td> <input id=\"Text3\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>'+

   '<tr><td class=\"td1EdiCrea\"> Fecha de nacimiento (aaaa-mm-dd)</td>'+
   '<td> <input id=\"Text4\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>'+

   '<tr><td class=\"td1EdiCrea\"> email:</td>'+
   '<td> <input id=\"Text5\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>'+

   '<tr><td class=\"td1EdiCrea\"> ROL :</td>'+
   '<td> <input id=\"Text6\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>'+

   '<tr><td class=\"td1EdiCrea\"> Url:</td>'+
   '<td> <input id=\"Text7\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>';

   if (Loge=='SI'){
      vartexto=vartexto +'<tr><td class=\"td1EdiCrea\"> Cambiar contraseña:</td>'+
     '<td> <input id=\"Text8\" class=\"TextEdiCrea\" type=\"text\"/></td></tr>'+
     '</tbody>';

   } else{
     vartexto=vartexto + '</tbody>';
   }


   
    document.getElementById("TablaRegistro").innerHTML=vartexto;

    if (forma=="crear"){
       CambiaValorControlID("Text6","reader");
       document.getElementById("Text6").disabled = true;
    }

    if (forma=="EditaR"){ 
       EditaEnRegistro();
    }

    if (forma=="EditaW"){
       

       vartexto= '<tr><td><h3><u>ID</u></h3></td><td><h3><u>Usuario</u></h3></td><td><h3><u>Activo</u></h3></td></tr>';
       for(let i=0;i<Usuarios.length;i++){
       vartexto=vartexto+ '<tr><td>'+Usuarios[i].id+'</td><td>'+Usuarios[i].username+'</td><td>'+Usuarios[i].Activo+'</td></tr>';
       }
      //alert(vartexto);
       document.getElementById("TableUsu").innerHTML=vartexto;
    }

}

function EditaEnRegistro(){
   let id;
   let UsuarioApoyo;
   if (TipoLoge=="writer"){
      id=ValorControlID("Tbusca1");
      if(id==localStorage.getItem("IDusu")){
          document.getElementById("Text8").disabled = false;
      }else{
          document.getElementById("Text8").disabled = true;
      }
      
   } else {
      //DeshabilitarControl("Text1",true);
      //VisibilidadControlID ("Text1",false);
      document.getElementById("Text1").disabled = true;
      document.getElementById("Text6").disabled = true;
      id=localStorage.getItem("IDusu");
   }

   if (ExisteID("usuario", id)==true){

      for (i=0;i<Usuarios.length;i++){
          if (Usuarios[i].id==id){
                 UsuarioApoyo=Usuarios[i];
                 localStorage.setItem("IdRegis",i);
          }
      }

      CambiaValorControlID("Text1",UsuarioApoyo.Activo);
      CambiaValorControlID("Text2",UsuarioApoyo.username);
      CambiaValorControlID("Text3",UsuarioApoyo.nombrecompleto);
      CambiaValorControlID("Text4",UsuarioApoyo.FechaNaci);
      CambiaValorControlID("Text5",UsuarioApoyo.email);
      CambiaValorControlID("Text6",UsuarioApoyo.rol);
      CambiaValorControlID("Text7",UsuarioApoyo.Url);

   }else{
      alert('Esa ID no existe');
   }

}

function CompruebaGuardarUsu(){
   let forma=localStorage.getItem("FormaRegis");
      switch(forma){
         case "crear":
            if (ValorControlID("Text1")=="" || ValorControlID("Text2")==""){
               alert("campos obligatorios sin rellenar");
               return;
            }
            for (i=0;i<Usuarios.length;i++){
                if (Usuarios[i].username==ValorControlID("Text2")){
                   alert("Ese usuario ya existe");
                   return;
                }
            }
            for (i=0;i<Usuarios.length;i++){
                if (Usuarios[i].email==ValorControlID("Text5")){
                   alert("Ese email ya existe");
                   return;
                }
            }


         break;
         default:
            for (i=0;i<Usuarios.length;i++){
                if (Usuarios[i].email==ValorControlID("Text5") && Usuarios[i].username!=ValorControlID("Text2")){
                   alert("Ese email ya existe");
                   return;
                }
            }

            if(ValorControlID("Text1")!=0 && ValorControlID("Text1")!=1){
               alert("Activo tiene que ser o 0 o 1");
               return;
            }
            if(ValorControlID("Text6")!="reader" && ValorControlID("Text6")!="writer"){
               alert("ROL tiene que ser o writer o reader");
               return;
            }

         break;
      }
    
    GuardaUsuario(); 
}

function GuardaUsuario(){
   let vartexto;
   let forma=localStorage.getItem("FormaRegis");
   if (forma=="crear"){

        vartexto="{\"username\":\""+ValorControlID("Text2")+"\",\"email\":\""+ValorControlID("Text5")+"\",";
        vartexto=vartexto+"\"name\":\""+ValorControlID("Text3")+"\",\"birthDate\":\""+ValorControlID("Text4")+"\",";
        vartexto=vartexto+"\"Url\":\""+ValorControlID("Text7")+"\","+"\"Activo\": 0 ,";
        vartexto=vartexto+"\"password\":\""+ValorControlID("Text1")+"\",\"role\":\""+ValorControlID("Text6")+"\"}";
        

        //alert (vartexto);
       
        let request = new XMLHttpRequest();

        request.open('POST', 'http://127.0.0.1:8000/api/v1/users', false);
        request.setRequestHeader('Accept', 'application/json');
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
        request.send(vartexto);

        if (request.status==201){
               alert('Ahora tendrá que esperar hasta que un Administrador autorice su registro');
               CargaMatrices("usuario");
        }else{
               alert('problemas con el servidor: ' + request.responseText);
        }

   } else{

       let id;
       let varetag;
 
       if (TipoLoge=="writer"){
          id=ValorControlID("Tbusca1");
          //alert(id);
       } else {
          id=localStorage.getItem("IDusu");
          //alert(id);
          ParaPermisosReader(1);
       }
       


       if (ValorControlID("Text8")==""){
          vartexto="{\"username\":\""+ValorControlID("Text2")+"\",\"email\":\""+ValorControlID("Text5")+"\",";
          vartexto=vartexto+"\"name\":\""+ValorControlID("Text3")+"\",\"birthDate\":\""+ValorControlID("Text4")+"\",";
          vartexto=vartexto+"\"Url\":\""+ValorControlID("Text7")+"\","+"\"Activo\":"+ ValorControlID("Text1")+",";
          vartexto=vartexto+"\"role\":\""+ValorControlID("Text6")+"\"}";

       }else{
          vartexto="{\"username\":\""+ValorControlID("Text2")+"\",\"email\":\""+ValorControlID("Text5")+"\",";
          vartexto=vartexto+"\"name\":\""+ValorControlID("Text3")+"\",\"birthDate\":\""+ValorControlID("Text4")+"\",";
          vartexto=vartexto+"\"Url\":\""+ValorControlID("Text7")+"\","+"\"Activo\":"+ ValorControlID("Text1")+",";
          vartexto=vartexto+"\"password\":\""+ValorControlID("Text8")+"\",\"role\":\""+ValorControlID("Text6")+"\"}";
       }



       let request = new XMLHttpRequest();

       request.open('GET', 'http://127.0.0.1:8000/api/v1/users/'+id, false);
       request.setRequestHeader('Accept', 'application/json');
       //request.setRequestHeader('Content-Type', 'application/json');
       request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
       request.send();
       varetag=request.getResponseHeader("etag");


       request.open('PUT', 'http://127.0.0.1:8000/api/v1/users/'+id, false);
       request.setRequestHeader('Accept', 'application/json');
       request.setRequestHeader('If-Match', varetag);
       request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
       request.setRequestHeader('Content-Type', 'application/json');
       request.send(vartexto);

       if (request.status==209){
            alert('Modificaciones realizadas');
            CargaMatrices("usuario");
        }else{
            alert('problemas con el servidor: ' + request.responseText);
        }

       if (TipoLoge=="reader"){
         ParaPermisosReader(2);
         }

  }

}

function ParaPermisosReader(permiso){
  // a un reader no se le deja escribir nada en la BD, para modificarse él mismo ha de coger las credenciales de un writer
  if (permiso==1){ 
            let usu='adminUser';
            let pas= '*adminUser*';

 
            let request = new XMLHttpRequest();
            request.open('POST', 'http://127.0.0.1:8000/access_token', false);
            request.setRequestHeader('Accept', 'application/json');
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded' );
            request.send('username='+usu+'&password='+pas+'&scope=reader%2Bwriter');
            //alert(request.responseText);
            let data = JSON.parse(request.responseText);
            if (request.status==200){  //obtenemos el token de autorización
               localStorage.setItem("Token",data.access_token);
            }
            if (request.status==404){
               alert("probemas de conxión con la base");
            }
  }else{
            let usu=localStorage.setItem("NomUsu");
            let pas= localStorage.getItem("Contraseña");

 
            let request = new XMLHttpRequest();
            request.open('POST', 'http://127.0.0.1:8000/access_token', false);
            request.setRequestHeader('Accept', 'application/json');
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded' );
            request.send('username='+usu+'&password='+pas+'&scope=reader%2Bwriter');
            //alert(request.responseText);
            let data = JSON.parse(request.responseText);
            if (request.status==200){  //obtenemos el token de autorización
               localStorage.setItem("Token",data.access_token);
            }
            if (request.status==404){
               alert("probemas de conxión con la base");
            }

  }
}

function BorraUsuario(){
let id=ValorControlID("Tbusca1");

   if(id==""){
       alert("No ha seleccionado ningún usuario");
       return;
   }

   if(id==1){
       alert("El usuario adminUser no puede ser borrado");
       return;
   }

      
   if(id==localStorage.getItem("IDusu")){
       alert("No se puede borrar a sí mismo. Hable con otro Writer");
       return;
    }
    let direccion='http://127.0.0.1:8000/api/v1/users/'+id;
    let request = new XMLHttpRequest();
    request.open('DELETE', direccion, false);
    request.setRequestHeader('Accept', '*/*');
    request.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('Token'));
    request.send();

    if (request.status!==204){
       alert('no se ha podido borrar');
    } else{
       alert('borrado correctamente');
       CargaMatrices("usuario");
          }

   
   location.reload(true);

}