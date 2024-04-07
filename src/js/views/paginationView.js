import View from "./View";
import icons from 'url:../../img/icons.svg'

class Pagination extends View{
    _parentElement = document.querySelector('.pagination')
    _markUp1(page){
        return `<button class="btn--inline pagination__btn--next" data-goto="${page+1}">
                    <span>${page +1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
                </button>`
    }
    _markUp2(page){
        return `<button class="btn--inline pagination__btn--prev" data-goto="${page-1}">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                <span>${page-1}</span>
            </button>`
    }
    _generateMarkUp(){
        
        const currPage = this._data.page; // we get access to the data through render method
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        // page 1 and there are other pages
        if(currPage == 1 && numPages > 1 ){
             return this._markUp1(currPage)
        }
    
        //last page
        if(currPage === numPages && numPages>1){
            return this._markUp2(currPage)
        }

        //other pages
        if(currPage < numPages){
            const element = this._markUp2(currPage) + this._markUp1(currPage)
            return element
        }
        //page1, and there are no other pages
        return ''
    }
    addHandleCLick(handler){
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline')
            if(!btn) return
            const goToPage = +btn.dataset.goto
            handler(goToPage)
        })
    }
}

export default new Pagination()