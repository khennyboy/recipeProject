import './core-js/stable'
import {async} from 'regenerator-runtime/runtime'
import 'regenerator-runtime/runtime'
import * as model from './model.js'
import recipeView  from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'
import addRecipeView from './views/addRecipeView.js'
import { MODAL_CLOSE_SEC } from './config.js'


// if(module.hot){
//     module.hot.accept()
// }

// handles loading of recipe when hash changes and upon loading for the first time
const controlRecipes = async function(){
    try{
        const id = window.location.hash.slice(1)
        if(!id) return ;
        recipeView.renderSpinner()
        
        resultsView.update(model.getSearchResultsPage())  //  to update the Dom without actual re-rendering with chnage in class by comparing their id
        bookmarksView.update(model.state.bookmarks) //to update the Dom without actual re-rendering with change in class if its bookmarked

        //async function always return a promise && loading recipe
        await model.loadRecipe(id);
        
        //render the recipe
        recipeView.render(model.state.recipe)
    }
    catch(err){
        console.error(`${err.message} controller`)
        recipeView.rendeError()
    }
}
// handles search result
const controlSearchResults = async function(){
    try {
        resultsView.renderSpinner()
        // get search query
        const query = searchView.getQuery()
        if(!query) return 
      
        await model.loadSearchResults(query)
        // to know the number of items to display
        resultsView.render(model.getSearchResultsPage())
        //render initial button
        paginationView.render(model.state.search)        
    } catch (err) {
        console.error(`${err.message} controller`)
    }
}
// handles pagination
const controlPagination = function(goto){
    // to update the number of dispaly items
    resultsView.render(model.getSearchResultsPage(goto)) 
    //update pagination
    paginationView.render(model.state.search)
}
// handles updateServings && note all this functions are being actually called in the view
const controlServings = function(update){
    //function to update
    model.updateServings(update)
   // to re-render after the update
    recipeView.update(model.state.recipe)
}

//handleBookMarking
const controlAddBookmarked = function(){
    //Add/remove bookmark
    if(!model.state.recipe.bookmarked)  model.addBookmark(model.state.recipe)
    else  model.deleteBookmark(model.state.recipe.id)
    
    //render bookmarks
    recipeView.update(model.state.recipe)

    //show bookmarks
    bookmarksView.render(model.state.bookmarks)
}

// render bookmark upon loading for the first time
const controlBookMarks = function(){
    bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
    try{
        
        addRecipeView.renderSpinner()

        await model.upLoadRecipe(newRecipe)

        recipeView.render(model.state.recipe)

        addRecipeView.renderMessage()

        //change ID in URL and this will authimatically update the bookmark
        window.history.pushState(null, '', `#${model.state.recipe.id}`)

        bookmarksView.render(model.state.bookmarks)
       
        setTimeout(function(){
            addRecipeView.toggleWindow()
        }, MODAL_CLOSE_SEC*1000)
    }
    catch(err){
        console.error(err)
        addRecipeView.rendeError(err)
    }
}
const init = function(){
    bookmarksView.addHandlerRender(controlBookMarks)  // to load bookmarks initailly when the page loads
    recipeView.addHandlerRender(controlRecipes)
    recipeView.addHandlerUpdateServings(controlServings)
    recipeView.addHandlerBookmark(controlAddBookmarked)
    searchView.addhandleSearch(controlSearchResults)
    paginationView.addHandleCLick(controlPagination)
    addRecipeView.addHandlerUpload(controlAddRecipe)
}

init()



