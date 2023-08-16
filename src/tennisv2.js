var Datastore = require("nedb");
var db = new Datastore();
var BASE_API_PATH = "/api/v2/tennis"; 
const express = require("express");
const app = express();

var premierStats = [];


var paths='/remoteAPI';




module.exports.register = (app) => {
    
    //Portal de Documentacion

    app.get(BASE_API_PATH+"/docs",(req,res)=>
    {
        res.redirect("https://documenter.getpostman.com/view/19586040/UyrBiFce");
    });

    db.insert(premierStats);

    //Constructor

     //GET inicial (loadInitialData) para inicializar la BD (constructor)

     app.get(BASE_API_PATH+"/loadInitialData",(req,res)=>{

        var statsIni = [
            {
                country: "spain",
                year: 2017,
                most_grand_slam: 2,
                masters_finals: 2,
                olympic_gold_medals: 0
            },
            {
                country: "spain",
                year: 2019,
                most_grand_slam: 2,
                masters_finals: 2,
                olympic_gold_medals: 0
            },
            {
                country: "great-britain",
                year: 2012,
                most_grand_slam: 1,
                masters_finals: 0,
                olympic_gold_medals: 1
            },
            {
                country: "russia",
                year: 2021,
                most_grand_slam: 1,
                masters_finals: 1,
                olympic_gold_medals: 0
            },
            {
                country: "swirtzeland",
                year: 2008,
                most_grand_slam: 1,
                masters_finals: 0,
                olympic_gold_medals: 0
            },
            {
                country: "serbia",
                year: 2019,
                most_grand_slam: 3,
                masters_finals: 1,
                olympic_gold_medals: 0
            },
            {
                country: "russia",
                year: 2021,
                most_grand_slam: 1,
                masters_finals: 1,
                olympic_gold_medals: 0
            },
            {
                country: "cameroon",
                year: 2013,
                most_grand_slam: 0,
                masters_finals: 0,
                olympic_gold_medals: 0
            },
            {
                country: "belize",
                year: 2000,
                most_grand_slam: 0,
                masters_finals: 0,
                olympic_gold_medals: 0
            },
            {
                country: "pakistan",
                year: 2019,
                most_grand_slam: 0,
                masters_finals: 0,
                olympic_gold_medals: 0
            },
            {
                country: "andorra",
                year: 2010,
                most_grand_slam: 0,
                masters_finals: 0,
                olympic_gold_medals: 0
            },
            {
                country: "albania",
                year: 2018,
                most_grand_slam: 0,
                masters_finals: 0,
                olympic_gold_medals: 0
            },
            {
                country: "paraguay",
                year: 2008,
                most_grand_slam: 0,
                masters_finals: 0,
                olympic_gold_medals: 0
            }
        ];

        // Inicialización base de datos
        //Borra todo lo anterior para evitar duplicidades al hacer loadInitialData
        db.remove({}, { multi: true }, function (err, numRemoved) {
        });

        // Inserta los datos iniciales en la base de datos
        db.insert(statsIni);

        res.send(JSON.stringify(statsIni,null,2));


    });


    //GET 
    app.get(BASE_API_PATH,(req, res)=>{
    
        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;

        //Comprobamos query

        for(var i = 0; i<Object.keys(req.query).length;i++){
            var element = Object.keys(req.query)[i];
            if(element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset" && element != "fields"){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }

        //Comprobamos si from es mas pequeño o igual a to
        if(from>to){
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        db.find({},function(err, filteredList){

            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            // Apartado para búsqueda por año
            
            if(year != null){
                var filteredList = filteredList.filter((reg)=>
                {
                    return (reg.year == year);
                });
                if (filteredList==0){
                    res.sendStatus(404, "NO EXISTE");
                    return;
                }
            }
    
            // Apartado para from y to
            
            if(from != null && to != null){
                filteredList = filteredList.filter((reg)=>
                {
                    return (reg.year >= from && reg.year <=to);
                });
    
                if (filteredList==0){
                    res.sendStatus(404, "NO EXISTE");
                    return;
                }    

                
            }
            // RESULTADO
    
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredList = paginacion(req,filteredList);
            }
            filteredList.forEach((element)=>{
                delete element._id;
            });

            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "country" && element != "year" && element != "most_grand_slam" && element != "masters_finals" && element != "olympic_gold_medals"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = comprobar_fields(req,filteredList);
            }

            res.send(JSON.stringify(filteredList,null,2));
        })
    })
    
    // GET por país
    
    app.get(BASE_API_PATH+"/:country",(req, res)=>{
    
        var country =req.params.country;
        var from = req.query.from;
        var to = req.query.to;

        //Comprobamos query

        for(var i = 0; i<Object.keys(req.query).length;i++){
            var element = Object.keys(req.query)[i];
            if(element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset" && element != "fields"){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }

        //Comprobamos si from es mas pequeño o igual a to
        if(from>to){
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        db.find({}, function(err,filteredList){
            
            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            filteredList = filteredList.filter((reg)=>
            {
                return (reg.country == country);
            });
        
            // Apartado para from y to
            var from = req.query.from;
            var to = req.query.to;
    
            //Comprobamos si from es mas pequeño o igual a to
            if(from>to){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        
            if(from != null && to != null && from<=to){
                filteredList = filteredList.filter((reg)=>
                {
                   return (reg.year >= from && reg.year <=to);
                }); 
                
            }
            //COMPROBAMOS SI EXISTE
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
                return;
            }
            //RESULTADO
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredList = paginacion(req,filteredList);
            }
            filteredList.forEach((element)=>{
                delete element._id;
            });

            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "country" && element != "year" && element != "most_grand_slam" && element != "masters_finals" && element != "olympic_gold_medals"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = comprobar_fields(req,filteredList);
            }

            res.send(JSON.stringify(filteredList,null,2));
        })

    })
    
    // GET por país y año
    
    app.get(BASE_API_PATH+"/:country/:year",(req, res)=>{
    
        var country =req.params.country
        var year = req.params.year

        db.find({},function(err, filteredList){

            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            filteredList = filteredList.filter((reg)=>
            {
                return (reg.country == country && reg.year == year);
            });
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
                return;
            }
    
            //RESULTADO
    
            //Paginación
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredList = paginacion(req,filteredList);
                res.send(JSON.stringify(filteredList,null,2));
            }
            filteredList.forEach((element)=>{
                delete element._id;
            });

            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "country" && element != "year" && element != "most_grand_slam" && element != "masters_finals" && element != "olympic_gold_medals"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = comprobar_fields(req,filteredList);
            }

            res.send(JSON.stringify(filteredList[0],null,2));
        });

    })
    /*------------------- POSTs -------------------*/


    //POST A LA LISTA DE RECURSOS DE PREMIER-LEAGUE-STATS 
    app.post(BASE_API_PATH,(req,res)=>{
        var dataNew = req.body;
        var countryNew = req.body.country;
        var yearNew = req.body.year;
        
        
        db.find({ country: countryNew, year: yearNew }, (err, data) => {
            if (err) {
                res.sendStatus(500, "ERROR");
            } else {
                if (data.length == 0) {
                    if (!dataNew.country ||
                        !dataNew.year ||
                        !dataNew.most_grand_slam ||
                        !dataNew.masters_finals ||
                        !dataNew.olympic_gold_medals) {
                        res.sendStatus(400,"FORMAT INCORRETCT");
                    }else {
                        db.insert(dataNew);
                        res.sendStatus(201,"CREATED");                    
                    }
                } else {
                    res.sendStatus(409, "CONFLICT");
                }
            }
        });
    });

     //POST A UN RECURSO(No está permitido)
     app.post(BASE_API_PATH+"/:country/:year",(req,res)=>{
        res.sendStatus(405, "METHOD NOT ALLOWED");
    });

    /*------------------- PUTs -------------------*/

     //PUT A UN RECURSO CONCRETO POR COUNTRY/YEAR
     app.put(BASE_API_PATH+"/:country/:year", (req,res) => {
        
        var reqcountry = req.params.country;
        var reqyear = parseInt(req.params.year);
        var data = req.body;

        if (Object.keys(data).length != 5) {
            res.sendStatus(400, "BAD REQUEST");
        }        
        else {
            db.update({ country: reqcountry, year: reqyear }, { $set: data }, {}, function (err, dataUpdate) {
                if (err) {
                    res.sendStatus(500, "ERROR");
                } else {
                    if (dataUpdate == 0) {
                        res.sendStatus(404, "DATA NOT FOUND");
                    }
                    if(reqcountry != data.country || reqyear != data.year){
                        res.sendStatus(400,"BAD REQUEST");
                        return;
                    }
                    else {
                        res.sendStatus(200, "OK");
                    }
                }
            });
        }
    });

     //PUT A UNA LISTA DE RECURSOS DE DEFENSEs STATS (Debe dar error)
     app.put(BASE_API_PATH,(req,res) => {
        res.sendStatus(405);
    });



    /*------------------- DELETEs -------------------*/


     //DELETE A LISTA DE RECURSOS
     app.delete(BASE_API_PATH, (req,res) => {
        db.remove({}, {multi: true}, (err, numDataRemoved) => {
            if (err || numDataRemoved == 0){
                res.sendStatus(500, "ERROR");
            }else{
                res.sendStatus(200,"DELETED");
            }
        });
    });

    //DELETE A UN RECURSO POR COUNTRY/YEAR
    app.delete(BASE_API_PATH + "/:country/:year", (req,res)=>{
        var reqcountry = req.params.country;
        var reqyear = parseInt(req.params.year);
        db.remove({country : reqcountry, year : reqyear},{multi:true}, (err, data) => {
            if (err) {
                res.sendStatus(500, "ERROR");
            } else {
                if(data != 0){
                    res.sendStatus(200,"DELETED");
                }else{
                    res.sendStatus(404, "NOT FOUND");
                }
            }
        });
    });

    function paginacion(req, lista){

        var res = [];
        const limit = req.query.limit;
        const offset = req.query.offset;
        
        if(limit < 1 || offset < 0 || offset > lista.length){
            res.push("ERROR EN PARAMETROS LIMIT Y/O OFFSET");
            return res;
        }

        res = lista.slice(offset,parseInt(limit)+parseInt(offset));
        return res;

    }

    function comprobar_fields(req, lista){
        var fields = req.query.fields;

        var contieneCountry = false;
        var contieneYear = false;
        var contienemost_grand_slam = false;
        var contienemasters_finals = false;
        var contieneolympic_gold_medals = false;
        fields = fields.split(",");

        for(var i = 0; i<fields.length;i++){
            var element = fields[i];
            if(element=='country'){
                contieneCountry=true;
            }
            if(element=='year'){
                contieneYear=true;
            }
            if(element=='most_grand_slam'){
                contienemost_grand_slam=true;
            }
            if(element=='masters_finals'){
                contienemasters_finals=true;
            }
            if(element=='olympic_gold_medals'){
                contieneolympic_gold_medals=true;
            }
        }

        //Country
        if(!contieneCountry){
            lista.forEach((element)=>{
                delete element.country;
            })
        }

        //Year
        if(!contieneYear){
            lista.forEach((element)=>{
                delete element.year;
            })
        }

        //most_grand_slam
        if(!contienemost_grand_slam){
            lista.forEach((element)=>{
                delete element.most_grand_slam;
            })
        }

        //masters_finals
        if(!contienemasters_finals){
            lista.forEach((element)=>{
                delete element.masters_finals;
            })
        }

        //olympic_gold_medals
        if(!contieneolympic_gold_medals){
            lista.forEach((element)=>{
                delete element.olympic_gold_medals;
            })
        }

        return lista;

    }


};