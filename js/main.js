import { recipes } from '../data/recipes.js';
import { MultiSelectSearchMenu } from './multiselect-search-menu.js';
import { createCard } from "./recipe-card.js";

const init = () => {

    const populateCardsSection = (recipes) => {
        const cardsSection = document.getElementById('recipe-cards');
        const fragment = document.createDocumentFragment();

        for (const recipe of recipes) {
            fragment.appendChild(createCard(recipe));
        }
        cardsSection.appendChild(fragment);
    };

    const filterRecipes = () => {
        //get list of selected items from each menu
        const selectedIngredients = ingredientsFilterMenu.getSelectedItems();
        const selectedAppliances = appliancesFilterMenu.getSelectedItems();
        const selectedTools = toolsFilterMenu.getSelectedItems();

        //update cards section showing only recipes that match the filters
        const filteredRecipes = recipes.filter(recipe => {
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
        updateUrl(selectedIngredients, selectedAppliances, selectedTools);
    };

    const updateRecipesCounter = (count) => {
        const recipesCounter = document.getElementById('recipes-counter');
        recipesCounter.innerText = count != 1 ? count + ' recettes' : '1 recette';
    };

    //update page url with selected filters
    const updateUrl = (selectedIngredients, selectedAppliances, selectedTools) => {
        const urlParams = new URLSearchParams(window.location.search);
        if (selectedIngredients.length) {
            urlParams.set('ingredients', selectedIngredients.join(','));
        } else {
            urlParams.delete('ingredients');
        }
        if (selectedAppliances.length) {
            urlParams.set('appliances', selectedAppliances.join(','));
        } else {
            urlParams.delete('appliances');
        }
        if (selectedTools.length) {
            urlParams.set('tools', selectedTools.join(','));
        } else {
            urlParams.delete('tools');
        }
        window.history.pushState({}, '', '?' + urlParams.toString());
    };

    //create filter lists
    const ingredientsList = [...new Set(recipes.map(recipe => recipe.ingredients.map(ingredient => ingredient.ingredient)).flat(1))].sort((a, b) => a.localeCompare(b));
    const appliancesList = [...new Set(recipes.map(recipe => recipe.appliance))].sort((a, b) => a.localeCompare(b));
    const toolsList = [...new Set(recipes.map(recipe => recipe.ustensils).flat(1))].sort((a, b) => a.localeCompare(b));
    //create filter menus
    const ingredientsFilterMenu = new MultiSelectSearchMenu('Ingrédients', ingredientsList, filterRecipes);
    const appliancesFilterMenu = new MultiSelectSearchMenu('Appareils', appliancesList, filterRecipes);
    const toolsFilterMenu = new MultiSelectSearchMenu('Ustensiles', toolsList, filterRecipes);
    //insert menu elements in the dom
    const filtersSection = document.querySelector('section.filters');
    filtersSection.prepend(toolsFilterMenu.menu);
    filtersSection.prepend(appliancesFilterMenu.menu);
    filtersSection.prepend(ingredientsFilterMenu.menu);

    //create cards, if url params are present, filter recipes accordingly
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ingredients') || urlParams.has('appliances') || urlParams.has('tools')) {

        const selectedIngredients = urlParams.get('ingredients')?.split(', ') || [];
        ingredientsFilterMenu.setSelectedItems(selectedIngredients);

        const selectedAppliances = urlParams.get('appliances')?.split(', ') || [];
        appliancesFilterMenu.setSelectedItems(selectedAppliances);

        const selectedTools = urlParams.get('tools')?.split(', ') || [];
        toolsFilterMenu.setSelectedItems(selectedTools);

        filterRecipes();
    } else {
        populateCardsSection(recipes);
        updateRecipesCounter(recipes.length);
    }
};


init();