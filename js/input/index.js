const elements = document.querySelectorAll('.item')
const radios = document.querySelectorAll('input[type=radio]')

function hidePanels(){
  Array.from(elements).forEach(item =>{
    const panel = item
    if(panel.id === 'card-item-toggle-border'){
      panel.classList.add('last-item')
    }
    panel.classList.remove('arrow')
    const nextPanel = panel.nextElementSibling
    nextPanel.style.maxHeight = null
  })
}

function togglePayButton(value){
  const submitButton = document.querySelector('.pay-button')
  if (value === 'paypal'){
    submitButton.style.display = 'none';
  }else{
    submitButton.style.display = 'block';
  }
}

Array.from(radios).forEach(item => {
  item.addEventListener('change', (e)=> {
    const { target: { value } } = e
    togglePayButton(value)
    hidePanels()
    const panel = item.parentNode.parentNode
    panel.classList.add('arrow')
    if(panel.id === 'card-item-toggle-border'){
      panel.classList.remove('last-item')
    }
    panel.classList.add('arrow')
    const nextPanel = panel.nextElementSibling
    if (nextPanel.style.maxHeight) {
      nextPanel.style.maxHeight = null
    } else {
      nextPanel.style.maxHeight = nextPanel.scrollHeight + "px"
    }
  })

})


Array.from(elements).forEach(item => {
  item.addEventListener('click', (e)=> {
    const radio = item.querySelector('input')
    radio.checked = 'checked'
    const {value} = radio
    togglePayButton(value)
    hidePanels()
    const panel = item
    panel.classList.add('arrow')
    if(panel.id === 'card-item-toggle-border'){
      panel.classList.remove('last-item')
    }
    const nextPanel = panel.nextElementSibling
    if (nextPanel.style.maxHeight) {
      nextPanel.style.maxHeight = null
    } else {
      nextPanel.style.maxHeight = nextPanel.scrollHeight + "px"
    }
  })

})

const number = document.querySelector('#credit-card-number')
const expire = document.querySelector('#credit-card-expire')
const cvc = document.querySelector('#credit-card-cvc')
const payForm = document.querySelector('#form-payment')
const infoButton = document.querySelector('.exclamation')

infoButton.addEventListener('click', () => Swal.fire({...modalconfig, title: "By accessing with your credit card you accept terms and conditions.", icon: false}))


function setInputFilter(textbox, inputFilter) {
  textbox.addEventListener('input', function() {
    // console.log('olaa')
    if (inputFilter(this.value)) {
      switch(textbox.id){
        case 'credit-card-number':
            if(this.value.length % 3 == 0){
              // console.log('424')
              console.log(this.value)
              this.value = this.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1  ')
            }
          break;
        case 'credit-card-expire':
            if(this.value.length > 2){
              this.value = this.value.replace(/\W/gi, '').replace(/(^.{2})/, '$1/')
            }
          break;
        }
      
      this.oldValue = this.value
      this.oldSelectionStart = this.selectionStart
      this.oldSelectionEnd = this.selectionEnd
    } else if (this.hasOwnProperty("oldValue")) {
      console.log('elsee')
      this.value = this.oldValue
      this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd)
    } else {
      this.value = ""
    }
  })
}

setInputFilter(number, function(value) {
  return /^4?[0-9]{0,12}(?:[0-9]{0,3})?$|^3?[47][0-9]{0,13}$|^5?[1-5][0-9]{0,14}$/.test(value.replace(/\s{2}/g,'').trim()) 
})

setInputFilter(expire, function(value) {
  return /^[0-9]{0,2}?\/?[0-9]{0,2}?$/.test(value)
})

setInputFilter(cvc, function(value) {
  return /^[0-9]{0,3}$/.test(value) 
})

const modalconfig = {
  title: 'credit card invalid',
  icon: 'error',
  toast: false,
  customClass: {
    confirmButton: 'pay-button',
    popup: 'modal-content',
    title: 'modal-text',
    footer: 'modal-footer',
  }
}

const showModal = (valid, title, resume) => valid ? false :  Swal.fire({...modalconfig, footer: resume, title})

const validateEntry = (regex, value) => regex.test(value)

payForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData(payForm);
  
  const paymentMethod = formData.get('payment-method')
  const validNumber = validateEntry(/^4[0-9]{12}(?:[0-9]{3})?$|^3[47][0-9]{13}$|^5[1-5][0-9]{14}$/, number.value.replace(/\s{2}/g,'').trim())
  const validExpiry = validateEntry(/^[0-9]{2}\/[0-9]{2}$/, expire.value)
  const validCvc = validateEntry(/^[0-9]{3}$/, cvc.value)

  if (!paymentMethod){
    Swal.fire({...modalconfig, title: 'Please select a payment method!', icon: 'warning'})
    return 
  }

  if(paymentMethod === 'credit'){
    if (!validNumber){
      showModal(validNumber, 'Card number is invalid', 'please enter a valid credit card!')
      // number.focus()
      return 
    }

    if (!validExpiry){
      showModal(validExpiry, 'Date of expire is invalid', 'please enter a valid date of expire as (12/24)!')
      // expire.focus()
      return 
    }

    if (!validCvc){
      showModal(validCvc, 'cvc number is invalid', 'the cv must have at least 3 numbers')
      // cvc.focus()
      return
    }

    Swal.fire({...modalconfig, title: "Success", icon: "success"})
  }
})

