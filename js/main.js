import { recipes } from '../data/recipes.js';
import { MultiSelectSearchMenu } from './multiselect-search-menu.js';
import { createCard } from "./recipe-card.js";
import { initTextSearch, filterRecipes } from './search.js';

export const menus = {};

const init = () => {
    const { ingredientsList, appliancesList, toolsList } = createFiltersLists(recipes);
    //create filter menus
    menus.ingredientsFilterMenu = new MultiSelectSearchMenu('Ingrédients', ingredientsList, filterRecipes);
    menus.appliancesFilterMenu = new MultiSelectSearchMenu('Appareils', appliancesList, filterRecipes);
    menus.toolsFilterMenu = new MultiSelectSearchMenu('Ustensiles', toolsList, filterRecipes);
    //insert menu elements in the dom
    const filtersSection = document.querySelector('section.filters');
    filtersSection.prepend(menus.toolsFilterMenu.menu);
    filtersSection.prepend(menus.appliancesFilterMenu.menu);
    filtersSection.prepend(menus.ingredientsFilterMenu.menu);

    //create cards. If url params are present, filter recipes accordingly
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ingredients') || urlParams.has('appliances') || urlParams.has('tools') || urlParams.has('searchQuery')) {

        const selectedIngredients = urlParams.get('ingredients')?.split(', ') || [];
        menus.ingredientsFilterMenu.setSelectedItems(selectedIngredients);

        const selectedAppliances = urlParams.get('appliances')?.split(', ') || [];
        menus.appliancesFilterMenu.setSelectedItems(selectedAppliances);

        const selectedTools = urlParams.get('tools')?.split(', ') || [];
        menus.toolsFilterMenu.setSelectedItems(selectedTools);

        const searchQuery = urlParams.get('searchQuery') || '';
        document.querySelector('.search-bar input').value = searchQuery;

        filterRecipes();
    } else {
        populateCardsSection(recipes);
        updateRecipesCounter(recipes.length);
    }
    initTextSearch();
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

init();