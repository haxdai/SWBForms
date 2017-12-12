
eng.validators["email"] = {type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"};

var monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function fechahoy(thisfecha) {

    var fecha = new Date(Date.now());

    var day = fecha.getDate();
    var monthIndex = fecha.getMonth();
    var year = fecha.getFullYear();
    var hora = fecha.getHours();
    var minutos = fecha.getMinutes();
    if (minutos < 10)
        minutos = "0" + minutos;
    var secs = fecha.getSeconds();
    if (secs < 10)
        secs = "0" + secs;

    if (thisfecha) {
        var strFecha = new String(thisfecha);
        year = strFecha.substring(0, strFecha.indexOf("-"));
        monthIndex = strFecha.substring(strFecha.indexOf("-") + 1, strFecha.lastIndexOf("-"));
        day = strFecha.substring(strFecha.lastIndexOf("-") + 1);
        return day + "/" + monthIndex + "/" + year;
    }

//2017-12-01T13:05:00.000

    return day + "/" + monthNames[monthIndex] + "/" + year + " " + hora + ":" + minutos + ":" + secs + " hrs.";

}

function datetimeNow() {

    var fecha = new Date(Date.now());

    var day = fecha.getDate();
    var monthIndex = fecha.getMonth();
    var year = fecha.getFullYear();
    var hora = fecha.getHours();
    var minutos = fecha.getMinutes();
    if (minutos < 10)
        minutos = "0" + minutos;
    var secs = fecha.getSeconds();
    if (secs < 10)
        secs = "0" + secs;


//2017-12-01T13:05:00.000

    return year+"-"+monthIndex+"-"+day +"T"+ hora + ":" + minutos + ":" + secs + "."+fecha.getMilliseconds();

}

eng.dataSources["Objects"]={
    scls: "Objects",
    modelid: "MEDIATECA",
    dataStore: "mongodb",
    displayField:"identifier",
    fields:[
        {name:"identifier",title:"Identificador",type:"string", required:true},
        {name:"body",title:"Registro",type:"string", required:true}
    ]     
};




eng.dataSources["Verbs"]={
    scls: "Verbs",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField:"name",
    fields:[
        {name:"cve",title:"Clave",type:"string", required:true},
        {name:"name",title:"Nombre",type:"string", required:true}
    ]     
};


var vals_verbs = eng.getDataSource("Verbs").toValueMap("cve","name");

eng.dataSources["MetaData_Prefix"]={
    scls: "MetaData_Prefix",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField:"name",
    fields:[
        {name:"cve",title:"Clave",type:"string", required:true},
        {name:"name",title:"Nombre",type:"string", required:true}
    ]     
};

var vals_meta = eng.getDataSource("MetaData_Prefix").toValueMap("cve","name");
/********** EndPoint ********/
eng.dataSources["EndPoint"]={
    scls: "EndPoint",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField:"name",
    fields:[
        {name:"name",title:"Nombre/Modelo",type:"string"},
        {name:"url",title:"URL",type:"string"},
        
        {name:"created",title:"Fecha",type:"date"}
    ]     
};



/********** Definición mapeo ********/
eng.dataSources["MapDefinition"]={
    scls: "MapDefinition",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField:"name",
    fields:[
        {name:"extractor", title:"Extractor",stype:"select", dataSource:"Extractor",required:true}, 
        {name:"name",title:"Nombre",type:"string", required:true},
        {name:"mapTable",title:"Tabla",stype:"grid", dataSource:"MapTable"}
    ]     
};

/********** Tabla de mapeo ********/
eng.dataSources["MapTable"]={
    scls: "MapTable",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField:"tagFrom+tagTo",
    fields:[
        {name:"property", title:"Propiedad",type:"string",required:true}, 
        {name:"supproperty", title:"Sub Propiedad",type:"string",required:true}, 
        {name:"Tipo", title:"Tipo",type:"string", required:true}, 
        {name:"valores", title:"Valor(es)",stype:"select", dataSource:"Valores", multiple:true, required:true}, 
        {name:"valor", title:"Valor",type:"string", required:true}, 
    ]     
};
/********** Tabla de mapeo ********/
eng.dataSources["Valores"]={
    scls: "Valores",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField:"tagFrom+tagTo",
    fields:[
        {name:"valor", title:"Valor",type:"string",required:true}, 
    ]     
};
/********** Extractor ********/
eng.dataSources["Extractor"]={
    scls: "Extractor",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField:"endpoint",
    fields:[
        {name:"name",title:"Nombre/Modelo",type:"string"},
        {name:"collection",title:"Nombre de la colección",type:"string"},
        {name:"url",title:"URL",type:"string"},
//        {name:"endpoint",title:"EndPoint",stype:"select", dataSource:"EndPoint", required:true},
        {name:"verbs",title:"Verbos",type:"select", 
        valueMap:vals_verbs, defaultValue:"Identify", required:true}, 
        {name:"prefix",title:"MetaData PREFIX",type:"select", 
        valueMap:vals_meta, defaultValue:"mods"}, 
        {name:"resumptionToken",title:"Soporta Resumption Token",type:"boolean", defaultValue:false},
        {name:"tokenValue",title:"Token",type:"string"},
        {name:"class",title:"Nombre de la Clase a utilizar",type:"string"},
        {name:"periodicity",title:"Periodicidad",type:"boolean"},
        {name:"interval",title:"Intervalo de tiempo (días)", type:"int"},
        {name:"mapeo",title:"Tabla de mapeo", stype:"select",  dataSource:"MapDefinition"},
        {name:"created",title:"Fecha creación",type:"string", useTextField:true},
        {name:"lastExecution",title:"Última ejecución",type:"string", useTextField:true},
        {name:"status",title:"Estatus",type:"select", valueMap:{"LOADED":"LOADED","STARTED":"STARTED","EXTRACTING":"EXTRACTING","STOPPED":"STOPPED", "FAILLOAD":"FAIL LOAD","ABORTED":"ABORTED" }, defaultValue:"LOADED"}, //STARTED | EXTRACTING | STOPPED
        {name:"rows2harvest",title:"Registros por cosechar",type:"int"},
        {name:"harvestered",title:"Registros cosechados",type:"int"},
        {name:"rows2Processed",title:"Registros por procesar",type:"int"},
        {name:"processed",title:"Registros procesados",type:"int"},
        {name:"cursor",title:"Tamaño del bloque",type:"int"},
        {name:"script",title:"Script de transformación",type:"string"}
    ]     
};

//dataProcessor
eng.dataProcessors["dpExtractor"] = {
    dataSources: ["Extractor"],
    actions:["add","update"],
    request: function(request, dataSource, action)
    {
        if(action==="add"){
            request.data.created=datetimeNow();
        } 
        return request;
    },
    response_: function(response, dataSource, action)
    {
        return response;
    }
};

eng.dataSources["Replace"]={
    scls: "Replace",
    modelid: "Cultura",
    dataStore: "mongodb",
    displayField:"name",
    fields:[
        {name:"occurrence",title:"Ocurrencia",type:"string", required:true},
        {name:"replace",title:"Remplazar por",type:"string", required:true}
    ]     
};