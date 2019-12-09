const elements = document.querySelectorAll('input[type=radio]')
console.log(elements)

function hidePanels(){
  Array.from(elements).forEach(item =>{
    const panel = item.parentNode.parentNode.nextElementSibling
    panel.style.maxHeight = null;
  })
}

Array.from(elements).forEach(item => {
  item.addEventListener('change', ()=> {
    hidePanels()
    const panel = item.parentNode.parentNode.nextElementSibling
    console.log(panel.innerHTML)
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  })

})