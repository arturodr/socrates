var cabecera = '<div data-role=page><div data-role=header><h1>S√≥crates</h1></div><div data-role=content>';
var footer = '</div><div data-role=footer data-position=fixed><h1>¬© PUCP 2013</h1></div></div>';

function url2jsonp(url) {
	return url.replace("index","index.jsonp");
}

function codigo2url(codigo) {
	$.mobile.showPageLoadingMsg();
	var url = "http://goo.gl/"+codigo;
    /*
	$.longUrl( url, function(result){
		alert(result[url]);
		procesaUrl(result[url]);
	});
    */
    
    $.get("https://www.googleapis.com/urlshortener/v1/url?shortUrl="+url, function(result){
        alert(result[longUrl]);
        procesaUrl(result[longUrl]);
    });
    
}

function procesaUrl(url) {
	$.mobile.showPageLoadingMsg();
	
	if(url.lastIndexOf("http://socrates.pucp.edu.pe/", 0)!=0) {
		alert("URL no válido");
	}
	
	if(url == "http://socrates.pucp.edu.pe/welcome/student/index") {
		var pagina = $(cabecera+"<h2>Muchas gracias por participar de la encuesta, puede salir del programa</h2>"+footer);
		pagina.appendTo( $.mobile.pageContainer );
		$.mobile.hidePageLoadingMsg()
		$.mobile.changePage( pagina );	
	} else {
	
		$.get(url2jsonp(url)+"?callback=?", function(data) {
		
		//TODO: Validar que el URL sea de S√≥crates
		
		
		var html = cabecera+"<h2>"+data["pregunta"]["nombre"]+"</h2><h3>"+data["pregunta"]["ayuda"]+"</h3>";
		
		if (data["pregunta"]["imagen"].length>5) {
			html+='<img width="100%" src="http://socrates.pucp.edu.pe/welcome/teacher/download/'+data["pregunta"]["imagen"]+'">';
		}
		
		for (var i=1;i<5;i++) {
			if (data["pregunta"]["opcion"+i].length>0) {
				html+='<a href="#" onclick="procesaUrl(\''+data["url"]+'\')" data-role="button" data-icon="check">'+data["pregunta"]["opcion"+i]+'</a>';
			}
		}
		var pagina = $(html+footer);
		
		pagina.appendTo( $.mobile.pageContainer );
		$.mobile.hidePageLoadingMsg()
		$.mobile.changePage( pagina );			
		
		},"jsonp");
	}
}

$(document).ready(function() {
	//9s de timeout
	$.ajaxSetup({timeout: 9000})
	
	$('#btnIngresar').on('touchstart click', function(e){
    	e.stopPropagation(); e.preventDefault();	
    	codigo2url($("#encuesta").val());
    });
	
	$('#btnQR').on('touchstart click', function(e){	
		e.stopPropagation(); e.preventDefault();
		
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

   scanner.scan(
      function (result) {
          alert("URL:\n" + result.text);
          procesaUrl(result.text);
      }, 
      function (error) {
          alert("No se pudo obetener código QR\n" + error);
      }
   );
        
    });

});


$(document).bind('pageinit', function () {
    $.mobile.defaultPageTransition = 'none';
});