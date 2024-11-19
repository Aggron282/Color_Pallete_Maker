var mysql = require("mysql2");
var db = require("./db.js");

function InsertInto(table_name,data){

  var cols = CreateSQLTuple(data,true)
  var values = CreateSQLTuple(data,false)

  var insertion = `INSERT INTO ${table_name} ${cols} VALUES ${values}`

   db.execute(insertion).then((r)=>{
     console.log(r)
     return true;
   }).catch((err)=>{
     console.log(err);
     return false;
   });

}

function CreateSQLTuple(data,isCol){

  var tuple_data = [];

  for(var i =0; i < data.length; i ++){

    if(isCol){
      tuple_data.push(data[i].col);
    }
    else{
      tuple_data.push(JSON.stringify(data[i].value));
    }

  }

  var tuple = CreateTuple(tuple_data);
  return tuple;

}

function CreateTuple(data){

  var tuple = "("

  for(var i =0; i < data.length; i ++){
    if(i == data.length - 1){
      tuple += data[i];
    }else{
      tuple += data[i] + ",";
  }


  }
  tuple.slice(0, -1);
  tuple += ")";
  return tuple;

}

module.exports.InsertInto = InsertInto;
