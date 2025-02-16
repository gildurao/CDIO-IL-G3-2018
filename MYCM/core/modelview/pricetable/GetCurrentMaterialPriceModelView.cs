using System.Runtime.Serialization;
using core.modelview.material;
using core.modelview.price;

namespace core.modelview.pricetable
{
    /// <summary>
    /// ModelView to represent the fetch of a material's current price
    /// </summary>
    [DataContract]
    public class GetCurrentMaterialPriceModelView
    {
        /// <summary>
        /// Price Table Entry's PID
        /// </summary>
        /// <value>Gets/Sets the id</value>
        [DataMember(Name = "tableEntryId")]
        public long tableEntryId { get; set; }

        /// <summary>
        /// Requested material
        /// </summary>
        /// <value>Gets/Sets the model view</value>
        [DataMember(Name = "material")]
        public GetBasicMaterialModelView material { get; set; }

        /// <summary>
        /// Material's current price
        /// </summary>
        /// <value>Gets/Sets the current price</value>
        [DataMember(Name = "currentPrice")]
        public PriceModelView currentPrice { get; set; }

        /// <summary>
        /// Time period for which the current price is going to be active
        /// </summary>
        /// <value>Gets/Sets the time period</value>
        [DataMember(Name = "timePeriod")]
        public TimePeriodModelView timePeriod { get; set; }
    }
}