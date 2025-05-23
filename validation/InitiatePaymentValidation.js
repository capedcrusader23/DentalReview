const {InvalidPropertiesException} = require("../utils/exceptions/validation.exception")
class initiatePaymentValidation{
    request;

    constructor(request){
        this.request = request;
    }

    validate(){
        if(this.request.appointmentId == null || this.request.amount == null || this.request.optedPricing == null){
            throw new InvalidPropertiesException("Input fields have missing values");
        }
        if(this.request.appointmentId == "" || this.request.amount <0 || this.request.optedPricing <0){
            throw new InvalidPropertiesException("Input fields cannot be empty");
        }
    }
}

module.exports = initiatePaymentValidation