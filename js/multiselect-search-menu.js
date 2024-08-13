export class MultiSelectSearchMenu {
    constructor(title, menuItems, callbackFn) {
        this.menu = this.createMultiSelectSearchMenu(title, menuItems, []);
        this.title = title;
        this.menuItems = menuItems;
        this.callbackFn = callbackFn;
        this.selectedItems = [];
        this.menuContent = this.menu.querySelector('.filter-content');
        this.openCloseBtn = this.menu.querySelector('.filter-btn');
        this.searchBar = this.menu.querySelector('.search-bar');
        this.selectedItemsList = this.menu.querySelector('.selected-items-list');
        this.menuItemsList = this.menu.querySelector('.items-list');
        this.menuItemsListUl = this.menuItemsList.querySelector('ul');
        this.menuItemsListLis = this.menuItemsListUl.querySelectorAll('li');

        //EVENT LISTENERS

        //open/close toggle button
        this.openCloseBtn.addEventListener('click', () => {
            if (this.menuContent.style.display == "none" || this.menuContent.style.display == "") {
                this.menuContent.style.display = "block";
                this.openCloseBtn.classList.add('active');
            } else {
                this.menuContent.style.display = "none";
                this.openCloseBtn.classList.remove('active');
            }
        });

        //list items click
        this.createMenuItemsEventListers();

        //search bar input
        this.searchBar.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            this.menuItemsListLis.forEach(li => {
                const item = li.innerText.toLowerCase();
                if (item.includes(value) && !this.selectedItems.includes(li.innerText)) {
                    li.style.display = '';
                } else {
                    li.style.display = 'none';
                }
            });
        });

        //close menu when the user clicks outside it
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target.parentElement)) {
                this.openCloseBtn.classList.remove('active');
                this.menuContent.style.display = "none";
                this.searchBar.value = '';
                this.searchBar.dispatchEvent(new Event('input'));
            }
        });
    }

    //METHODS

    /**
     * 
     * @param {String} title 
     * @param {String[]} menuItems
     * @param {String[]} selectedItems
     * @returns {HTMLDivElement}
     */
    createMultiSelectSearchMenu = (title, menuItems, selectedItems) => {
        const menu = document.createElement('div');
        menu.classList.add('filter');
        menu.id = title + '-filter';

        const searchBar = document.createElement('input');
        searchBar.type = 'search';
        searchBar.classList.add('search-bar');
        const selectedItemsList = this.createMenuItemsList(selectedItems, true);
        const menuItemsList = this.createMenuItemsList(menuItems);

        menu.innerHTML = `
            <button class="filter-btn">${title}<img src="./assets/images/caret-down.svg"/></button>
            <div class="filter-content">
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
                ${selectedItemsList.outerHTML}
                ${menuItemsList.outerHTML}
            </div>
        `;
        return menu;
    };

    /**
     * 
     * @param {String[]} items 
     * @param {boolean} selected specifies if the list is for selected items or not
     * @returns 
     */
    createMenuItemsList = (items, selected) => {
        const menuItemsList = document.createElement('div');
        if (selected)
            menuItemsList.classList.add('selected-items-list');
        else {
            //remove from the list any item that is also in the selectedItems array
            items = items.filter(i => !this.selectedItems?.includes(i));
            menuItemsList.classList.add('items-list');
        }

        menuItemsList.innerHTML =
            "<ul>"
            + items.map(i =>
                `<li>${i}</li>`
            ).join('')
            + "</ul>";
        return menuItemsList;
    };

    createMenuItemsEventListers = () => {
        this.menuItemsListLis.forEach(li => {
            li.addEventListener('click', (e) => {
                const item = e.target.innerText;
                if (this.selectedItems.includes(item)) {
                    this.selectedItems = this.selectedItems.filter(i => i != item);
                } else {
                    this.selectedItems.push(item);
                    li.style.display = 'none';
                }
                this.refreshSelectedItemsDOM();
                this.callbackFn();
            });
        });
    };

    refreshSelectedItemsDOM = () => {
        this.selectedItemsList.innerHTML = this.createMenuItemsList(this.selectedItems, true).innerHTML;

        //selected item remove button click event listener
        this.selectedItemsList.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', (e) => {
                const item = e.target.innerText;
                this.selectedItems = this.selectedItems.filter(i => i != item);
                this.refreshSelectedItemsDOM();
                this.callbackFn();
            });
        });

        //unhide the items in the list that are not selected
        this.menuItemsListLis.forEach(li => {
            if (!this.selectedItems.includes(li.innerText)) {
                li.style.display = '';
            }
        });

        //remove any existing buttons under the filter
        const existingButtons = this.menu.querySelectorAll('.selected-item-button');
        existingButtons.forEach(button => button.parentElement.removeChild(button));

        //add a button under the filter for each selected item
        this.selectedItems.forEach(item => {
            const button = document.createElement('button');
            button.classList.add('selected-item-button');
            button.textContent = item;
            const img = document.createElement('img');
            img.src = './assets/images/cross.svg';
            button.appendChild(img);

            button.addEventListener('click', () => {
                button.parentElement.removeChild(button);
                this.selectedItems = this.selectedItems.filter(i => i != item);
                this.refreshSelectedItemsDOM();
                this.callbackFn();
            });

            this.menu.appendChild(button);
        });
    };

    getSelectedItems = () => this.selectedItems;

    setSelectedItems = (items) => {
        this.selectedItems = items;
        this.refreshSelectedItemsDOM();
    };

    setMenuItems = (items) => {
        this.menuItems = items;
        this.menuItemsListUl.innerHTML = this.createMenuItemsList(items).querySelector('ul').innerHTML;
        this.menuItemsListLis = this.menuItemsListUl.querySelectorAll('li');
        this.createMenuItemsEventListers();
    };
};