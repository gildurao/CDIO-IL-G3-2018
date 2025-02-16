//@ts-check
import Axios, { AxiosPromise } from 'axios'
import { MYCM_API_URL } from '../../../config'

export default {

    /**
     * Retrieve all of the available CommercialCatalogues.
     * @returns {AxiosPromise<any>} Axios Promise representing all of the available CommercialCatalogues.
     */
    getCommercialCatalogues() {
        return Axios.get(`${MYCM_API_URL}/commercialcatalogues`);
    },

    /**
     * Retrieves a CommercialCatalogue with the matching identifier.
     * @param {number} commercialCatalogueId - CommercialCatalogue's identifier.
     * @returns {AxiosPromise<any>} Axios Promise representing the CommercialCatalogue with the matching identifier.
     */
    getCommercialCatalogue(commercialCatalogueId) {
        return Axios.get(`${MYCM_API_URL}/commercialcatalogues/${commercialCatalogueId}`);
    },

    /**
     * Retrieves all of the Collections from a CommercialCatalogue.
     * @param {number} commercialCatalogueId - CommercialCatalogue's identifier.
     * @returns {AxiosPromise<any>} Axios Promise representing the CommercialCatalogue's Collections.
     */
    getCommercialCatalogueCollections(commercialCatalogueId) {
        return Axios.get(`${MYCM_API_URL}/commercialcatalogues/${commercialCatalogueId}/collections`);
    },

    /**
     * Retrieves a Collection from a CommercialCatalogue.
     * @param {number} commercialCatalogueId - CommercialCatalogue's identifier.
     * @param {number} collectionId - Collection's identifier.
     * @returns {AxiosPromise<any>} Axios Promise representing the CommercialCatalogue's Collection.
     */
    getCommercialCatalogueCollection(commercialCatalogueId, collectionId) {
        return Axios.get(`${MYCM_API_URL}/commercialcatalogues/${commercialCatalogueId}/collections/${collectionId}`);
    },

    /**
     * Retrieves the list of CustomizedProducts from a CommercialCatalogue's Collection.
     * @param {number} commercialCatalogueId - CommercialCatalogue's identifier.
     * @param {number} collectionId - Collection's identifier.
     * @returns {AxiosPromise<any>} Axios Promise representing the CustomizedProducts in the CommercialCatalogue's Collection.
     */
    getCommercialCatalogueCollectionCustomizedProducts(commercialCatalogueId, collectionId) {
        return Axios.get(`${MYCM_API_URL}/commercialcatalogues/${commercialCatalogueId}/collections/${collectionId}/customizedproducts`);
    },

    /**
     * Adds a CommercialCatalogue.
     * @param {*} commercialCatalogue
     * @returns {AxiosPromise<any>} Axios Promise representing the added CommercialCatalogue.
     */
    postCommercialCatalogue(commercialCatalogue) {
        return Axios.post(`${MYCM_API_URL}/commercialcatalogues`, commercialCatalogue);
    },

    /**
     * Adds a Collection to a CommercialCatalogue.
     * @param {number} commercialCatalogueId - CommercialCatalogue's identifier.
     * @param {*} collection - Collection being added.
     * @returns {AxiosPromise<any>} Axios Promise representing the added Collection.
     */
    postCommercialCatalogueCollection(commercialCatalogueId, collection) {
        return Axios.post(`${MYCM_API_URL}/commercialcatalogues/${commercialCatalogueId}/collections`, collection);
    },

    /**
     * Adds a CustomizedProduct to a CommercialCatalogue's Collection.
     * @param {number} commercialCatalogueId - CommercialCatalogue's identifier.
     * @param {number} collectionId - Collection's identifier.
     * @param {*} customizedProduct 
     * @returns {AxiosPromise<any>} Axios Promise representing the added CustomizedProduct.
     */
    postCommercialCatalogueCollectionCustomizedProduct(commercialCatalogueId, collectionId, customizedProduct) {
        return Axios.post(`${MYCM_API_URL}/commercialcatalogues/${commercialCatalogueId}/collections/${collectionId}/customizedproducts`, customizedProduct);
    },

    /**
     * Updates a CommercialCatalogue.
     * @param {number} commercialCatalogueId - CommercialCatalogue's identifier.
     * @param {number} commercialCatalogue - CommercialCatalogue's updated data.
     * @returns {AxiosPromise<any>} Axios Promise representing the updated CommercialCatalogue.
     */
    putCommercialCatalogue(commercialCatalogueId, commercialCatalogue) {
        return Axios.put(`${MYCM_API_URL}/commercialcatalogues/${commercialCatalogueId}`, commercialCatalogue);
    },

    /**
     * Deletes a CommercialCatalogue.
     * @param {number} commercialCatalogueId - CommercialCatalogue's identifier.
     * @returns {AxiosPromise<any>} Axios Promise representing the deleted CommercialCatalogue.
     */
    deleteCommercialCatalogue(commercialCatalogueId) {
        return Axios.delete(`${MYCM_API_URL}/commercialcatalogues/${commercialCatalogueId}`);
    },

    /**
     * Deletes a CommercialCatalogue's Collection.
     * @param {number} commercialCatalogueId - CommercialCatalogue's identifier.
     * @param {number} collectionId - Collection's identifier.
     * @returns {AxiosPromise<any>} Axios Promise representing the deleted Collection.
     */
    deleteCommercialCatalogueCollection(commercialCatalogueId, collectionId) {
        return Axios.delete(`${MYCM_API_URL}/commercialcatalogues/${commercialCatalogueId}/collections/${collectionId}`);
    },

    /**
     * Deletes a CustomizedProduct from a CommercialCatalogue's Collection.
     * @param {number} commercialCatalogueId - CommercialCatalogue's identifier.
     * @param {number} collectionId - Collection's identifier.
     * @param {*} customizedProductId - CustomizedProduct's identifier.
     * @returns {AxiosPromise<any>} Axios Promise representing the deleted CustomizedProduct.
     */
    deleteCommercialCatalogueCollectionCustomizedProduct(commercialCatalogueId, collectionId, customizedProductId) {
        return Axios.delete(`${MYCM_API_URL}/commercialcatalogues/${commercialCatalogueId}/collections/${collectionId}/customizedproducts/${customizedProductId}`);
    }

}