define(
    function () {
        //Removed cyrillic chars
        var phoneRegExp = /^[0-9\+]?([0-9-\s()])+[0-9()]$/,
            intNumberRegExp = /[0-9]+/,
            floatNumberRegExp = /(^[0-9]+(\.[0-9]{1,2})?)$/,
            nameRegExp = /^[a-zA-Z]+[a-zA-Z-_\s]+$/,
            companyNameRegExp = /[\w\.@]{3,20}$/,
            groupsNameRegExp = /[a-zA-Z0-9]+[a-zA-Z0-9-,#@&*-_\s()\.\/\s]+$/,
            loginRegExp = /[\w\.@]{4,100}$/,
            passRegExp = /^[\w\.@]{3,100}$/,
            skypeRegExp = /^[\w\._@]{6,100}$/,
            workflowRegExp = /^[a-zA-Z0-9\s]{2,100}$/,
            invalidCharsRegExp = /[~<>\^\*₴]/,
            countryRegExp = /[a-zA-Z\s-]+/,
            zipRegExp = /[a-zA-Z0-9\s-]+$/,
            streetRegExp = /^[a-zA-Z0-9\s][a-zA-Z0-9-,\s\.\/\s]+$/,
            moneyAmountRegExp = /^([0-9]{1,9})\.?([0-9]{1,2})?$/,
            emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            urlRegExp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i,
            loggedRegExp = /^([0-9]{1,9})\.?([0-9]{1,2})?$/;
        var MIN_LENGTH = 2,
            LOGIN_MIN_LENGTH = 4,
            WORKFLOW_MIN_LENGTH = 3;

        var validateCompanyName = function(validatedString){
            return companyNameRegExp.test(validatedString);

        }; var validateUrl = function(validatedString){
            return urlRegExp.test(validatedString);
        };

        var validateEmail = function(validatedString){
            return emailRegExp.test(validatedString);
        };

        var validateLogin = function(validatedString){
            return loginRegExp.test(validatedString);
        };

        var validateSkype = function(validatedString){
            return skypeRegExp.test(validatedString);
        };

        var validateZip = function(validatedString){
            return zipRegExp.test(validatedString);
        };

        var requiredFieldLength = function(validatedString){
            return validatedString.length >= MIN_LENGTH;
        };

        var validatePhone = function(validatedString){
            return phoneRegExp.test(validatedString);
        };

        var validateName = function(validatedString){
            return nameRegExp.test(validatedString);
        };

        var validateGroupsName = function(validatedString){
            return groupsNameRegExp.test(validatedString);
        };
        var validateWorkflowName = function(validatedString){
            return workflowRegExp.test(validatedString);
        };

        var validatePass= function(validatedString){
            return passRegExp.test(validatedString);
        };

        var validateCountryName = function(validatedString){
            return countryRegExp.test(validatedString);
        };

        var validateStreet = function(validatedString){
            return streetRegExp.test(validatedString);
        };

        var validateLoggedValue = function(validatedString){
            return loggedRegExp.test(validatedString);
        };

        var validateFloat = function(validatedString){
            return floatNumberRegExp.test(validatedString);
        };

        var validateNumber = function(validatedString){
            return intNumberRegExp.test(validatedString);
        };

        var validateMoneyAmount = function(validatedString){
            return moneyAmountRegExp.test(validatedString);
        };

        var validDate = function(validatedString){
            return new Date(validatedString).getMonth() ? true : false;
        };

        var hasInvalidChars = function(validatedString){
            return invalidCharsRegExp.test(validatedString);
        };

        var errorMessages = {
            userName: "field value is incorrect. It should contain only the following symbols: A-Z, a-z",
            invalidNameMsg: "field value is incorrect. It should start with letter or number",
            invalidLoginMsg: "field value is incorrect. It should contain only the following symbols: A-Z, a-z, 0-9, _ @",
            notNumberMsg: "field should contain a valid integer value",
            notPriceMsg: "field should contain a valid price value with only two digest after dot and contain only the following symbols: 0-9, .",
            invalidCountryMsg: "field should contain only letters, whitespaces and '-' sign",
            loggedNotValid: "field should contain a valid decimal value with max 1 digit after dot",
            minLengthMsg: function(minLength){ return "field should be at least " + minLength + " characters long"},
            invalidMoneyAmountMsg: "field should contain a number with max 2 digits after dot",
            invalidEmailMsg: "field should contain a valid email address",
            requiredMsg: "field can not be empty",
            invalidCharsMsg: "field can not contain '~ < > ^ * ₴' signs",
            invalidStreetMsg: "field can contain only letters, numbers and '. , - /' signs",
            invalidPhoneMsg: "field should contain only numbers and '+ - ( )' signs",
            invalidZipMsg: "field should contain only letters, numbers and '-' sing",
            invalidUrl:'field value is incorrect',
            passwordsNotMatchMsg: "Password and confirm password field do not match"
        };

        var checkNameField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(fieldValue.length < MIN_LENGTH) {
                    errorArray.push([fieldName, errorMessages.minLengthMsg(MIN_LENGTH)].join(' '));
                    return;
                }
                if(!validateName(fieldValue)) errorArray.push([fieldName, errorMessages.userName].join(' '));
            } else{
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(!validateName(fieldValue)) errorArray.push([fieldName, errorMessages.userName].join(' '));
                }
            }
        };

        var checkLogedField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(fieldValue.length < MIN_LENGTH) {
                    errorArray.push([fieldName, errorMessages.minLengthMsg(MIN_LENGTH)].join(' '));
                    return;
                }
                if(!validateLoggedValue(fieldValue)) errorArray.push([fieldName, errorMessages.invalidNameMsg].join(' '));
            } else{
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(!validateLoggedValue(fieldValue)) errorArray.push([fieldName, errorMessages.invalidNameMsg].join(' '));
                }
            }
        };

        var checkPriceField = function(errorArray, required, fieldValue, fieldName) {
            if (required && hasInvalidChars(fieldValue)) {
                errorArray.push([fieldName, errorMessages.notPriceMsg].join(' '));
                return;
            }
            if (fieldValue && !validateFloat(fieldValue)) {
                errorArray.push([fieldName, errorMessages.notPriceMsg].join(' '));
            }
        };

        var checkNumberField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.notNumberMsg].join(' '));
                    return;
                }
                if(!validateNumber(fieldValue)) errorArray.push([fieldName, errorMessages.notNumberMsg].join(' '));
            } else{
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.notNumberMsg].join(' '));
                        return;
                    }
                    if(!validateNumber(fieldValue)) errorArray.push([fieldName, errorMessages.notNumberMsg].join(' '));
                }
            }
        };

        var checkGroupsNameField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(fieldValue.length < MIN_LENGTH) {
                    errorArray.push([fieldName, errorMessages.minLengthMsg(MIN_LENGTH)].join(' '));
                    return;
                }
                if(!validateGroupsName(fieldValue)) errorArray.push([fieldName, errorMessages.invalidNameMsg].join(' '));
            } else{
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(!validateGroupsName(fieldValue)) errorArray.push([fieldName, errorMessages.invalidNameMsg].join(' '));
                }
            }
        };

        var checkLoginField = function(errorArray, required, fieldValue, fieldName) {
            if (required && !fieldValue) {
                errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                return;
            }
            if (fieldValue && hasInvalidChars(fieldValue)) {
                errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                return;
            }
            if (fieldValue && fieldValue.length < LOGIN_MIN_LENGTH) {
                errorArray.push([fieldName, errorMessages.minLengthMsg(LOGIN_MIN_LENGTH)].join(' '));
                return;
            }
            if (fieldValue && !validateLogin(fieldValue)) {
                errorArray.push([fieldName, errorMessages.invalidLoginMsg].join(' '));
            }
        };

        var checkSkypeField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(fieldValue.length < 6) {
                    errorArray.push([fieldName, errorMessages.minLengthMsg(6)].join(' '));
                    return;
                }
                if(!validateWorkflowName(fieldValue)) errorArray.push([fieldName, errorMessages.invalidLoginMsg].join(' '));
            } else{
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(fieldValue.length < 6) {
                        errorArray.push([fieldName, errorMessages.minLengthMsg(6)].join(' '));
                        return;
                    }
                    if(!validateSkype(fieldValue)) errorArray.push([fieldName, errorMessages.invalidLoginMsg].join(' '));
                }
            }
        };

        var checkWorkflowNameField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(fieldValue.length < 3) {
                    errorArray.push([fieldName, errorMessages.minLengthMsg(WORKFLOW_MIN_LENGTH)].join(' '));
                    return;
                }
                if(!validateWorkflowName(fieldValue)) errorArray.push([fieldName, errorMessages.invalidLoginMsg].join(' '));
            } else{
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(fieldValue.length < WORKFLOW_MIN_LENGTH) {
                        errorArray.push([fieldName, errorMessages.minLengthMsg(3)].join(' '));
                        return;
                    }
                    if(!validateName(fieldValue)) errorArray.push([fieldName, errorMessages.invalidLoginMsg].join(' '));
                }
            }
        };

        var checkPhoneField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(fieldValue.length < 5) {
                    errorArray.push([fieldName, errorMessages.minLengthMsg(5)].join(' '));
                    return;
                }
                if(!validatePhone(fieldValue)) errorArray.push([fieldName, errorMessages.invalidPhoneMsg].join(' '));
            } else {
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(fieldValue.length < 5) {
                        errorArray.push([fieldName, errorMessages.minLengthMsg(5)].join(' '));
                        return;
                    }
                    if(!validatePhone(fieldValue)) errorArray.push([fieldName, errorMessages.invalidPhoneMsg].join(' '));
                }
            }
        };

        var checkCountryCityStateField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(!validateCountryName(fieldValue)) errorArray.push([fieldName, errorMessages.invalidCountryMsg].join(' '));
            } else {
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(!validateCountryName(fieldValue)) errorArray.push([fieldName, errorMessages.invalidCountryMsg].join(' '));
                }
            }
        };

        var checkZipField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(!validateZip(fieldValue)) errorArray.push([fieldName, errorMessages.invalidZipMsg].join(' '));
            } else {
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(!validateZip(fieldValue)) errorArray.push([fieldName, errorMessages.invalidZipMsg].join(' '));
                }
            }
        };

        var checkStreetField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(!validateStreet(fieldValue)) errorArray.push([fieldName, errorMessages.invalidStreetMsg].join(' '));
            } else {
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(!validateStreet(fieldValue)) errorArray.push([fieldName, errorMessages.invalidStreetMsg].join(' '));
                }
            }
        };

        var checkUrlField = function(errorArray, required, fieldValue, fieldName){
            if(required && !fieldValue){
                errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                return;
            }
            if(fieldValue && hasInvalidChars(fieldValue)) {
                errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                return;
            }
            if(fieldValue && !validateUrl(fieldValue)) {
                errorArray.push([fieldName, errorMessages.invalidUrl].join(' '));
            }
        };

        var checkCompanyNameField = function(errorArray, required, fieldValue, fieldName){
            if(required && !fieldValue){
                errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                return;
            }
            if(fieldValue && hasInvalidChars(fieldValue)) {
                errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                return;
            }
            if(fieldValue && !validateCompanyName(fieldValue)) {
                errorArray.push([fieldName, errorMessages.invalidLoginMsg].join(' '));
            }
        };

        var checkEmailField = function(errorArray, required, fieldValue, fieldName){
            if(required && !fieldValue){
                errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                return;
            }
            if(fieldValue && hasInvalidChars(fieldValue)) {
                errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                return;
            }
            if(fieldValue && !validateEmail(fieldValue)) errorArray.push([fieldName, errorMessages.invalidEmailMsg].join(' '));
        };

        var checkNotesField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
            } else {
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                }
            }
        };

        var checkMoneyField = function(errorArray, required, fieldValue, fieldName){
            if(required){
                if(!fieldValue){
                    errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                    return;
                }
                if(hasInvalidChars(fieldValue)) {
                    errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                    return;
                }
                if(!validateMoneyAmount(fieldValue))
                    errorArray.push([fieldName, errorMessages.invalidMoneyAmountMsg].join(' '));
            } else {
                if(fieldValue){
                    if(hasInvalidChars(fieldValue)) {
                        errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                        return;
                    }
                    if(!validateMoneyAmount(fieldValue))
                        errorArray.push([fieldName, errorMessages.invalidMoneyAmountMsg].join(' '));
                }
            }
        };

        var checkPasswordField = function(errorArray, required, fieldValue, fieldName){
            if(required && !fieldValue){
                errorArray.push([fieldName, errorMessages.requiredMsg].join(' '));
                return;
            }
            if(fieldValue && hasInvalidChars(fieldValue)) {
                errorArray.push([fieldName, errorMessages.invalidCharsMsg].join(' '));
                return;
            }
            if(fieldValue && fieldValue.length < 3) {
                errorArray.push([fieldName, errorMessages.minLengthMsg(3)].join(' '));
                return;
            }
            if(!validatePass(fieldValue && fieldValue)) {
                errorArray.push([fieldName, errorMessages.invalidLoginMsg].join(' '));
            }
        };

        var comparePasswords = function(errorArray, password, confirmPass){
            if(password && confirmPass)
                if(password !== confirmPass)
                    errorArray.push(errorMessages.passwordsNotMatchMsg);
        };

        var checkFirstDateIsGreater = function(errorArray, greaterDate, greaterDateName, smallerDate, smallerDateName){
            if((new Date(greaterDate) < new Date(smallerDate))){
                errorArray.push(smallerDateName + " can not be greater than " + greaterDateName);
                return;
            }
        };

        return {
            //comparePasswords:comparePasswords,
            checkPasswordField:checkPasswordField,
            checkLoginField:checkLoginField,
            //checkMoneyField:checkMoneyField,
            //checkFirstDateIsGreater:checkFirstDateIsGreater,
            //checkNotesField:checkNotesField,
            checkEmailField:checkEmailField,
            checkUrlField:checkUrlField,
            checkCompanyNameField: checkCompanyNameField,
            //checkStreetField:checkStreetField,
            //checkZipField:checkZipField,
            //checkCountryCityStateField:checkCountryCityStateField,
            //checkPhoneField:checkPhoneField,
            //checkNameField:checkNameField,
            //checkGroupsNameField:checkGroupsNameField,
            //validEmail: validateEmail,
            //withMinLength: requiredFieldLength,
            //validLoggedValue: validateLoggedValue,
            //errorMessages: errorMessages,
            //checkNumberField: checkNumberField,
            //validStreet: validateStreet,
            //validDate: validDate,
            //validPhone: validatePhone,
            //validName: validateName,
            validGroupsName: validateGroupsName,
            //validMoneyAmount: validateMoneyAmount,
            //checkLogedField:checkLogedField,
            //checkWorkflowNameField:checkWorkflowNameField,
            //checkSkypeField:checkSkypeField,
            checkPriceField:checkPriceField
        }
    });
