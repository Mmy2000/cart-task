function addToCart(productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = quantityInput ? parseInt(quantityInput.value, 10) || 1 : 1;

    fetch(`/cart/add_to_cart/${productId}/?quantity=${quantity}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log(data);

                // Update cart count dynamically
                const cartCountElement = document.getElementById("cart-count");
                const productCount = data.total_quantity || 0; // Ensure cart_total_quantity is sent in the response

                if (cartCountElement) {
                    cartCountElement.textContent = productCount;
                }

                // Add animation class to the cart icon
                const cartButton = document.querySelector(".cart-button");
                if (cartButton) {
                    cartButton.classList.add("cart-animate");
                    setTimeout(() => cartButton.classList.remove("cart-animate"), 1000);
                }
            } else {
                console.error("Unexpected response format:", data);
            }
        })
        .catch(error => {
            console.error("Error adding to cart:", error);
        });
}
document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", function () {
        const productId = this.dataset.productId;
        const csrfToken = document.getElementById("csrf-token").value;

        fetch(`/cart/remove/${productId}/`, {
            method: "POST",
            headers: { "X-CSRFToken": csrfToken },
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                const cartCountElement = document.getElementById("cart-count");
                const productCount = data.total_quantity || 0;

                // Update cart count dynamically
                if (cartCountElement) {
                    cartCountElement.textContent = productCount;
                }

                // Update grand total dynamically
                const grandTotalElement = document.querySelector(".cart-summary .grand-total");
                if (grandTotalElement) {
                    grandTotalElement.textContent = `$${data.grand_total}`;
                }

                // Remove the product row from the table
                document.querySelector(`tr[data-product-id="${productId}"]`).remove();

                // Handle empty cart display
                if (productCount === 0) {
                    document.querySelector("tbody").innerHTML = "";
                    document.querySelector(".cart-summary").style.display = "none";
                    document.querySelector(".empty-cart").style.display = "block";
                }
            } else if (data.error) {
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    });
});

document.getElementById("clear-cart").addEventListener("click", function () {
    if (confirm("Are you sure you want to clear the cart?")) {
        const csrfToken = document.getElementById("csrf-token").value;

        fetch("/cart/clear/", {
            method: "POST",
            headers: { "X-CSRFToken": csrfToken },
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                const cartCountElement = document.getElementById("cart-count");
                const productCount = data.total_quantity || 0;

                // Update cart count dynamically
                if (cartCountElement) {
                    cartCountElement.textContent = productCount;
                }

                // Update grand total dynamically
                const grandTotalElement = document.querySelector(".cart-summary .grand-total");
                if (grandTotalElement) {
                    grandTotalElement.textContent = `$${data.grand_total}`;
                }

                // Clear the table and hide cart summary
                document.querySelector("tbody").innerHTML = "";
                document.querySelector(".cart-summary").style.display = "none";
                document.querySelector(".empty-cart").style.display = "block";
            } else if (data.error) {
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
});

document.querySelectorAll(".factory-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", function () {
        const selectedFactories = Array.from(document.querySelectorAll(".factory-checkbox:checked"))
            .map(cb => cb.value);

        fetch(`/category/{{ category.slug }}/?factories=${selectedFactories.join(",")}`, {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => {
            const productContainer = document.querySelector("#product-container");
            productContainer.innerHTML = ""; // Clear existing products
            data.products.forEach(product => {
                productContainer.innerHTML += `
                <div class="product-card">
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price}</p>
                </div>`;
            });
        })
        .catch(error => console.error("Error:", error));
    });
});

$(function () {
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 2000,
        values: [158, 1230],
        slide: function (event, ui) {
            $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
        }
    });
    $("#amount").val("$" + $("#slider-range").slider("values", 0) +
        " - $" + $("#slider-range").slider("values", 1));
});

$(document).ready(function () {
    $("#boxscroll").niceScroll({
        cursorborder: "",
        cursorcolor: "#ededed",
        boxzoom: true
    });
    $(".custom-select").select2();
});

function updateCartSummary(totalQuantity, grandTotal) {
    const summaryElement = document.querySelector(".cart-summary");
    const grandTotalElement = summaryElement.querySelector("strong:last-child");

    if (totalQuantity > 0) {
        summaryElement.querySelector("strong").innerText = totalQuantity;
        grandTotalElement.innerText = `$${grandTotal}`;
        summaryElement.style.display = "block";
    } else {
        summaryElement.style.display = "none";
    }
}