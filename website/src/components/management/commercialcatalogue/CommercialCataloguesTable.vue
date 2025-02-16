<template>
  <div>
    <vuetable :api-mode="false" :data="data" :fields="columns">
      <template slot="actions" slot-scope="props">
        <div class="custom-actions">
          <button class="btn-primary" @click="enableCatalogueDetails(props.rowData.id, false)">
            <b-icon icon="magnify"/>
          </button>
          <button class="btn-primary" @click="enableCatalogueDetails(props.rowData.id, true)">
            <b-icon icon="pencil"/>
          </button>
          <button class="btn-primary" @click="deleteCommercialCatalogue(props.rowData.id)">
            <b-icon icon="minus"/>
          </button>
        </div>
      </template>
    </vuetable>

    <commercial-catalogue-details
      v-if="displayCatalogueDetails"
      :commercialCatalogueId="selectedCatalogueId"
      :editable="editable"
      @closeModal="displayCatalogueDetails = false"
      @updateTableEntry="updateTableEntry"
    />
  </div>
</template>

<script>
import CommercialCatalogueRequests from "./../../../services/mycm_api/requests/commercialcatalogues.js";
import CommercialCatalogueDetails from "./CommercialCatalogueDetails";
export default {
  name: "CommercialCataloguesTable",
  components: { CommercialCatalogueDetails },
  data() {
    return {
      columns: [
        {
          name: "id",
          title: "ID"
        },
        {
          name: "reference",
          title: "Reference"
        },
        {
          name: "designation",
          title: "Designation"
        },
        {
          name: "hasCollections",
          title: "Collections",
          dataClass: "centered aligned",
          callback: this.booleansAsIcons
        },
        {
          name: "__slot:actions",
          title: "Actions"
        }
      ],
      selectedCatalogueId: 0,
      displayCatalogueDetails: false,
      editable: false
    };
  },
  props: {
    data: Array
  },
  watch: {
    /**
     * Watches for changes in the data prop and updates the table.
     */
    data(newVal) {
      this.data = newVal;
    }
  },
  methods: {
    booleansAsIcons(value) {
      return value
        ? '<span class="ui teal label"><i class="material-icons">check</i></span>'
        : '<span class="ui teal label"><i class="material-icons">close</i></span>';
    },
    /**
     * Deletes a CommercialCatalogue.
     * @param {number} commercialCatalogueId
     */
    deleteCommercialCatalogue(commercialCatalogueId) {
      CommercialCatalogueRequests.deleteCommercialCatalogue(
        commercialCatalogueId
      )
        .then(() => {
          this.deleteTableEntry(commercialCatalogueId);
          this.$toast.open({ message: "Catalogue was deleted successfully!" });
        })
        .catch(error => {
          //delete the entry in the table even if the api call fails
          this.deleteTableEntry(commercialCatalogueId);
          this.$toast.open(error.response.data.message);
        });
    },

    /**
     * Updates an entry in the CommercialCatalogue table with a matching identifier and new data.
     * @param {number} commercialCatalogueId
     * @param {string} newReference
     * @param {string} newDesignation
     * @param {boolean} hasCollections
     * @param {boolean} keepAlive
     */
    updateTableEntry(
      commercialCatalogueId,
      newReference,
      newDesignation,
      hasCollections,
      keepAlive
    ) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].id == commercialCatalogueId) {
          this.data[i].reference = newReference;
          this.data[i].designation = newDesignation;
          this.data[i].hasCollections = hasCollections;
        }
      }
      this.displayCatalogueDetails = keepAlive;
    },

    /**
     * Deletes an entry from the CommercialCatalogue table with a matching identifier.
     * @param {number} commercialCatalogueId
     */
    deleteTableEntry(commercialCatalogueId) {
      //remove the element in the array with the matching id
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].id == commercialCatalogueId) {
          this.data.splice(i, 1);
        }
      }
    },

    /**
     * Retrieves a CommercialCatalogue and toggles the flags that enable the details modal.
     * @param {number} commercialCatalogueId
     * @param {boolean} editable
     */
    enableCatalogueDetails(commercialCatalogueId, editable) {
      this.selectedCatalogueId = commercialCatalogueId;
      this.editable = editable;
      this.displayCatalogueDetails = true;
    }
  }
};
</script>
