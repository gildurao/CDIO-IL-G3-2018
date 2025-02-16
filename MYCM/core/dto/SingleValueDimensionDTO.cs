using System;
using System.Runtime.Serialization;
using core.domain;
using core.services;
using support.dto;

namespace core.dto
{
    /// <summary>
    /// DTO that represents a SingleValueDimension object
    /// </summary>
    [DataContract]
    public class SingleValueDimensionDTO : DimensionDTO
    {

        /// <summary>
        /// Value that the dimension has
        /// </summary>
        /// <value>Get/Set of the value</value>
        [DataMember(Order = 2)]
        public double value { get; set; }

        /// <summary>
        /// Builds a SingleValueDimension instance from a SingleValueDimensionDTO
        /// </summary>
        /// <returns>SingleValueDimension instance</returns>
        public override Dimension toEntity()
        {
            double value = MeasurementUnitService.convertFromUnit(this.value, unit);

            SingleValueDimension instanceFromDTO = new SingleValueDimension(value);
            instanceFromDTO.Id = id;

            return instanceFromDTO;
        }
    }
}