const {to}  =   require('await-to-js'); // Async Await Wrapper
const pe    =   require('parse-error'); // Check Object for any parse-errors

// Check for any parse error in response
module.exports.to = async (promise) => {
    let err, res;
    [err, res] = await to(promise);

    if(err){
        return [pe(err)];
    } 
    return [null, res];
};

// Response Error JSON
module.exports.ResponseError = function(res, err, code){ 
    if(typeof err == 'object' && typeof err.message != 'undefined'){
        err = err.message;
    }
    if(typeof code !== 'undefined') {
        res.statusCode = code;
    }
    return res.json({success:false, error: err});
};

// Response Success JSON
module.exports.ResponseSuccess = function(res, data, code){ 
    let send_data = {success:true};

    if(typeof data == 'object'){
        send_data = Object.assign(data, send_data);//merge the objects
    }
    if(typeof code !== 'undefined'){
        res.statusCode = code;
    } 
    return res.json(send_data)
};

// Throw Error
module.exports.ThrowError = function(err_message, log){ 
    if(log === true){
        console.error(err_message);
    }
    throw new Error(err_message);
};


