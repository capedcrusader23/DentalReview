const {InvalidPropertiesException} = require("../utils/exceptions/validation.exception")
class SendSmsValidation{
    request;

    constructor(request){
        this.request = request;
    }

    validate(){
        if(this.request.firstName == null || this.request.lastName == null || this.request.pricing == null || this.request.phoneNo == null){
            throw new InvalidPropertiesException("Input fields have missing values");
        }
        if(this.request.firstName == "" || this.request.lastName == "" || this.request.pricing == "" || this.request.phoneNo == ""){
            throw new InvalidPropertiesException("Input fields cannot be empty");
        }
    }
}

module.exports = SendSmsValidation