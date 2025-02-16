using System.Runtime.Serialization;

namespace core.modelview.commercialcatalogue
{
    /// <summary>
    /// Class representing the ModelView used for updating an instance of CommercialCatalogue.
    /// </summary>
    [DataContract]
    public class UpdateCommercialCatalogueModelView
    {
        /// <summary>
        /// CommercialCatalogue's persistence identifier.
        /// </summary>
        /// <value>Gets/Sets the persistence identifier.</value>
        [IgnoreDataMember]
        public long commercialCatalogueId { get; set; }

        /// <summary>
        /// CommercialCatalogue's reference.
        /// </summary>
        /// <value>Gets/Sets the reference.</value>
        [DataMember]
        public string reference { get; set; }

        /// <summary>
        /// CommercialCatalogue's designation.
        /// </summary>
        /// <value>Gets/Sets the designation.</value>
        [DataMember]
        public string designation { get; set; }
    }
}