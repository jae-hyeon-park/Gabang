export const checkCategory = (category)=>{
    if(category == "electronics"){
        return 1;
    }
    else if(category == "books"){
        return 2;
    }
    else if(category == "clothing"){
        return 3;
    }
    
}

export const checkTransactionMethod = (methods) =>{
    console.log(methods);
    if(methods.length == 2){
        return "A";
    }else{
        if(methods=="direct"){
            return "G"
        }
        else if(methods=="delivery"){
            return "T"
        }
    }

}

export const checkDeliveryFee = (includeDeliveryFee) =>{
    console.log(includeDeliveryFee);
    if(includeDeliveryFee == "Y"){
        return true;
    }
    else if(includeDeliveryFee == "N"){
        return false;
    }

}