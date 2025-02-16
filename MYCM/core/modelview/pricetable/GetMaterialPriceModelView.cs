using System.Runtime.Serialization;

namespace core.modelview.pricetable
{
    /// <summary>
    /// Model View representation for the fetch material price context
    /// </summary>
    [DataContract]
    public sealed class GetMaterialPriceModelView
    {
        /// <summary>
        /// Long with the material's ID
        /// </summary>
        /// <value></value>
        [DataMember(Name = "materialId")]
        public long materialId { get; set; }
        
        /// <summary>
        /// Long with the price entry ID
        /// </summary>
        [DataMember(Name = "id")]
        public long id { get; set; }

        /// <summary>
        /// Long with the price entry value
        /// </summary>
        [DataMember(Name = "value")]
        public double value { get; set; }

        /// <summary>
        /// String with the price entry currency
        /// </summary>
        [DataMember(Name = "currency")]
        public string currency { get; set; }

        /// <summary>
        /// String with the price entry area
        /// </summary>
        [DataMember(Name = "area")]
        public string area { get; set; }

        /// <summary>
        /// String with the price entry starting date
        /// </summary>
        [DataMember(Name = "startingDate")]
        public string startingDate { get; set; }

        /// <summary>
        /// String with the price entry ending date
        /// </summary>
        [DataMember(Name = "endingDate")]
        public string endingDate { get; set; }
    }
}