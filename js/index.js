Validator = function (options) { 
    var formElement = document.querySelector(options.form);
    var isFormValid = true;
    var ruleOptions = {};

    getParentElement = function(element ,selector) {
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement
            }
            else 
            element = element.parentElement;
        }
    }

    //Hàm kiểm tra onblur
    ValidatorOnBlur = function(inputElement, rule) {
        var errorMessage;

        // getParentElement(inputElement,options.parentForm)
        var errorElement = getParentElement(inputElement,options.parentForm).querySelector(options.errorNotify);

        var ruleFunction = ruleOptions[rule.selector];
        // console.log(ruleFunction);
        for(var i = 0; i < ruleFunction.length; ++i){
            errorMessage = ruleFunction[i](inputElement.value);
            if(errorMessage) break;
        }


        if(errorMessage){
            errorElement.innerText = errorMessage;
            // console.log(errorMessage);
            getParentElement(inputElement,options.parentForm).classList.add('invalid');
        }
        else {
            errorElement.innerText = '';
            getParentElement(inputElement,options.parentForm).classList.remove('invalid');
        }

        return !errorMessage;
    }

    
    if(formElement){

        formElement.onsubmit = function(e) {
            e.preventDefault();

            // hàm kiểm tra có input nào bị lỗi không
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
    
                if(!ValidatorOnBlur(inputElement,rule)){
                    isFormValid = false;
                }
              
    
            })
          

            // kiểm trả điều kiện để đẩy submit 
            if(isFormValid){

                if(typeof options.submit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]');
                
                    var submitForm = Array.from(enableInputs).reduce(function(values, input) {
                        values[input.name] = input.value
                        return values;
                    },{});
    
                    options.submit(submitForm);
                }
               

            }
            // else {
            //     console.log('co loi');
            // }
        }
       
        
        options.rules.forEach(function(rule) {
            var inputElement = formElement.querySelector(rule.selector);
            var errorElement = getParentElement(inputElement,options.parentForm).querySelector(options.errorNotify);

            if(Array.isArray(ruleOptions[rule.selector])){
                ruleOptions[rule.selector].push(rule.test);
            }   
            else {
                ruleOptions[rule.selector] = [rule.test];

            }
            
            

            if(inputElement){
                // khi blur vào
                inputElement.onblur = function() {  
                    ValidatorOnBlur(inputElement,rule);
                }

                // khi nhập dữ liệu 
                inputElement.oninput = function() {
                    errorElement.innerText = '';
                    getParentElement(inputElement,options.parentForm).classList.remove('invalid');
                }
            
            }
        })

        // console.log(ruleOptions);
    }

    


}




Validator.isRequired = function(selector, message) {
    return {
        selector : selector,
        test : function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập lại thông tin'; 
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector : selector,
        test : function(value) {
            var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

            return regex.test(value) ? undefined :  message || 'Vui lòng nhập lại thông tin';
        }
    }

}

Validator.minLength = function(selector, min) {
    return {
        selector : selector,
        test : function(value) {
     
            return value.length >= min ? undefined : `Mật khẩu tối thiểu ${min} kí tự`;
        }
    }

}

Validator.isConfirmed = function(selector, checkValue, message) {
    return {
        selector : selector,
        test : function(value) {
            return value === checkValue() ? undefined : message || 'Giá trị nhập vào không trùng khớp';
        }
    }

}