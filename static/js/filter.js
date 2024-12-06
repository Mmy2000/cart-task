document.addEventListener("DOMContentLoaded", () => {
    const selectedFiltersContainer = document.getElementById("selected-filters-container");
    const resetFiltersButton = document.getElementById("reset-filters");

    // Store selected filters
    const selectedFilters = {
        factories: [],
        colors: [],
    };

    // Function to update the displayed filters
    function updateSelectedFilters() {
        selectedFiltersContainer.innerHTML = "";

        Object.keys(selectedFilters).forEach((filterType) => {
            selectedFilters[filterType].forEach((filter) => {
                const filterTag = document.createElement("span");
                filterTag.className = "badge badge-primary filter-tag";
                filterTag.textContent = filter.name;
                filterTag.dataset.type = filterType;
                filterTag.dataset.value = filter.value;

                // Add a remove button
                const removeButton = document.createElement("span");
                removeButton.textContent = " ✕";
                removeButton.style.cursor = "pointer";
                removeButton.addEventListener("click", () => removeFilter(filterType, filter.value));

                filterTag.appendChild(removeButton);
                selectedFiltersContainer.appendChild(filterTag);
            });
        });
    }

    // Function to add a filter
    function addFilter(type, name, value) {
        if (!selectedFilters[type].some((filter) => filter.value === value)) {
            selectedFilters[type].push({ name, value });
            updateSelectedFilters();
            fetchFilteredProducts();
        }
    }

    // Function to remove a filter
    function removeFilter(type, value) {
        selectedFilters[type] = selectedFilters[type].filter((filter) => filter.value !== value);
        updateSelectedFilters();
        fetchFilteredProducts();
    }

    // Function to reset all filters
    resetFiltersButton.addEventListener("click", () => {
        selectedFilters.factories = [];
        selectedFilters.colors = [];
        updateSelectedFilters();
        fetchFilteredProducts();
    });

    // Example: Add event listeners to your filter checkboxes or buttons
    document.querySelectorAll(".factory-checkbox").forEach((checkbox) => {
        checkbox.addEventListener("change", (e) => {
            const name = e.target.nextElementSibling.textContent.trim();
            const value = e.target.value;

            if (e.target.checked) {
                addFilter("factories", name, value);
            } else {
                removeFilter("factories", value);
            }
        });
    });

    document.querySelectorAll(".color-item").forEach((button) => {
        button.addEventListener("click", () => {
            const name = button.querySelector("span").textContent.trim();
            const value = button.dataset.colorCode;
            addFilter("colors", name, value);
        });
    });

    // Function to fetch and display filtered products
    function fetchFilteredProducts() {
        const params = new URLSearchParams();

        // Add factories and colors to params
        selectedFilters.factories.forEach((filter) => params.append("factories[]", filter.value));
        selectedFilters.colors.forEach((filter) => params.append("colors[]", filter.value));

        // Fetch filtered products
        fetch(`/filter-products/?${params.toString()}`)
            .then((response) => response.json())
            .then((data) => {
                const productContainer = document.querySelector(".cat-pd");
                productContainer.innerHTML = ""; // Clear existing products

                // Render the filtered products
                data.products.forEach((product) => {
                    const productCard = `
                        <div class="col-md-3 col-sm-6 category-card-col">
                            <div class="small-box-c">
                                <div class="small-img-b">
                                    <a href="/product/${product.slug}">
                                        <img src="${product.image || '/static/images/logo.png'}" alt="${product.name}">
                                    </a>
                                </div>
                                <div class="dit-t clearfix">
                                    <div class="left-ti">
                                        <h4>${product.name}</h4>
                                        <p>By <span>${product.factory || 'Unknown'}</span> under <span>${product.type}</span></p>
                                    </div>
                                    <a href="#" tabindex="0"> SAR ${product.price}</a>
                                </div>
                                <div class="prod-btn">
                            <label for="quantity" style="font-size: 12px; margin-right: 5px;">Quantity (meters):</label>
                            <input type="number" id="quantity-${product.id}" name="quantity" min="1" step="1" value="1" style="width: 60px; margin-right: 8px;">
                            <a href="javascript:void(0);" onclick="addToCart(${product.id})">
                                <i class="fa fa-shopping-cart" aria-hidden="true"></i> Add to cart
                            </a>
                        </div>
                            </div>
                        </div>
                    `;
                    productContainer.insertAdjacentHTML("beforeend", productCard);
                });
            });
    }

    // Initialize the filter UI
    updateSelectedFilters();
});

// document.addEventListener("DOMContentLoaded", function () {
//     const factoryCheckboxes = document.querySelectorAll(".factory-checkbox");
//     const colorButtons = document.querySelectorAll(".color-item");
//     const productsContainer = document.querySelector(".cat-pd"); // Container for product cards

//     // Helper to get selected filters
//     const getSelectedFilters = (selector) => {
//         return Array.from(document.querySelectorAll(selector))
//             .filter((input) => input.checked || input.classList.contains("active"))
//             .map((input) => input.value || input.dataset.colorCode);
//     };

//     // Fetch filtered products
//     const fetchFilteredProducts = () => {
//         const selectedFactories = getSelectedFilters(".factory-checkbox");
//         const selectedColors = getSelectedFilters(".color-item");

//         const params = new URLSearchParams();
//         selectedFactories.forEach((id) => params.append("factories[]", id));
//         selectedColors.forEach((code) => params.append("colors[]", code));

//         fetch(`/filter-products/?${params.toString()}`)
//             .then((response) => response.json())
//             .then((data) => updateProductsUI(data.products))
//             .catch((error) => console.error("Error fetching filtered products:", error));
//     };

//     // Update product cards UI
//     const updateProductsUI = (products) => {
//         productsContainer.innerHTML = ""; // Clear existing products
//         products.forEach((product) => {
//             const productHTML = `
//                 <div class="col-md-3 col-sm-6 category-card-col">
//                     <div class="small-box-c">
//                         <div class="small-img-b">
//                             <a href="/product/${product.slug}">
//                                 <img src="${product.image || '/static/images/logo.png'}" alt="${product.name}">
//                             </a>
//                         </div>
//                         <div class="dit-t clearfix">
//                             <div class="left-ti">
//                                 <h4>${product.name}</h4>
//                                 <p>By <span>${product.factory || "Unknown"}</span> under <span>${product.type || "Unknown"}</span></p>
//                             </div>
//                             <a href="#" tabindex="0">SAR ${product.price}</a>
//                         </div>
//                         <div class="prod-btn">
//                             <label for="quantity" style="font-size: 12px; margin-right: 5px;">Quantity (meters):</label>
//                             <input type="number" id="quantity-${product.id}" name="quantity" min="1" step="1" value="1" style="width: 60px; margin-right: 8px;">
//                             <a href="javascript:void(0);" onclick="addToCart(${product.id})">
//                                 <i class="fa fa-shopping-cart" aria-hidden="true"></i> Add to cart
//                             </a>
//                         </div>
//                     </div>
//                 </div>
//             `;
//             productsContainer.insertAdjacentHTML("beforeend", productHTML);
//         });
//     };

//     // Event listeners
//     factoryCheckboxes.forEach((checkbox) =>
//         checkbox.addEventListener("change", fetchFilteredProducts)
//     );

//     colorButtons.forEach((button) => {
//         button.addEventListener("click", function () {
//             this.classList.toggle("active");
//             fetchFilteredProducts();
//         });
//     });
// });
