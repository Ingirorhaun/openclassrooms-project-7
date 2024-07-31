/**
 * Creates a card element
 * @param {Recipe} recipe 
 */
export const createCard = (recipe) => {
    const { id, image, name, ingredients, time, description } = recipe;

    const card = document.createElement('article');
    card.classList.add("recipe-card");
    card.dataset.recipeId = id;
    card.innerHTML =
        `
        <div>
            <div class="card-header">
                <img src="${'assets/images/thumbnail_' + image}" alt="${name}"/>
                <div class="tag">${time}min</div>
            </div>
            <div class="card-body">
                <h4>${name}</h4>
                <h5>Recette</h5>
                <p>${description}</p>
                <h5>ingrédients</h5>
                <ul>
                ${ingredients.map(i =>
            `
                            <li>
                                ${i.ingredient} <br/><span>${i.quantity + " " + (i.unit || "")}</span>
                            </li>
                        `
        ).join('')
        }       
                <ul>
            </div>
        </div>
        `;
    return card;
};