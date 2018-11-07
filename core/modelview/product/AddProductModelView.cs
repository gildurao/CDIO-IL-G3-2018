using System.Collections.Generic;
using System.Runtime.Serialization;
using core.modelview.measurement;
using core.modelview.slotdimensions;

namespace core.modelview.product
{
    /// <summary>
    /// Class representing the ModelView used for adding new instances of Product.
    /// </summary>
    [DataContract]
    public class AddProductModelView
    {
        /// <summary>
        /// Product's reference.
        /// </summary>
        /// <value>Gets/sets the product's reference.</value>
        [DataMember]
        public string reference { get; set; }

        /// <summary>
        /// Product's designation.
        /// </summary>
        /// <value>Gets/sets the product's designation.</value>
        [DataMember]
        public string designation { get; set; }

        /// <summary>
        /// Category's database identifier.
        /// </summary>
        /// <value>Gets/sets the category's database identifier.</value>
        [DataMember]
        public long categoryId { get; set; }

        /// <summary>
        /// List of components being added to the product.
        /// </summary>
        /// <value>Gets/sets the product's list of components.</value>
        [DataMember]
        public List<AddComponentToProductModelView> components { get; set; }

        /// <summary>
        /// List of materials being added to the product.
        /// </summary>
        /// <value>Gets/sets the product's list of materials.</value>
        [DataMember]
        public List<AddMaterialToProductModelView> materials { get; set; }

        /// <summary>
        /// List of measurements being added to the product.
        /// </summary>
        /// <value>Gets/setst the product's list of measurements.</value>
        [DataMember(Name = "dimensions")]
        public List<AddMeasurementModelView> measurements { get; set; }

        /// <summary>
        /// Product's slot dimensions.
        /// </summary>
        /// <value>Gets/sets the slot dimensions.</value>
        [DataMember]
        public AddSlotDimensionsModelView slotSizes { get; set; }
    }
}