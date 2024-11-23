var mysql = require("mysql2");
var db = require("./db.js");

async function InsertInto(table_name,data){

  var cols = CreateSQLTuple(data,true)
  var values = CreateSQLTuple(data,false)

  var insertion = `INSERT INTO ${table_name} ${cols} VALUES ${values}`

   db.execute(insertion).then((r)=>{
     console.log(r)
     return r;
   }).catch((err)=>{
     console.log(err);
     return false;
   });

}

async function findUser(username,cb){
  if(!username){
    cb([])
    return;
  }
  db.execute(`SELECT * FROM user WHERE username = ${JSON.stringify(username)}`).then((response)=>{
    cb(response[0])
  }).catch((err)=>{
    console.log(err);
    cb([])
  })

}


async function findUserPallets(user_id,cb){

  db.execute(`SELECT * FROM pallete WHERE user_id = ${JSON.stringify(user_id)}`).then((response)=>{
    cb(response[0])
  }).catch((err)=>{
    console.log(err);
    cb([])
  })

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
module.exports.findUser = findUser;
module.exports.findUserPallets = findUserPallets;
