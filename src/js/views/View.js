import icons from 'url:../../img/icons.svg'
export default class View{
    _data =''
    render(data, render = true){
        if(!data || (Array.isArray(data)) && data.length ===0) return this.rendeError()
        this._data = data
        const markup = this._generateMarkUp()
        if(!render) return markup
        this._clear()
        markup && this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }
    // used to update data that only changes without actual re-rendering
    update(data){
        this._data = data
        const newMarkup = this._generateMarkUp() // this not going into the DOM

        const newDOM = document.createRange().createContextualFragment(newMarkup); // this will create virtual DOM
        const newElements = Array.from(newDOM.querySelectorAll('*'))
        const curElements = Array.from(this._parentElement.querySelectorAll('*'))
      
        newElements.forEach((newEl, i )=>{
          const curEl = curElements[i]
          // console.log(newEl.isEqualNode(curEl)) // this is only the content of the Node
          // update change attrribute
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim()!==''){
              curEl.textContent = newEl.textContent
            }
          // update change attribute
            if(!newEl.isEqualNode(curEl)){
              Array.from(newEl.attributes).forEach((attr)=>{
                curEl.setAttribute(attr.name, attr.value)
              })
          }
        })
    }
    renderSpinner(){
        const markup = `
        <div class="spinner">
        <svg>
        <use href="${icons}#icon-loader"></use>
        </svg>
    </div>`
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }
    _clear(){
        this._parentElement.innerHTML =''
    }
    rendeError(message = this._errorMessage){
        const markup = `<div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div> `
      this._clear()
      this._parentElement.insertAdjacentHTML('afterbegin', markup)
      }
      renderMessage(message = this._message){
        const markup = `<div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div> `
      this._clear()
      this._parentElement.insertAdjacentHTML('afterbegin', markup)
      }
}
