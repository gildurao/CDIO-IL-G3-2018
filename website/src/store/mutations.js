import * as types from './mutation-types'
import store from '.';

export const mutations = {

  /**
   * Saves the retrieved product from MYCM into the state's product
   * @param {*} state The store's state
   * @param {*} payload Received payload with the product info
   */
  [types.INIT_PRODUCT](state, payload) {
    state.product = payload.product;
  },

  /**
   * Changes the states's customized product's dimension
   * @param {*} state The store's state
   * @param {*} payload Payload with the new width
   */
  [types.SET_CUSTOMIZED_PRODUCT_DIMENSIONS](state, payload) {
    state.customizedProduct.customizedDimensions.width = payload.width;
    state.customizedProduct.customizedDimensions.height = payload.height;
    state.customizedProduct.customizedDimensions.depth = payload.depth;
    state.customizedProduct.customizedDimensions.unit = payload.unit;
  },

  // /* *
  //  * Changes the states's customized product's width
  //  * @param {*} state The store's state
  //  * @param {*} payload Payload with the new width
  //  */
  // [types.SET_CUSTOMIZED_PRODUCT_WIDTH](state, payload) {
  //   state.customizedProduct.customizedDimensions.width = payload.width;
  // },

  // /**
  //  * Changes the states's customized product's heigth
  //  * @param {*} state The store's state
  //  * @param {*} payload Payload with the new height
  //  */
  // [types.SET_CUSTOMIZED_PRODUCT_HEIGHT](state, payload) {
  //   state.customizedProduct.customizedDimensions.height = payload.height;
  // },

  // /**
  //  * Changes the states's customized product's depth
  //  * @param {*} state The store's state
  //  * @param {*} payload Payload with the new depth 
  //  */
  // [types.SET_CUSTOMIZED_PRODUCT_DEPTH](state, payload) {
  //   state.customizedProduct.customizedDimensions.depth = payload.depth;
  // },

  // /**
  //  * Changes the states's customized product's unit
  //  * @param {*} state The store's state
  //  * @param {*} payload Payload with the new unit 
  //  */
  // [types.SET_CUSTOMIZED_PRODUCT_UNIT](state, payload) {
  //   state.customizedProduct.customizedDimensions.unit = payload.unit;
  // },
  /**
   * Changes the states's customized product's unit
   * @param {*} state The store's state
   * @param {*} payload Payload with the new unit 
   */
  [types.SET_CUSTOMIZED_PRODUCT_UNIT](state, payload) {
    state.customizedProduct.customizedDimensions.unit = payload.unit;
  },

  /**
   * Changes the states's customized product's slot width
   * @param {*} state The store's state
   * @param {*} payload Payload with the new slot width 
   */
  [types.SET_SLOT_DIMENSIONS](state, payload) {
    
      state.customizedProduct.slots.push({
        idSlot: payload.idSlot,
        depth: payload.depth,
        width: payload.width,
        height: payload.height,
        unit: payload.unit,
  })  
},


  /**
   * Adds a component to a slot from the state's customized product's
   * @param {*} state The store's state
   * @param {*} payload Payload with the component to add
   */
  [types.SET_CUSTOMIZED_PRODUCT_COMPONENTS](state, payload) {
    if(state.customizedProduct.slots.length >= payload.component.slot)
    state.customizedProduct.slots[payload.component.slot - 1].components.push(payload.component);
  }
}
