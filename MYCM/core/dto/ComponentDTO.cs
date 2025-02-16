using System.Collections.Generic;
using System.Runtime.Serialization;
using core.domain;
using support.dto;

namespace core.dto {
    /// <summary>
    /// Represents a Component's Data Transfer Object.
    /// </summary>
    /// <typeparam name="Component">Type of entity</typeparam>
    /// <typeparam name="ComponentDTO">Type of DTO</typeparam>
    [DataContract]
    public class ComponentDTO : DTO, DTOParseable<Component, ComponentDTO> {
        /// <summary>
        /// Component's database identifier.
        /// </summary>
        /// <value>Gets/sets the value of the database identifier field.</value>
        [DataMember(Name = "id")]
        public long id { get; set; }
        /// <summary>
        /// Component's obligatoriness.
        /// </summary>
        /// <value>Gets/sets the value of obligatoriness.</value>
        [DataMember(Name = "mandatory")]
        public bool mandatory { get; set; }
        /// <summary>
        /// Component's product.
        /// </summary>
        [DataMember(Name = "complementedProduct")]
        public ProductDTO product { get; set; }
        /// <summary>
        /// Component's list restrictions.
        /// </summary>
        /// <value>Gets/sets the value of the restrictions field.</value>
        [DataMember(Name = "restrictions", EmitDefaultValue = false)]  //no data field data is presented if it's null
        public List<RestrictionDTO> restrictions { get; set; }
        public Component toEntity() {
            throw new System.NotImplementedException();
        }
    }
}