import axios from "axios";
import ApiUrls from "./ApiUrls";


// CATEGORIES APIS 
export const getProductcategoriesApi= async (query: any) => {
    return axios.get(
      `${ApiUrls.categories}${query}`
    );
  };

  // PRODUCTS APIS 
export const getProductApi= async (query: any) => {
  return axios.get(
    `${ApiUrls.product}${query}`
  );
};

// VARIANTS
export const getVariantsProductApi= async (query: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}/`;
  return axios.get(`${ApiUrls.variants}${formattedQuery}`);
};

// SIZES
export const getSizesApi= async (query: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}/`;
  return axios.get(`${ApiUrls.sizes}${formattedQuery}`);
};


// PRODUCT VARIANT CART ITEM UPDATE
export const getProductVariantCartItemUpdate= async (query: any ,payload:any) => {
  return axios.post(`${ApiUrls.productVariantCart}${query}`,payload);
};

//  SINGLE PRODUCT WITH VARIANT SIZE
export const getProductWithVariantSizeApi= async (query: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}/`;
  return axios.get(`${ApiUrls.fetchProductWithVariantSize}${formattedQuery}`);
};

//  ALL PRODUCT WITH VARIANT SIZE
export const getAllProductWithVariantSizeApi= async (query: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}`;
  return axios.get(`${ApiUrls.AllProductWithVariantSize}${formattedQuery}`);
};

