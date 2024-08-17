import { updateFilterMenus, populateCardsSection, updateRecipesCounter, updateUrl, menus } from './main.js';
import { recipes } from '../data/recipes.js';

export const filterRecipes = () => {
    //get list of selected items from each menu
    const selectedIngredients = menus.ingredientsFilterMenu.getSelectedItems();
    const selectedAppliances = menus.appliancesFilterMenu.getSelectedItems();
    const selectedTools = menus.toolsFilterMenu.getSelectedItems();
    //get search query
    const searchQuery = document.querySelector('.search-bar input').value.toLowerCase();

    //update cards section showing only recipes that match the filters
    const filteredRecipes = recipes.filter(recipe => {
        const ingredients = recipe.ingredients.map(i => i.ingredient);
        return (
            selectedIngredients.every(i => ingredients.includes(i)) &&
            selectedAppliances.every(a => recipe.appliance == a) &&
            selectedTools.every(t => recipe.ustensils.includes(t)) &&
            textSearch(recipe, searchQuery)
        );
    });

    const cardsSection = document.getElementById('recipe-cards');
    cardsSection.innerHTML = '';
    populateCardsSection(filteredRecipes);
    updateFilterMenus(filteredRecipes);
    updateRecipesCounter(filteredRecipes.length);
    updateUrl({ searchQuery: searchQuery, ingredients: selectedIngredients.join(','), appliances: selectedAppliances.join(','), tools: selectedTools.join(',') });
};

export const initTextSearch = () => {
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', () => {
        filterRecipes();
    });

    const searchFieldClearBtn = document.querySelector('.search-bar .clear-btn');
    searchFieldClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterRecipes();
    });
};

//search through the recipe title, ingredients and description when the user enters at least 3 characters in the search field, without using array methods
const textSearch = (recipe, searchValue) => {
    if (searchValue.length < 3) return true;
    if (
        recipe.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchValue.toLowerCase())
    ) {
        return true;
    } else {
        for (const ingredient of recipe.ingredients) {
            if (ingredient.ingredient.toLowerCase().includes(searchValue.toLowerCase())) {
                return true;
            }
        }
    }
    return false;
};