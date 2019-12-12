"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var elements = document.querySelectorAll('.item');
var radios = document.querySelectorAll('input[type=radio]');

function hidePanels() {
  Array.from(elements).forEach(function (item) {
    var panel = item;

    if (panel.id === 'card-item-toggle-border') {
      panel.classList.add('last-item');
    }

    panel.classList.remove('arrow');
    var nextPanel = panel.nextElementSibling;
    nextPanel.style.maxHeight = null;
  });
}

function togglePayButton(value) {
  var submitButton = document.querySelector('.pay-button');

  if (value === 'paypal') {
    submitButton.style.display = 'none';
  } else {
    submitButton.style.display = 'block';
  }
}

Array.from(radios).forEach(function (item) {
  item.addEventListener('change', function (e) {
    var value = e.target.value;
    togglePayButton(value);
    hidePanels();
    var panel = item.parentNode.parentNode;
    panel.classList.add('arrow');

    if (panel.id === 'card-item-toggle-border') {
      panel.classList.remove('last-item');
    }

    panel.classList.add('arrow');
    var nextPanel = panel.nextElementSibling;

    if (nextPanel.style.maxHeight) {
      nextPanel.style.maxHeight = null;
    } else {
      nextPanel.style.maxHeight = nextPanel.scrollHeight + "px";
    }
  });
});
Array.from(elements).forEach(function (item) {
  item.addEventListener('click', function (e) {
    var radio = item.querySelector('input');
    radio.checked = 'checked';
    var value = radio.value;
    togglePayButton(value);
    hidePanels();
    var panel = item;
    panel.classList.add('arrow');

    if (panel.id === 'card-item-toggle-border') {
      panel.classList.remove('last-item');
    }

    var nextPanel = panel.nextElementSibling;

    if (nextPanel.style.maxHeight) {
      nextPanel.style.maxHeight = null;
    } else {
      nextPanel.style.maxHeight = nextPanel.scrollHeight + "px";
    }
  });
});
var number = document.querySelector('#credit-card-number');
var expire = document.querySelector('#credit-card-expire');
var cvc = document.querySelector('#credit-card-cvc');
var payForm = document.querySelector('#form-payment');
var infoButton = document.querySelector('.exclamation');
infoButton.addEventListener('click', function () {
  return Swal.fire(_objectSpread({}, modalconfig, {
    title: "By accessing with your credit card you accept terms and conditions.",
    icon: false
  }));
});

function setInputFilter(textbox, inputFilter) {
  textbox.addEventListener('input', function () {
    // console.log('olaa')
    if (inputFilter(this.value)) {
      switch (textbox.id) {
        case 'credit-card-number':
          if (this.value.length % 3 == 0) {
            // console.log('424')
            console.log(this.value);
            this.value = this.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1  ');
          }

          break;

        case 'credit-card-expire':
          if (this.value.length > 2) {
            this.value = this.value.replace(/\W/gi, '').replace(/(^.{2})/, '$1/');
          }

          break;
      }

      this.oldValue = this.value;
      this.oldSelectionStart = this.selectionStart;
      this.oldSelectionEnd = this.selectionEnd;
    } else if (this.hasOwnProperty("oldValue")) {
      console.log('elsee');
      this.value = this.oldValue;
      this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
    } else {
      this.value = "";
    }
  });
}

setInputFilter(number, function (value) {
  return /^4?[0-9]{0,12}(?:[0-9]{0,3})?$|^3?[47][0-9]{0,13}$|^5?[1-5][0-9]{0,14}$/.test(value.replace(/\s{2}/g, '').trim());
});
setInputFilter(expire, function (value) {
  return /^[0-9]{0,2}?\/?[0-9]{0,2}?$/.test(value);
});
setInputFilter(cvc, function (value) {
  return /^[0-9]{0,3}$/.test(value);
});
var modalconfig = {
  title: 'credit card invalid',
  icon: 'error',
  toast: false,
  customClass: {
    confirmButton: 'pay-button',
    popup: 'modal-content',
    title: 'modal-text',
    footer: 'modal-footer'
  }
};

var showModal = function showModal(valid, title, resume) {
  return valid ? false : Swal.fire(_objectSpread({}, modalconfig, {
    footer: resume,
    title: title
  }));
};

var validateEntry = function validateEntry(regex, value) {
  return regex.test(value);
};

payForm.addEventListener('submit', function (e) {
  e.preventDefault();
  var formData = new FormData(payForm);
  var paymentMethod = formData.get('payment-method');
  var validNumber = validateEntry(/^4[0-9]{12}(?:[0-9]{3})?$|^3[47][0-9]{13}$|^5[1-5][0-9]{14}$/, number.value.replace(/\s{2}/g, '').trim());
  var validExpiry = validateEntry(/^[0-9]{2}\/[0-9]{2}$/, expire.value);
  var validCvc = validateEntry(/^[0-9]{3}$/, cvc.value);

  if (!paymentMethod) {
    Swal.fire(_objectSpread({}, modalconfig, {
      title: 'Please select a payment method!',
      icon: 'warning'
    }));
    return;
  }

  if (paymentMethod === 'credit') {
    if (!validNumber) {
      showModal(validNumber, 'Card number is invalid', 'please enter a valid credit card!'); // number.focus()

      return;
    }

    if (!validExpiry) {
      showModal(validExpiry, 'Date of expire is invalid', 'please enter a valid date of expire as (12/24)!'); // expire.focus()

      return;
    }

    if (!validCvc) {
      showModal(validCvc, 'cvc number is invalid', 'the cv must have at least 3 numbers'); // cvc.focus()

      return;
    }

    Swal.fire(_objectSpread({}, modalconfig, {
      title: "Success",
      icon: "success"
    }));
  }
});