import View from './View';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    _message = 'Recipe was successfully loaded';

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    render() {
        this._generateMarkup();
    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', () => {
            this.toggleWindow();
            this.render();
        });
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(this));
            handler(data);
        });
    }

    _generateMarkup() {
        const markup = `
            <div class="upload__column">
                <h3 class="upload__heading">Recipe data</h3>
                <label>Title</label>
                <input value="TEST23" required name="title" type="text" />
                <label>URL</label>
                <input value="TEST23" required name="sourceUrl" type="text" />
                <label>Image URL</label>
                <input value="TEST23" required name="image" type="text" />
                <label>Publisher</label>
                <input value="TEST23" required name="publisher" type="text" />
                <label>Prep time</label>
                <input value="23" required name="cookingTime" type="number" />
                <label>Servings</label>
                <input value="23" required name="servings" type="number" />
            </div>

            <div class="upload__column">
                <h3 class="upload__heading">Ingredients</h3>
                ${Array.from({ length: 6 }, (_, i) => `
                    <label>Ingredient ${i + 1}</label>
                    <input
                        ${i === 0 ? 'required' : ''}
                        type="text"
                        name="ingredient-${i + 1}"
                        placeholder="Format: 'Quantity,Unit,Description'"
                    />
                `).join('')}
            </div>

            <button class="btn upload__btn">
                <svg>
                    <use href="${icons}#icon-upload-cloud"></use>
                </svg>
                <span>Upload</span>
            </button>`;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}

export default new AddRecipeView();
