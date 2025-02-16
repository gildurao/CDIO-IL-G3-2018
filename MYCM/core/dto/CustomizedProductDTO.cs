﻿using System;
using System.Runtime.Serialization;
using System.Collections.Generic;
using core.domain;
using support.dto;
using System.Linq;

namespace core.dto
{
    /// <summary>
    /// DTO that represents a ConfiguredProduct instance
    /// </summary>
    [DataContract]
    public class CustomizedProductDTO : DTO
    {
        // <summary>
        /// CustomizedProducts's database identifier
        /// </summary>
        /// <value>Gets/sets the value of the database identifier field.</value>
        [DataMember(Name = "id")]
        public long id { get; set; }

        /// <summary>
        /// String with the CustomizedProduct's reference
        /// </summary>
        [DataMember(Name = "reference")]
        public string reference { get; set; }

        /// <summary>
        /// String with the CustomizedProduct's designation
        /// </summary>
        [DataMember(Name = "designation")]
        public string designation { get; set; }

        /// <summary>
        /// CustomizedMaterialDTO with the CustomizedProduct's material
        /// </summary>
        [DataMember(Name = "customizedMaterial")]
        public CustomizedMaterialDTO customizedMaterialDTO { get; set; }

        /// <summary>
        /// CustomizedDimensionsDTO with the CustomizedProduct's dimensions
        /// </summary>
        [DataMember(Name = "customizedDimensions")]
        public CustomizedDimensionsDTO customizedDimensionsDTO { get; set; }

        /// <summary>
        /// ProductDTO with the CustomizedProduct's product
        /// </summary>
        [DataMember(Name = "product")]
        public ProductDTO productDTO { get; set; }

        /// <summary>
        /// List of SlotDTO with the CustomizedProduct's list of slots.
        /// </summary>
        /// <value>Gets/sets the value of the slot list.</value>
        [DataMember(Name = "slots")]
        public List<SlotDTO> slotListDTO { get; set; }

        /// <summary>
        /// Returns CustomizedProductDTO's equivalent CustomizedProduct
        /// </summary>
        /// <returns>CustomizedProductDTO's equivalent CustomizedProduct</returns>
        /* public CustomizedProduct toEntity()
        {

            CustomizedProduct instanceFromDTO;
            if (slotListDTO == null || slotListDTO.Count == 0)
            {
                instanceFromDTO = new CustomizedProduct(reference, designation, customizedMaterialDTO.toEntity(), customizedDimensionsDTO.toEntity(), productDTO.toEntity());
            }
            else
            {
                List<Slot> slots = DTOUtils.reverseDTOS(slotListDTO).ToList();

                instanceFromDTO = new CustomizedProduct(reference, designation, customizedMaterialDTO.toEntity(), customizedDimensionsDTO.toEntity(), productDTO.toEntity(), slots);
            }
            instanceFromDTO.Id = this.id;
            return instanceFromDTO;
        } */
    }
}