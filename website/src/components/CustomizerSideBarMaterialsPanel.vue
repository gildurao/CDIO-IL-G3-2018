<template>
  <div>
    <div v-if="getMaterialsOk">
      <div class="icon-div-top">
        <i class="material-icons md-12 md-blue btn">help</i>
        <span class="tooltiptext">In this step, you can add a material to the closet.</span>
      </div>
      <div class="text-entry">Choose a material to add:</div>
      <div class="padding-div">
        <div class="scrollable-div" style="height: 300px; width: 100%;">
           <a v-if="getMaterialInformationOK" class="sidepanel">
              <a v-if="hasFinishes" class="sidepanel-entry" @click="changeShowFinishes">
                <p><i class="material-icons md-12 md-blue">brush</i> <b>Finishes <i class="fa fa-caret-down"></i></b></p>
              </a>
              <div class="dropdown-container" v-if="showFinishes">
                <a class="sidepanel-subentry" @click="removeFinish()">
                  <swatches value="" :trigger-style="{ width: '10px', height: '10px', position:'absolute', left:'-16px', top:'6px'}"/>
                  None
                </a>   
                <div v-for="finish in finishes" :key="finish.description">
                  <a class="sidepanel-subentry" @click="applyFinish(finish)">{{finish.description}}</a>   
                </div>           
              </div>
              <a v-if="hasColors" class="sidepanel-entry" @click="changeShowColors">
                <p><i class="material-icons md-12 md-blue">color_lens</i> <b>Colors <i class="fa fa-caret-down"></i></b></p>
              </a>
              <div class="dropdown-container" v-if="showColors">
                <a class="sidepanel-subentry" @click="removeColor()">
                  <swatches value="" :trigger-style="{ width: '10px', height: '10px', position:'absolute', left:'-16px', top:'6px'}"/>
                  None
                </a>
                <div v-for="color in colors" :key="color.name">
                  <a class="sidepanel-subentry" @click="applyColor(color)">
                    <swatches
                    :value="rgbToHex(color)"
                    :trigger-style="{ width: '10px',
                                      height: '10px',
                                      position: 'absolute',
                                      left: '-16px',
                                      top: '6px',
                                      borderRadius: '3px',
                                      cursor: 'pointer',
                                      border: 'thin solid black' }"
                    :disabled="true"/>
                    {{color.name}}
                  </a>   
                </div>                       
              </div>
          </a>
          <ul class="image-list" v-for="material in materials" :key="material.id">
            <li class="image-btn" @click="applyMaterial(material); getMaterialInformation(material.id); removeFinish(); removeColor()">
              <img :src="findMaterialImage(material.image)" width="100%">
              <p>{{material.designation}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="text-entry">
        <b>Error: {{httpCode}}</b>
      </div>
      <div class="text-entry">Yikes! Looks like we ran into a problem here...</div>
      <div class="icon-div-center">
        <i class="material-icons md-36 md-blue btn" @click="getProductMaterials">refresh</i>
      </div>
    </div>
    <div class="center-controls">
      <i class="btn btn-primary material-icons" @click="previousPanel()">arrow_back</i>
      <i class="btn btn-primary material-icons" @click="nextPanel()">arrow_forward</i>
    </div>
  </div>
</template>

<script>
import ProductRequests from "./../services/mycm_api/requests/products.js";
import MaterialRequests from "./../services/mycm_api/requests/materials.js";
import CustomizedProductRequests from "./../services/mycm_api/requests/customizedproducts.js";
import store from "./../store";
import Swatches from "vue-swatches";
import "vue-swatches/dist/vue-swatches.min.css";
import { SET_CUSTOMIZED_PRODUCT_MATERIAL, SET_CUSTOMIZED_PRODUCT_FINISH,
         SET_CUSTOMIZED_PRODUCT_COLOR, DEACTIVATE_CAN_MOVE_CLOSET,
         DEACTIVATE_CAN_MOVE_SLOTS,
ADD_SLOT_DIMENSIONS
        } from "./../store/mutation-types.js";
import { AlwaysDepth } from 'three';
import customizedproducts from './../services/mycm_api/requests/customizedproducts.js';

export default {
  name: "CustomizerSideBarMaterialsPanel",
  components: { Swatches }, 
  data() {
    return {
      materials: [],
      finishes: [],
      colors: [],
      showColors: false,
      showFinishes: false,
      httpCode: null
    };
  },
  computed: {
    getMaterialsOk() {
      return this.httpCode === 200;
    },
    getMaterialInformationOK() {
      return this.httpCode === 200;
    },
    hasFinishes(){
      return this.finishes.length > 0;
    },
    hasColors(){
      return this.colors.length > 0;
    }
  },
  methods: {
    getProductMaterials() {
      ProductRequests.getProductMaterials(store.state.product.id)
        .then(response => {
          this.materials = [];
          this.materials.push(...response.data);
          this.httpCode = response.status;
        })
        .catch(error => {
          if (error.response === undefined) {
            this.httpCode = 500;
          } else {
            this.httpCode = error.response.status;
          }
        });
    },
    getMaterialInformation(materialId) {
      MaterialRequests.getMaterial(materialId, {pricedFinishesOnly: true})
        .then(response => {
          this.colors = [];
          this.colors.push(...response.data.colors);

          this.finishes = [];
          this.finishes.push(...response.data.finishes);

          this.httpCode = response.status;
        })
        .catch(error => {
          if (error.response === undefined) {
            this.httpCode = 500;
            this.$toast.open("There was an error while fetching the selected material's data. Try reloading the page.");
          } else if(error.response.status == 404){
            this.finishes = [];
          }
        });
    },
    findMaterialImage(filename) {
      return "./src/assets/materials/" + filename;
    },
    applyMaterial(material) {
      store.dispatch(SET_CUSTOMIZED_PRODUCT_MATERIAL, {
        id: material.id,
        reference: material.reference,
        designation: material.designation,
        image: material.image
      });
    },
    applyFinish(finish){
      store.dispatch(SET_CUSTOMIZED_PRODUCT_FINISH, {
        description: finish.description,
        shininess: finish.shininess
      })
    },
    removeFinish(){
      store.dispatch(SET_CUSTOMIZED_PRODUCT_FINISH, {
        description: "None",
        shininess: 20
      })
    },     
    applyColor(color){
      store.dispatch(SET_CUSTOMIZED_PRODUCT_COLOR, {
        name: color.name,
        red: color.red,
        green: color.green,
        blue: color.blue,
        alpha: color.alpha
      })
    },
    removeColor(){
      store.dispatch(SET_CUSTOMIZED_PRODUCT_COLOR, {
        name: "None",
        red: 0,
        green: 0,
        blue: 0,
        alpha: 0
      })
    },
    changeShowColors(){
      if(this.showColors == true) this.showColors = false;
      else this.showColors = true;
    },
    changeShowFinishes(){
      if(this.showFinishes == true) this.showFinishes = false;
      else this.showFinishes = true;
    },
    rgbToHex(color){
      var red = this.convertValue(color.red);
      var green = this.convertValue(color.green);
      var blue = this.convertValue(color.blue);
      return "#" + red + green + blue;
    },
    convertValue(value){
      var hex = Number(value).toString(16);
      if (hex.length < 2) hex = "0" + hex;
      return hex;
    },
    nextPanel() {
      var hasColor = store.getters.customizedMaterialColorName && store.getters.customizedMaterialColorName != "None";
      var hasFinish = store.getters.customizedMaterialFinishDescription && store.getters.customizedMaterialFinishDescription != "None";
      if(!hasColor && !hasFinish){
        this.$toast.open("You must choose at least one finish or color!");
      } else if(hasColor && !hasFinish){
         CustomizedProductRequests.putCustomizedProduct(store.state.customizedProduct.id,
            {
	            customizedMaterial: {
		            materialId: store.state.customizedProduct.customizedMaterial.id,
		            color: {
			            name: store.state.customizedProduct.customizedMaterial.color.name,
                  red: store.state.customizedProduct.customizedMaterial.color.red,
                  green: store.state.customizedProduct.customizedMaterial.color.green,
                  blue: store.state.customizedProduct.customizedMaterial.color.blue,
                  alpha: store.state.customizedProduct.customizedMaterial.color.alpha
		            } 
	            },
            })
          .then(() => {
            this.$emit("advance");
          })
          .catch(() => {
            this.$toast.open("Unable to upload color.");
          });
      } else if(hasFinish && !hasColor){
        CustomizedProductRequests.putCustomizedProduct(store.state.customizedProduct.id, {
	          customizedMaterial: {
		          materialId: store.state.customizedProduct.customizedMaterial.id,
              finish: {
                description: store.state.customizedProduct.customizedMaterial.finish.description,
                shininess: store.state.customizedProduct.customizedMaterial.finish.shininess,
              }
            }
          })
        .then(() => {
          this.$emit("advance");
        })
        .catch(() => {
          this.$toast.open("Unable to upload finish.");
        });
      } else if(hasFinish && hasColor){
        CustomizedProductRequests.putCustomizedProduct(store.state.customizedProduct.id,
          {
	          customizedMaterial: {
              materialId: store.state.customizedProduct.customizedMaterial.id,
              color: {
			          name: store.state.customizedProduct.customizedMaterial.color.name,
                red: store.state.customizedProduct.customizedMaterial.color.red,
                green: store.state.customizedProduct.customizedMaterial.color.green,
                blue: store.state.customizedProduct.customizedMaterial.color.blue,
                alpha: store.state.customizedProduct.customizedMaterial.color.alpha
		          },
              finish: {
                description: store.state.customizedProduct.customizedMaterial.finish.description,
                shininess: store.state.customizedProduct.customizedMaterial.finish.shininess,
              }
            }
          })
        .then(() => {
          this.$emit("advance")
        })
        .catch(() => {
          this.$toast.open("Unable to upload color or finish.");
        });
      }
    },
    previousPanel() {
      this.$dialog.confirm({
        title: 'Return',
        hasIcon: true,
        type: 'is-info',
        icon: 'fas fa-exclamation-circle size:5px',
        iconPack: 'fa',
        message: 'Are you sure you want to return? All progress made in this step will be lost.',
        onConfirm: () => {        
          this.discardChanges();
          this.$emit("back");
        }
      })
    },
    discardChanges(){
      var defaultMaterial = this.materials[0];
      MaterialRequests.getMaterial(defaultMaterial.id, {pricedFinishesOnly: true})
        .then((response) => {
          var defaultFinish = response.data.finishes[0];
          CustomizedProductRequests.putCustomizedProduct(store.state.customizedProduct.id,
          {
            customizedMaterial: {
              materialId: defaultMaterial.id,
              finish: {
                description: defaultFinish.description,
                shininess: defaultFinish.shininess,
              },
            }
          })
          .then(() => {
              this.deleteSlots()
              this.applyMaterial(defaultMaterial);
              this.removeFinish();
              this.removeColor();
           })
          .catch(() => {
          this.$toast.open("An error has occurred while removing the material from the closet.");
          }); 
         })
        .catch(() => {
          this.$toast.open("An error has occurred while removing the material from the closet.");
        });
    },
    deleteSlots(){
      store.dispatch(ADD_SLOT_DIMENSIONS)
      let slotsToDelete = [];
      let custProducSlots = [];
      let size = -1
      CustomizedProductRequests.getCustomizedProducts()
        .then((response) => {
          custProducSlots = response.data;
          size = custProducSlots[custProducSlots.length - 1].id;
          CustomizedProductRequests.getCustomizedProduct(size)
          .then((product) => {
            custProducSlots = product.data.slots;
            for(let i = 0; i< custProducSlots.length-1; i++){
              slotsToDelete.unshift(custProducSlots[i].id);
            }
              this.deleteSlot(slotsToDelete)
              .then(() => {})
              .catch((error_message) => {
              });
          })
          .catch((error_message) => {
          });
        })
        .catch((error_message) => {
        });
    },
    deleteSlot(slotsToDelete){
      return new Promise((accept, reject) => {
        let slotToDelete = slotsToDelete.pop();
        CustomizedProductRequests.deleteCustomizedProductSlot(store.state.customizedProduct.id, slotToDelete)
        .then(() => {
          if(slotsToDelete.length > 0 ){
            return this.deleteSlot(slotsToDelete)
            .then(()=>{
              accept()})
            .catch((error_message) => {  
             reject(error_message)});
          } else {
             accept();
          }
        })
        .catch((error_message) => {
          reject(error_message.response.data.message);
        });
      })
    }, 
  },
  created() {
    this.getProductMaterials();
    store.dispatch(DEACTIVATE_CAN_MOVE_CLOSET);
    store.dispatch(DEACTIVATE_CAN_MOVE_SLOTS);
  }
};
</script>

<style>
.icon-div-top .tooltiptext {
  visibility: hidden;
  width: 100px;
  background-color: #797979;
  color: #fff;
  border-radius: 6px;
  font-size: 12px;
  padding: 10%;
  position: absolute;
  top: 25px;
  left: 0px;
  right: 0px;
}

.icon-div-top:hover .tooltiptext {
  visibility: visible;
}

.icon-div-top {
  top: 15px;
  left: 15px;
  margin-left: 88px;
  position: absolute;
}
</style>
