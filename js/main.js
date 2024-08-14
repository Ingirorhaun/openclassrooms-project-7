import { recipes } from '../data/recipes.js';
import { MultiSelectSearchMenu } from './multiselect-search-menu.js';
import { createCard } from "./recipe-card.js";
import { initSearch } from './search.js';

let searchFilteredRecipes = recipes;
const menus = {};

const init = () => {
    const { ingredientsList, appliancesList, toolsList } = createFiltersLists(recipes);
    //create filter menus
    menus.ingredientsFilterMenu = new MultiSelectSearchMenu('Ingrédients', ingredientsList, filterRecipesByTag);
    menus.appliancesFilterMenu = new MultiSelectSearchMenu('Appareils', appliancesList, filterRecipesByTag);
    menus.toolsFilterMenu = new MultiSelectSearchMenu('Ustensiles', toolsList, filterRecipesByTag);
    //insert menu elements in the dom
    const filtersSection = document.querySelector('section.filters');
    filtersSection.prepend(menus.toolsFilterMenu.menu);
    filtersSection.prepend(menus.appliancesFilterMenu.menu);
    filtersSection.prepend(menus.ingredientsFilterMenu.menu);

    //create cards. If url params are present, filter recipes accordingly
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ingredients') || urlParams.has('appliances') || urlParams.has('tools')) {

        const selectedIngredients = urlParams.get('ingredients')?.split(', ') || [];
        menus.ingredientsFilterMenu.setSelectedItems(selectedIngredients);

        const selectedAppliances = urlParams.get('appliances')?.split(', ') || [];
        menus.appliancesFilterMenu.setSelectedItems(selectedAppliances);

        const selectedTools = urlParams.get('tools')?.split(', ') || [];
        menus.toolsFilterMenu.setSelectedItems(selectedTools);

        filterRecipesByTag();
    } else {
        populateCardsSection(recipes);
        updateRecipesCounter(recipes.length);
    }
    initSearch(recipes);
};

export const populateCardsSection = (recipes) => {

    const cardsSection = document.getElementById('recipe-cards');
    cardsSection.innerHTML = '';
    if (recipes.length == 0) {
        const searchInput = document.querySelector('.search-bar input').value;
        if (!searchInput) {
            cardsSection.innerHTML = `<p>Aucune recette trouvée.</p>`;
            return;
        }
        cardsSection.innerHTML = `<p>Aucune recette ne contient <b>${searchInput}</b>, vous pouvez chercher "tarte aux pommes", "poisson", etc.</p>`;
        return;
    }
    const fragment = document.createDocumentFragment();

    for (const recipe of recipes) {
        fragment.appendChild(createCard(recipe));
    }
    cardsSection.appendChild(fragment);
};

const filterRecipesByTag = () => {
    //get list of selected items from each menu
    const selectedIngredients = menus.ingredientsFilterMenu.getSelectedItems();
    const selectedAppliances = menus.appliancesFilterMenu.getSelectedItems();
    const selectedTools = menus.toolsFilterMenu.getSelectedItems();

    //update cards section showing only recipes that match the filters
    const filteredRecipes = searchFilteredRecipes.filter(recipe => {
        const ingredients = recipe.ingredients.map(i => i.ingredient);
        return (
            selectedIngredients.every(i => ingredients.includes(i)) &&
            selectedAppliances.every(a => recipe.appliance == a) &&
            selectedTools.every(t => recipe.ustensils.includes(t))
        );
    });

    const cardsSection = document.getElementById('recipe-cards');
    cardsSection.innerHTML = '';
    populateCardsSection(filteredRecipes);
    updateRecipesCounter(filteredRecipes.length);
    updateUrl({ ingredients: selectedIngredients.join(','), appliances: selectedAppliances.join(','), tools: selectedTools.join(',') });
};

export const updateRecipesCounter = (count) => {
    const recipesCounter = document.getElementById('recipes-counter');
    recipesCounter.innerText = count != 1 ? count + ' recettes' : '1 recette';
};

//update page url with selected filters
export const updateUrl = (params) => {
    const urlParams = new URLSearchParams(window.location.search);

    for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            const value = params[key];
            if (value.length) {
                urlParams.set(key, value);
            } else {
                urlParams.delete(key);
            }
        }
    }

    window.history.pushState({}, '', '?' + urlParams.toString());
};

//create filter lists
export const createFiltersLists = (recipes) => {
    return {
        ingredientsList: [...new Set(recipes.map(recipe => recipe.ingredients.map(ingredient => ingredient.ingredient)).flat(1))].sort((a, b) => a.localeCompare(b)),
        appliancesList: [...new Set(recipes.map(recipe => recipe.appliance))].sort((a, b) => a.localeCompare(b)),
        toolsList: [...new Set(recipes.map(recipe => recipe.ustensils).flat(1))].sort((a, b) => a.localeCompare(b))
    };
};

export const updateFilterMenus = (recipes) => {
    const { ingredientsList, appliancesList, toolsList } = createFiltersLists(recipes);
    menus.ingredientsFilterMenu.setMenuItems(ingredientsList);
    menus.appliancesFilterMenu.setMenuItems(appliancesList);
    menus.toolsFilterMenu.setMenuItems(toolsList);
};

export const setSearchFilteredRecipes = (recipes) => {
    searchFilteredRecipes = recipes;
};

init();