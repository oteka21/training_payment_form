const elements = document.querySelectorAll('input[type=radio]')

function hidePanels(){
  Array.from(elements).forEach(item =>{
    const panel = item.parentNode.parentNode
    panel.classList.remove('arrow')
    const nextPanel = panel.nextElementSibling
    nextPanel.style.maxHeight = null
  })
}

Array.from(elements).forEach(item => {
  item.addEventListener('change', ()=> {
    hidePanels()
    const panel = item.parentNode.parentNode
    panel.classList.add('arrow')
    const nextPanel = panel.nextElementSibling
    console.log(nextPanel.innerHTML)
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


// function validateNumber(value, event){
  
// }
// number.addEventListener('keypress',(e) => {
//   const {target: { value } } = e
//   const myRegex = new RegExp(/^[0-9]*$/)
//   console.log(myRegex.test(value))
//   console.log(value)
// })

function setInputFilter(textbox, inputFilter) {
  textbox.addEventListener('input', function() {
    if (inputFilter(this.value)) {
      this.oldValue = this.value
      this.oldSelectionStart = this.selectionStart
      this.oldSelectionEnd = this.selectionEnd
    } else if (this.hasOwnProperty("oldValue")) {
      this.value = this.oldValue
      this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd)
    } else {
      this.value = ""
    }
  })
}

setInputFilter(number, function(value) {
  return /^[0-9]*$/.test(value) 
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
  },
  footer: 'Please enter a valid credit card!'
}

const payForm = document.querySelector('#form-payment')
const showModal = (valid, title, resume) => valid ? false :  Swal.fire({...modalconfig, footer: resume, title})

const validateEntry = (regex, value) => regex.test(value)

payForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const validNumber = validateEntry(/^4[0-9]{12}(?:[0-9]{3})?$|^3[47][0-9]{13}$|^5[1-5][0-9]{14}$/, number.value)
  const validExpiry = validateEntry(/^[0-9]{2}\/[0-9]{2}$/, number.value)
  showModal(validNumber, 'Card number is invalid', 'please enter a valid credit card!')
  showModal(validExpiry, 'Date of expire is invalid', 'please enter a valid date of expire as (12/24)!')
})