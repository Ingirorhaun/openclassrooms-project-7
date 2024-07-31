import { recipes } from '../data/recipes.js';
import { createEventListeners, multiSelectSearchMenu } from './multiselect-search-menu.js';
import { createCard } from "./recipe-card.js";

const init = () => {

    //create cards
    const cardsSection = document.getElementById('recipe-cards');
    const fragment = document.createDocumentFragment();

    for (const recipe of recipes) {
        fragment.appendChild(createCard(recipe));
    }
    cardsSection.appendChild(fragment);



    //create filter lists
    const ingredientsList = [...new Set(recipes.map(recipe => recipe.ingredients.map(ingredient => ingredient.ingredient)).flat(1))].sort((a, b) => a.localeCompare(b));
    const appliancesList = [...new Set(recipes.map(recipe => recipe.appliance))].sort((a, b) => a.localeCompare(b));
    const toolsList = [...new Set(recipes.map(recipe => recipe.ustensils).flat(1))].sort((a, b) => a.localeCompare(b));
    //create filter menus
    const ingredientsFilterMenu = multiSelectSearchMenu('Ingrédients', ingredientsList);
    const appliancesFilterMenu = multiSelectSearchMenu('Appareils', appliancesList);
    const toolsFilterMenu = multiSelectSearchMenu('Ustensiles', toolsList);
    //insert menu elements in the dom
    const filtersSection = document.querySelector('section.filters');
    filtersSection.prepend(toolsFilterMenu);
    filtersSection.prepend(appliancesFilterMenu);
    filtersSection.prepend(ingredientsFilterMenu);

    //create event listeners
    createEventListeners();

    //update nb of cards
    const recipesCounter = document.getElementById('recipes-counter');
    recipesCounter.innerText = recipes.length + ' recettes';
};

init();