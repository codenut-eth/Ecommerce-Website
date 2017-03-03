<?php
   /**
    * Related Products
    *
    * @author 		WooThemes
    * @package 	WooCommerce/Templates
    * @version     1.6.4
    */
   if (!defined('ABSPATH'))
       exit; // Exit if accessed directly
   global $product, $woocommerce_loop;
   $related = $product->get_related(8);
   if (sizeof($related) == 0)
       return;
   $args = apply_filters('woocommerce_related_products_args', array(
       'post_type' => 'product',
       'ignore_sticky_posts' => 1,
       'no_found_rows' => 1,
       'posts_per_page' => 8,
       'orderby' => $orderby,
       'post__in' => $related,
       'post__not_in' => array($product->id)
   ));
   $products = new WP_Query($args);
   if ($products->have_posts()) :
       ?>
       <div class="slider-container woocommerce">
           <h2 class="slider-heading"><?php _e('Related Deals', 'dokan'); ?></h2>
           <div class="product-sliders">
               <ul class="slides">
                   <?php while ($products->have_posts()) : $products->the_post();
                       ?>
                       <?php wc_get_template_part('content', 'product'); ?>
                   <?php endwhile; // end of the loop. ?>
               </ul>
           </div>
       </div>
       <?php
   endif;
   wp_reset_postdata();
   