import {async} from 'regenerator-runtime'
import { API_KEY, API_URL, RESULT_PER_PAGE } from './config'
import { AJAX_DATA} from './helpers'
import 'core-js/stable'

export const state = {
    recipe:{},
    search:{
        query:'',  // this might be useful in the future
        results: [],
        resultsPerPage :RESULT_PER_PAGE,
        page: 1
    },
    bookmarks: []
}

const createRecipeObject = function(data){
    const {recipe} = data.data;
      return{  
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl : recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
            ...(recipe.key && {key: recipe.key})
        }
}
export const loadRecipe = async function(id){
    try{
        const data = await AJAX_DATA(`${API_URL}${id}?key=${API_KEY}`)
        state.recipe = createRecipeObject(data)
        if(state.bookmarks.some((bookmark)=>{
            return bookmark.id === id
        })){
            state.recipe.bookmarked = true;
        }
        else{
            state.recipe.bookmarked = false
        }
        // console.log(state.recipe)
    }
    catch(err){
        console.error(`${err.message}model`)
        throw err
    }
}

export const loadSearchResults = async function(query){
    try {
        state.search.query = query
        const data = await AJAX_DATA(`${API_URL}?search=${query}&key=${API_KEY}`) 
        state.search.results=data.data.recipes.map((rec)=>{
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && {key: rec.key})
            }
        })
        
        // to reset back to 1 incase the user makes another search
        state.search.page = 1;
    } catch (err) {
        console.error(`${err.message} model`)
        throw err
    }
}

export const getSearchResultsPage  = function(page = state.search.page){
    state.search.page = page
    //this logic is mad
    const start = (page-1) * state.search.resultsPerPage
    const end = page * state.search.resultsPerPage
    return state.search.results.slice(start , end)
}
//function to update servings
export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing=>{
        ing.quantity = (ing.quantity* newServings)/state.recipe.servings
    })
    state.recipe.servings = newServings
}

export const addBookmark = function(recipe){
    state.bookmarks.push(recipe)
    //mark current recipe
    if(recipe.id === state.recipe.id) { // subject to amendenment
        state.recipe.bookmarked = true
    } 
    persistBookmarks()
}

export const deleteBookmark = function(id){
    const index = state.bookmarks.findIndex(el=>el.id===id)
    state.bookmarks.splice(index, 1)
    //mark current recipe as not bookmark
    if(id === state.recipe.id) {  
        state.recipe.bookmarked = false
    }
    persistBookmarks()
}

const persistBookmarks = function(){
    localStorage.bookmarks = JSON.stringify(state.bookmarks);
}

const init = function(){
    const storage = localStorage.bookmarks
    if(storage){
        state.bookmarks = JSON.parse(storage)
    }
}

init()

export const upLoadRecipe = async function(newRecipe){
    try{
        const ingredients = Object.entries(newRecipe).filter((entry)=>{
            return entry[0].startsWith('ingredient')&& entry[1] !==''
        }).map((ing)=>{
            const ingArr = ing[1].split(',').map(el=>el.trim())
            console.log(ingArr)
            if(ingArr.length !=3){
                throw new Error('Wrong Ingredient format! Please use the correct format')
            }
            const [quantity, unit, description] = ingArr
            return {quantity: quantity? +quantity: null, unit, description}
        })
        console.log(ingredients)
        const recipe = {
            title : newRecipe.title,
            source_url : newRecipe.sourceUrl,
            image_url : newRecipe.image,
            publisher : newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients
        }

        const sendData = await AJAX_DATA(`${API_URL}?key=${API_KEY}`, recipe)
        state.recipe = createRecipeObject(sendData)
        //to set its bookmark to true
        addBookmark(state.recipe)
        console.log(state.bookmarks)
    }
    catch(err){
        throw err
    }
}

