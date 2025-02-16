using System;
using Microsoft.EntityFrameworkCore.Infrastructure;
using support.domain.ddd;
using support.utils;

namespace core.domain
{
    public class FinishPriceTableEntry : PriceTableEntry<Finish>, AggregateRoot<string>
    {
        /// <summary>
        /// Error message for then the material EID is null or empty
        /// </summary>
        private const string EMPTY_MATERIAL_EID = "Material EID can't be null or empty";

        /// <summary>
        /// Overrides entity property to allow lazy loading of the same
        /// </summary>
        /// <param name="_entity">entity type of the price table entry</param>
        public override Finish entity { get => LazyLoader.Load(this, ref _entity); protected set => _entity = value; }

        //TODO see if this is the best solution
        /// <summary>
        /// EID of the material that belongs to the finish
        /// </summary>
        /// <value>Gets/Sets the EID</value>
        public string materialEID { get; internal set; }

        /// <summary>
        /// Constructor used for injecting a LazyLoader
        /// </summary>
        /// <param name="lazyLoader">LazyLoader to be injected</param>
        private FinishPriceTableEntry(ILazyLoader lazyLoader) : base(lazyLoader) { }

        /// <summary>
        /// Empty constructor for ORM
        /// </summary>
        protected FinishPriceTableEntry() { }

        /// <summary>
        /// Builds a FinishPriceTableEntry with a price, a time period and a finish
        /// </summary>
        /// <param name="price">Table Entry's price</param>
        /// <param name="timePeriod">Table Entry's time period</param>
        /// <param name="finish">Table Entry's finish</param>
        public FinishPriceTableEntry(string materialEID, Finish finish, Price price, TimePeriod timePeriod)
                : base(finish, price, timePeriod)
        {
            checkMaterialEID(materialEID);
            this.materialEID = materialEID;
            createEID();
        }

        /// <summary>
        /// Checks if a material EID is valid
        /// </summary>
        private void checkMaterialEID(string materialEID)
        {
            if (materialEID == null || materialEID.Trim().Length == 0)
            {
                throw new ArgumentException(EMPTY_MATERIAL_EID);
            }
        }

        protected override void createEID()
        {
            eId = "M" + materialEID + "_" + entity.description + String.Format("_{0}-{1}-{2}T{3}:{4}:{5}",
                                timePeriod.startingDate.Year,
                                timePeriod.startingDate.Month,
                                timePeriod.startingDate.Day,
                                timePeriod.startingDate.Hour,
                                timePeriod.startingDate.Minute,
                                timePeriod.startingDate.Second);
        }

        public override string id()
        {
            return eId;
        }

        public override bool sameAs(string comparingEntity)
        {
            return eId.Equals(comparingEntity);
        }
    }
}