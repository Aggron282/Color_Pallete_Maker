function CreatePalleteCategories(palletes){
  var categorized_palletes = [];

  for(var i =0; i < palletes.length; i++){
    var pallete = palletes[i]
    GenerateCatagory(pallete);
  }

  return categorized_palletes;

  function GenerateCatagory(pallete,id){

    if(categorized_palletes.length <0){
      categorized_palletes.push({
        category:pallete.catagory,
        palletes:[pallete]
      });
    }

    for(var i =0; i < categorized_palletes.length; i++){

        if(categorized_palletes[i].category == pallete.category){
            categorized_palletes[i].palletes.push(pallete);
            return;
        }

    }

    categorized_palletes.push({
      category:pallete.catagory,
      id:id,
      palletes:[pallete]
    });

  }

}

module.exports.CreatePalleteCategories = CreatePalleteCategories;
