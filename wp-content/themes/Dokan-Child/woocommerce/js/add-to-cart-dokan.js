jQuery( function( $ ) {
	// wc_add_to_cart_params is required to continue, ensure the object exists
	if ( typeof wc_add_to_cart_params === 'undefined' )
		return false;
	// Ajax add to cart
	$( document ).on( 'click', '.add_to_cart_button', function() {
//alert('yo');
		// AJAX add to cart request
		var $thisbutton = $( this );
		if($thisbutton.attr('href')===wc_add_to_cart_params.cart_url)
			window.location = wc_add_to_cart_params.cart_url;
		else
		{
			if ( $thisbutton.is( '.product_type_simple' ) ) {
				if ( ! $thisbutton.attr( 'data-product_id' ) )
					return true;
				$thisbutton.removeClass( 'added' );
				$thisbutton.addClass( 'loading' );
				var data = {
					action: 'woocommerce_add_to_cart',
					product_id: $thisbutton.attr( 'data-product_id' ),
					quantity: $thisbutton.prev('.quantity').find('.input-text.qty').val()
				};
			// Trigger event
			$( 'body' ).trigger( 'adding_to_cart', [ $thisbutton, data ] );
			// Ajax action
			$.post( wc_add_to_cart_params.ajax_url, data, function( response ) {
				if ( ! response )
					return;
				var this_page = window.location.toString();
				this_page = this_page.replace( 'add-to-cart', 'added-to-cart' );
				if ( response.error && response.product_url ) {
					window.location = response.product_url;
					return;
				}
				// Redirect to cart option
				if ( wc_add_to_cart_params.cart_redirect_after_add === 'yes' ) {
					window.location = wc_add_to_cart_params.cart_url;
					return;
				} else {
					$thisbutton.removeClass( 'loading' );
					fragments = response.fragments;
					cart_hash = response.cart_hash;
					// Block fragments class
					if ( fragments ) {
						$.each( fragments, function( key, value ) {
							$( key ).addClass( 'updating' );
						});
					}
					// Block widgets and fragments
					$( '.shop_table.cart, .updating, .cart_totals' ).fadeTo( '400', '0.6' ).block({ message: null, overlayCSS: { background: 'transparent url(' + wc_add_to_cart_params.ajax_loader_url + ') no-repeat center', backgroundSize: '16px 16px', opacity: 0.6 } } );
					// Changes button classes
					$thisbutton.addClass( 'added' );
					// View cart text
					if ( ! wc_add_to_cart_params.is_cart) 
						$thisbutton.attr('href', wc_add_to_cart_params.cart_url).html('<i class="fa fa-lg fa-share-square-o"></i>View Cart').prev('.quantity.buttons_added').fadeOut(700);
					// Replace fragments
					if ( fragments ) {
						$.each( fragments, function( key, value ) {
							$( key ).replaceWith( value );
						});
					}
					// Unblock
					$( '.widget_shopping_cart, .updating' ).stop( true ).css( 'opacity', '1' ).unblock();
					// Cart page elements
					$( '.shop_table.cart' ).load( this_page + ' .shop_table.cart:eq(0) > *', function() {
						$( 'div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)' ).addClass( 'buttons_added' ).append( '<input type="button" value="+" id="add1" class="plus" />' ).prepend( '<input type="button" value="-" id="minus1" class="minus" />' );
						$( '.shop_table.cart' ).stop( true ).css( 'opacity', '1' ).unblock();
						$( 'body' ).trigger( 'cart_page_refreshed' );
					});
					$( '.cart_totals' ).load( this_page + ' .cart_totals:eq(0) > *', function() {
						$( '.cart_totals' ).stop( true ).css( 'opacity', '1' ).unblock();
					});
					// Trigger event so themes can refresh other areas
					$( 'body' ).trigger( 'added_to_cart', [ fragments, cart_hash ] );
				}
			});
return false;
}
}
return true;
});
});
