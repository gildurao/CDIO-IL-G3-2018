using System;
using support.domain.ddd;
using core.dto;
using core.services;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace core.domain {

    /// <summary>
    /// Class that represents a dimension and its value (e.g. width - 20 cm)
    /// </summary>
    public class SingleValueDimension : Dimension {

        /// <summary>
        /// Constant that represents the message that occurs if the value is NaN
        /// </summary>
        private const string VALUE_IS_NAN_REFERENCE = "Dimension value has to be a number";

        /// <summary>
        /// Constant that represents the message that occurs if the value is infinity
        /// </summary>
        private const string VALUE_IS_INFINITY_REFERENCE = "Dimension value can't be infinity";

        /// <summary>
        /// Constant that represents the message that occurs if the value is negative
        /// </summary>
        private const string NEGATIVE_OR_ZERO_VALUE_REFERENCE = "Dimension value can't be negative or zero";

        /// <summary>
        /// Value that the dimension has
        /// </summary>
        public double value { get; set; }

        private SingleValueDimension(ILazyLoader lazyLoader) : base(lazyLoader) { }

        /// <summary>
        /// Empty constructor for ORM.
        /// </summary>
        protected SingleValueDimension() { }

        /// <summary>
        /// Builds a new instance of Dimension
        /// </summary>
        /// <param name="value">value that the dimension has</param>
        public SingleValueDimension(double value) {
            if (Double.IsNaN(value)) {
                throw new ArgumentException(VALUE_IS_NAN_REFERENCE);
            }

            if (Double.IsInfinity(value)) {
                throw new ArgumentException(VALUE_IS_INFINITY_REFERENCE);
            }

            if (value <= 0) {
                throw new ArgumentException(NEGATIVE_OR_ZERO_VALUE_REFERENCE);
            }

            this.value = value;
        }

        public override bool hasValue(double value) {
            decimal valueAsDecimal = (decimal)this.value;
            decimal otherValueAsDecimal = (decimal)value;

            return decimal.Compare(valueAsDecimal, otherValueAsDecimal) == 0;
        }


        //*These two methods should return the same value in instances of this particular class, since there's only value. */
        public override double getMaxValue() {
            return value;
        }

        public override double getMinValue() {
            return value;
        }

        public override double[] getValuesAsArray() {
            double[] array = { value };
            return array;
        }

        /// <summary>
        /// Equals method of Dimension
        /// Two instances are equal if they share the same value
        /// </summary>
        /// <param name="obj">object that is being compared</param>
        /// <returns>true if the objects are equal, false if otherwise</returns>
        public override bool Equals(object obj) {
            if (obj == null || !obj.GetType().ToString().Equals("core.domain.SingleValueDimension")) {
                return false;
            }

            if (this == obj) {
                return true;
            }

            SingleValueDimension other = (SingleValueDimension)obj;

            return Double.Equals(this.value, other.value);
        }

        /// <summary>
        /// Hash code of Dimension
        /// </summary>
        /// <returns>hash code of a Dimension instance</returns>
        public override int GetHashCode() {
            return value.GetHashCode();
        }

        /// <summary>
        /// ToString method of Dimension
        /// </summary>
        /// <returns>value of the dimension</returns>
        public override string ToString() {
            return string.Format("Value: {0}", value);
        }

        /// <summary>
        /// Builds a DimensionDTO out of a SingleValueDimension instance
        /// </summary>
        /// <returns>DimensionDTO instance</returns>
        public override DimensionDTO toDTO() {
            SingleValueDimensionDTO dto = new SingleValueDimensionDTO();

            dto.id = Id;
            dto.value = value;
            dto.unit = MeasurementUnitService.getMinimumUnit();

            return dto;
        }

        public override DimensionDTO toDTO(string unit) {
            if (unit == null) {
                return this.toDTO();
            }
            SingleValueDimensionDTO dto = new SingleValueDimensionDTO();

            dto.id = Id;
            dto.value = MeasurementUnitService.convertToUnit(value, unit);
            dto.unit = unit;

            return dto;
        }
    }
}