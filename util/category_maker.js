

function CreatePalleteCategories(palletes){
  var categorized_palletes = [];

  for(var i =0; i < palletes.length; i++){
    var pallete = palletes[i]
    GenerateCategory(pallete,i);
  }

  function GenerateCategory(pallete,id){

    if(categorized_palletes.length <0){

      categorized_palletes.push({
        category:pallete.category,
        palletes:[pallete],
        id:id
      });

    }

    for(var i =0; i < categorized_palletes.length; i++){

        if(categorized_palletes[i].category == pallete.category){
            categorized_palletes[i].palletes.push(pallete);
            return;
        }

    }

    categorized_palletes.push({
      category:pallete.category,
      id:id,
      palletes:[pallete]
    });

  }

  return categorized_palletes;

}

module.exports.CreatePalleteCategories = CreatePalleteCategories;
