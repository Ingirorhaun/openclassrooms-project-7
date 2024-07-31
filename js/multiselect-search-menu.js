/**
 * 
 * @param {String} title 
 * @param {String[]} menuItems 
 * @param {Function} onSelectCallbackFn 
 */

export const multiSelectSearchMenu = (title, menuItems) => {
    const menu = document.createElement('div');
    menu.classList.add('filter');

    const searchBar = document.createElement('input');
    searchBar.type = 'search';
    searchBar.classList.add('search-bar');
    const menuItemsList = createMenuItemsList(menuItems);

    menu.innerHTML = `
        <button class="filter-btn">${title}<img src="./assets/images/caret-down.svg"/></button>
        <div>
            <div class="filter-search-bar">
                ${searchBar.outerHTML}
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="10" cy="10" r="9.5" stroke="currentColor" />
                    <line
                    x1="18.3536"
                    y1="18.6464"
                    x2="27.3536"
                    y2="27.6464"
                    stroke="currentColor"
                    />
                </svg>
            </div>
            ${menuItemsList.outerHTML}
        </div>
    `;

    return menu;
};

const createMenuItemsList = (menuItems) => {
    const menuItemsList = document.createElement('div');
    menuItemsList.classList.add('items-list');

    menuItemsList.innerHTML =
        "<ul>"
        + menuItems.map(i =>
            `<li>
                ${i}
            </li>`
        ).join('')
        + "</ul>";
    return menuItemsList;
};

export const createEventListeners = () => {
    //filter buttons
    const buttons = document.getElementsByClassName('filter-btn');
    for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];
        btn.addEventListener('click', (e) => {
            const menu = e.target.closest('button').nextElementSibling;
            if (menu.style.display == "none") {
                menu.style.display = "block";
                btn.classList.add('active');
            } else {
                menu.style.display = "none";
                btn.classList.remove('active');
            }
        });
    }
    //filter search fields
    const searchBars = document.getElementsByClassName('search-bar');
    for (let i = 0; i < searchBars.length; i++) {
        const searchBar = searchBars[i];
        searchBar.addEventListener('keyup', (e) => {
            const value = e.target.value.toLowerCase();
            const menu = e.target.parentElement.nextElementSibling;
            const items = menu.querySelectorAll('li');
            for (let i = 0; i < items.length; i++) {
                const item = items[i].innerText.toLowerCase();
                if (item.indexOf(value) > -1) {
                    items[i].style.display = "";
                } else {
                    items[i].style.display = "none";
                }
            }
        });
    }
    //clicking on list items

    //close active filters if user clicks outside of the filter
    document.addEventListener('click', (e) => {
        const filters = document.querySelectorAll('.filter');
        for (let i = 0; i < filters.length; i++) {
            const filter = filters[i];
            if (!filter.contains(e.target)) {
                const button = filter.querySelector('button');
                button.classList.remove('active');
                button.nextElementSibling.style.display = "none";
            }
        }
    });
};