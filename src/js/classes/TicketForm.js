import $ from "jquery";

export class TicketForm {
    constructor(options) {
        this.form = options.form;

        this.requireFiled = 'validator-require';
        this.typeFiled = 'validator-type';

        this.massages = {
            required: 'Поле обязательное для заполнения!',
            email: 'Некорректный Email адрес!',
            phone: 'Некорректный телефон!',
            code: "Некорректный уникальный код",
            card: "Некорректный номер карты"
        };

    }

    init() {
        this.events();
    }

    events() {
        this.bindTextInputFocus();
        this.bindTextInputBlur();
        this.bindInputType();
        this.bindCheckAgreement();
        this.bindCloseFormSuccessMessage();
        this.submit();
    }

    submit() {
        let self = this;
        this.form.on('submit', function(event){
            event.preventDefault();
            if (self.validate()) {
                self.submitEvent();
            }
        });
    }

    submitEvent () {
        this.clearErrors($('.js-ticket-form'));
        let self = this;
        $.ajax({
            type: "POST",
            url: "/local/script/ajax.php",
            data: $(".js-ticket-form").serialize(),
            dataType: "json",
            success: function (data) {
                if (data.status == 'smscheck') {
                    $(".js-ticket-form-success-after-action").find("[name=tel]").val(data.tel);
                    self.smsCheck();
                }
                else if (data.status == 'success' ) {
                    self.showSuccessMessage();
                }
                else if (data.status == 'warning' && data.code) {
                    let errors = {};
                    errors[data.code] = data.mess;
                    self.setErrors(errors, $('.js-ticket-form'));
                }
                else {
                    self.showErrMessage();
                }
            },
            error: function (data) {
                self.showSuccessMessage();
            }
        });
    }

    smsCheck () {
        $('.js-ticket-form-success').hide();
        $('.js-ticket-form-success-after-action').show();
        //ym(55166008, 'reachGoal', 'reg_code');
        //self.showSuccessMessage();
    }

    get fields() {
        return this.form.find('.ticket-form__elem').find('input');
    }

    validate() {
        let errors = {};
        this.fields.map((key, item) => {
            let value = $(item).val();
        let id  = $(item).attr('id');

        if ($(item).data(this.requireFiled) === true && this.constructor.checkEmpty(value)) {
            errors[id] = this.massages.required;
        }

        if (!this.constructor.checkEmpty(value)) {
            switch ($(item).data(this.typeFiled)) {
                case 'email':
                    if (this.constructor.checkEmail(value)) {
                        errors[id] = this.massages.email;
                    }
                    break;
                case 'phone':
                    if (this.constructor.checkPhone(value)) {
                        errors[id] = this.massages.phone;
                    }
                    break;
                default:
                    break;
            }
            if ("card" == $(item).attr("name")) {
                var s = value.substr(0, 3);
                if(12 != value.length || "295" != s && "296" != s)
                    errors[id] = this.massages.card;
            }
            if ("code" == $(item).attr("name") && 21 != value.replace(/\D+/g, "").length)
                errors[id] = this.massages.code;
        }

    });

        this.clearErrors();
        this.setErrors(errors);

        return $.isEmptyObject(errors);
    }

    static checkEmpty(string) {
        return string === '';
    }

    static checkEmail(string) {
        return !!string.search(/^[-._a-z0-9]+@+[a-z0-9-]+\.[a-z]{2,6}$/i);
    }

    static checkPhone(string) {
        return !!string.search(/^\+7\(([0-9]{3})\)([0-9]{3})-([0-9]{2})-([0-9]{2})$/i);
    }

    bindTextInputFocus() {
        this.fields.on('focus', function() {
            $(this).closest('.ticket-form__elem').addClass('active');
        });
    }

    bindTextInputBlur() {
        this.fields.on('blur', function() {
            let inputElem = $(this);
            let inputElemParent = inputElem.closest('.ticket-form__elem');
            let getVal = inputElem.val();

            inputElemParent.removeClass('active');
            inputElemParent.addClass('success');

            if (!getVal.length) {
                inputElemParent.removeClass('success');
            }
        });
    }

    bindCheckAgreement() {
        let submitBtn = this.form.find('.js-ticket-form__submit-button');
        this.form.find('.js-verification-check').find('input').on('change', function() {
            $(this).prop('checked') ? submitBtn.prop('disabled', false) : submitBtn.prop('disabled', true);
        });
    }

    bindCloseFormSuccessMessage() {
        let self = this;
        $('.js-close-form-success-message').on('click', function () {
            $('.js-ticket-form-success').hide();
            $('.js-ticket-form-success-after-action').hide();
            $('.js-ticket-form-success-before-action').hide();
            self.resetTextInputs();
        });
    }

    bindInputType() {
        let formElem = this.form.find('.ticket-form__elem');
        formElem.find('input').on('keyup', function() {
            $(this).closest('.ticket-form__elem').removeClass('error');
            $(this).siblings('.ticket-form__error-text').remove();
        });
    }

    showSuccessMessage() {
        $(".js-ticket-form-success-after-action, .js-ticket-form-success-before-action").hide();
        $(".js-ticket-form-success-after-action").find("[name=tel]").val('');
        $('.js-ticket-form-success').show();
    }

    showErrMessage() {
        $(".js-ticket-form-success, .js-ticket-form-success-before-action").hide();
        $(".js-ticket-form-success-after-action").find("[name=tel]").val('');
        $('.js-ticket-form-success-before-action').show();
    }

    resetTextInputs() {
        this.form.find('input[type="text"]').val('').trigger('blur');
    }

    clearErrors(form) {
        form = form || this.form;
        form.find('.ticket-form__elem').removeClass('error');
        form.find('.ticket-form__elem').find('.ticket-form__error-text').remove();
    }

    setErrors( errors, form) {
        form = form || this.form;
        for ( let key in errors ) {
            form.find('#' + key).closest('.ticket-form__elem').addClass('error');
            form.find('#' + key).after('<p class="ticket-form__error-text">' + errors[key] + '</p>');
        }
    }
}