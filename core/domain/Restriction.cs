using support.builders;
using support.domain;
using support.domain.ddd;
using support.dto;
using support.utils;
using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using core.dto;
using System.ComponentModel.DataAnnotations.Schema;

namespace core.domain
{
    /// <summary>
    /// Represents a Product Restriction
    /// </summary>
    public class Restriction : DTOAble<RestrictionDTO>
    {

        /// <summary>
        /// Constant with the message that is presented when the restriction being instantiated has an invalid description
        /// </summary>
        private const string INVALID_DESCRIPTION = "Description can't be null or empty";

        /// <summary>
        /// Constant with the message that is presented when the restriction being instantiated has an invalid algorithm
        /// </summary>
        private const string INVALID_ALGORITHM = "Algorithm can't be null";

        /// <summary>
        /// Long property with the persistence iD
        /// </summary>
        public long Id { get; internal set; }
        /// <summary>
        /// Description of the restriction
        /// </summary>
        public string description { get; set; }
        /// <summary>
        /// Algorithm aplied by this restriction
        /// </summary>
        [NotMapped]
        public Algorithm algorithm { get; set; }
        /// <summary>
        /// Returns DTO equivalent of the Restriction
        /// </summary>
        /// <returns>DTO equivalent of the Restriction</returns>

        /// <summary>
        /// Empty constructor for ORM
        /// </summary>
        protected Restriction() { }

        /// <summary>
        /// Builds a Restriction object with a description and an algorithm
        ///! The algorithm isn't in the constructor because an implementation of the interface does not exist yet
        ///TODO add list of input values and algorithm
        /// </summary>
        /// <param name="description">restriction's description</param>
        /// <param name="algorithm">restriction's algorithm</param>
        public Restriction(string description)
        {
            if (String.IsNullOrEmpty(description) || description.Trim().Length == 0)
            {
                throw new ArgumentException(INVALID_DESCRIPTION);
            }

            this.description = description;
        }

        /// <summary>
        /// Checks if two Restrictions objects are equal
        /// </summary>
        /// <param name="obj">object being compared</param>
        /// <returns>true if they're equal, false if otherwise</returns>
        public override bool Equals(object obj)
        {
            if (this == obj)
            {
                return true;
            }

            if (obj == null || !obj.GetType().Equals(this.GetType()))
            {
                return false;
            }

            var other = (Restriction)obj;

            //! For now only the description is being compared
            return this.description.Equals(other.description);
        }

        /// <summary>
        /// Restriction's hash code
        /// </summary>
        /// <returns>hash code</returns>
        public override int GetHashCode()
        {
            //! For now only the description is being used to create the hash
            return description.GetHashCode();
        }

        /// <summary>
        /// Restriction's ToString
        /// </summary>
        /// <returns>string description of a restriction</returns>
        public override string ToString()
        {
            return String.Format("Restriction:{0}", description);
        }

        //TODO add algorithm & list of input values to dto
        public RestrictionDTO toDTO()
        {
            RestrictionDTO dto = new RestrictionDTO();
            dto.id = Id;
            dto.description = description;
            return dto;
        }
    }
}
