import { defineStore } from 'pinia';

import type { Product } from './types';

export const useOrderStore = defineStore('order', () => {
    const selectedProducts = ref<Product[]>();
    const getSelectedProducts = () => selectedProducts.value;

    function setSelectedProducts(products: Product[]) {
        selectedProducts.value = products;
    }

    return {
        getSelectedProducts,
        setSelectedProducts
    };
});
