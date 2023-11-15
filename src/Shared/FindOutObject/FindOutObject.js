const findOutObject = {
    falsy:(object)=>{
        const result = [];
        for (const key in object){
            if(object[key] === null || object[key] === undefined || object[key]===""){
                result.push(key);
            }
        }
        return result;
    }
}

export default findOutObject;
