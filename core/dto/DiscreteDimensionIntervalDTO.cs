using System;
using System.Runtime.Serialization;
using System.Collections.Generic;
using core.domain;
using support.dto;

namespace core.dto
{
    /// <summary>
    /// DTO that represents a DiscreteDimensionInterval instance
    /// </summary>
    [DataContract]
    public class DiscreteDimensionIntervalDTO : DimensionDTO
    {

        [DataMember]
        /// <summary>
        /// List of values that the dimension can have
        /// </summary>
        /// <value>Get/Set of the list of values</value>
        public List<double> values { get; set; }

        /// <summary>
        /// Builds a DiscreteDimensionInterval instance from a DiscreteDimensionIntervalDTO
        /// </summary>
        /// <returns>DiscreteDimensionInterval instance</returns>
        public override Dimension toEntity()
        {
            DiscreteDimensionInterval instanceFromDTO = DiscreteDimensionInterval.valueOf(values);
            instanceFromDTO.Id = id;
            return instanceFromDTO;
        }
    }
}