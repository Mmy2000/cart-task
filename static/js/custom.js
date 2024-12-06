/*
  file name : custom.js
*/

(function($) {
	"use strict";
	
	/*==================================================
        wow
	  ===================================================*/
		new WOW().init();
	/*==================================================
        Slider
	 ===================================================*/
	 $('.slider').slick({
		//dots: true,
		infinite: true,
		centerMode: true,
		centerPadding: '12%',
		slidesToShow: 4,
		prevArrow: false,
    	nextArrow: false,
		autoplay: true,
  		autoplaySpeed: 2000,
		speed: 500,
		responsive: [
		     {
			  	breakpoint: 1200,
			    settings: {
				slidesToShow: 3
			  }
			},
				{
			  	breakpoint: 992,
			    settings: {
				slidesToShow: 2
			  }
			},
			{
			  breakpoint: 768,
			  settings: {
				arrows: false,
				centerMode: true,
				centerPadding: '40px',
				slidesToShow: 2
			  }
			},
			{
			  breakpoint: 480,
			  settings: {
				arrows: false,
				centerMode: true,
				centerPadding: '40px',
				slidesToShow: 1
			  }
			}
		]
	});
	
	/*==================================================
        Sidebar
	 ===================================================*/
	 $("#menu-close").click(function(e) {
		e.preventDefault();
		$("#sidebar").toggleClass("active");
	  });
	  $("#top-menu").click(function(e) {
		e.preventDefault();
		$(this).toggleClass('collapsed');
		$("#sidebar").toggleClass("active");
	  });
	  
	
	/*==================================================
        Toggle
	 ===================================================*/
	 
	 $(".navbar-toggle").on("click", function() {
        $(this).toggleClass("active");
        $("#header").toggleClass("head-add");
    });
	
	/*==================================================
        fixed menu
	  ===================================================*/
		$(window).on('scroll', function () {
			if ($(window).scrollTop() > 50) {
				$('.top-head').addClass('fixed-menu');
			} else {
				$('.top-head').removeClass('fixed-menu');
			}
		});
		
	/*==================================================
		Select2
	===================================================*/
	
		$(".select2").select2();
	
	
	
	/*==================================================
        selectpicker 
	 ===================================================*/
		$('.selectpicker').selectpicker();
	
	
	
	
	
	
	
})(jQuery);


document.addEventListener("DOMContentLoaded", function () {
    const factoryCheckboxes = document.querySelectorAll(".factory-checkbox");
    const colorButtons = document.querySelectorAll(".color-item");
    const productsContainer = document.querySelector(".cat-pd"); // Container for product cards

    // Helper to get selected filters
    const getSelectedFilters = (selector) => {
        return Array.from(document.querySelectorAll(selector))
            .filter((input) => input.checked || input.classList.contains("active"))
            .map((input) => input.value || input.dataset.colorCode);
    };

    // Fetch filtered products
    const fetchFilteredProducts = () => {
        const selectedFactories = getSelectedFilters(".factory-checkbox");
        const selectedColors = getSelectedFilters(".color-item");

        const params = new URLSearchParams();
        selectedFactories.forEach((id) => params.append("factories[]", id));
        selectedColors.forEach((code) => params.append("colors[]", code));

        fetch(`/filter-products/?${params.toString()}`)
            .then((response) => response.json())
            .then((data) => updateProductsUI(data.products))
            .catch((error) => console.error("Error fetching filtered products:", error));
    };

    // Update product cards UI
    const updateProductsUI = (products) => {
        productsContainer.innerHTML = ""; // Clear existing products
        products.forEach((product) => {
            const productHTML = `
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
                                <p>By <span>${product.factory || "Unknown"}</span> under <span>${product.type || "Unknown"}</span></p>
                            </div>
                            <a href="#" tabindex="0">SAR ${product.price}</a>
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
            productsContainer.insertAdjacentHTML("beforeend", productHTML);
        });
    };

    // Event listeners
    factoryCheckboxes.forEach((checkbox) =>
        checkbox.addEventListener("change", fetchFilteredProducts)
    );

    colorButtons.forEach((button) => {
        button.addEventListener("click", function () {
            this.classList.toggle("active");
            fetchFilteredProducts();
        });
    });
});
