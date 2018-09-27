using System;
using System.Collections.Generic;
using support.domain.ddd;
namespace core.domain
{
    /**
    <summary>
        Class that represents a Customized Dimensions.
        <br> Customized Dimensions is value object;
    </summary>
    */
    public class CustomizedDimensions : ValueObject
    {
       
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
        private const string NEGATIVE_VALUE_REFERENCE = "Dimension value can't be negative";
/**
        <summary>
            The CustomizedDimensions's height.
        </summary>
         */
        private readonly double height;
        /**
        <summary>
            The CustomizedDimensions's width.
        </summary>
         */
        private readonly double width;
        /**
        <summary>
            The CustomizedDimensions's depth.
        </summary>
         */
        private readonly double depth;
        /**
        <summary>
            Builds a new instance of CustomizedDimensions, receiving its height, width and depth.
        </summary>
        <param name = "height">double with the new CustomizedDimensions's height</param>
        <param name = "width">double with the new CustomizedDimensions's width</param>
        <param name = "depth">double with the new CustomizedDimensions's depth</param>
         */
        public static CustomizedDimensions valueOf(double height, double width, double depth)
        {
            return new CustomizedDimensions(height, width, depth);
        }
        /**
        <summary>
            Builds a new instance of CustomizedDimensions, receiving its height, width and depth.
        </summary>
        <param name = "height">double with the new CustomizedDimensions's height</param>
        <param name = "width">double with the new CustomizedDimensions's width</param>
        <param name = "depth">double with the new CustomizedDimensions's depth</param>
         */
        private CustomizedDimensions(double height, double width, double depth)
        {
            checkCustomizedDimensions(height, width, depth);
            this.height = height;
            this.width = width;
            this.depth = depth;
        }
        /**
        <summary>
            Checks if the CustomizedDimensions's height, width and  depth are valid.
        </summary>
        <param name = "height">double with the new CustomizedDimensions's height</param>
        <param name = "width">double with the new CustomizedDimensions's width</param>
        <param name = "depth">double with the new CustomizedDimensions's depth</param>
        */
        private void checkCustomizedDimensions(double height, double width, double depth)
        {
            if (Double.IsNaN(height)) throw new ArgumentException(VALUE_IS_NAN_REFERENCE);
            if (Double.IsInfinity(height))throw new ArgumentException(VALUE_IS_INFINITY_REFERENCE);
            if (height < 0)throw new ArgumentException(NEGATIVE_VALUE_REFERENCE);
            if (Double.IsNaN(width))throw new ArgumentException(VALUE_IS_NAN_REFERENCE);
            if (Double.IsInfinity(width)) throw new ArgumentException(VALUE_IS_INFINITY_REFERENCE);
            if (width < 0) throw new ArgumentException(NEGATIVE_VALUE_REFERENCE);
            if (Double.IsNaN(depth))throw new ArgumentException(VALUE_IS_NAN_REFERENCE);
            if (Double.IsInfinity(depth))throw new ArgumentException(VALUE_IS_INFINITY_REFERENCE);
            if (depth < 0)throw new ArgumentException(NEGATIVE_VALUE_REFERENCE);
        }
        /**
        <summary>
            Returns a textual with the height, width and depth of the Customized Dimensions.
        </summary>
         */
        public override string ToString()
        {
            return string.Format("Height: {0}, Width {1}, Depth {2}", height, width, depth);
        }
        /**
        <summary>
            Returns the generated hash code of the Customized Dimensions.
        </summary>
         */
        public override int GetHashCode()
        {
            int hashCode = 17;
            hashCode = (hashCode * 23) + this.height.GetHashCode();
            hashCode = (hashCode * 23) + this.width.GetHashCode();
            hashCode = (hashCode * 23) + this.depth.GetHashCode();
            return hashCode.GetHashCode();
        }
        /**
        <summary>
            Checks if a certain Customized Dimensions is the same as a received object.
        </summary>
        <param name = "obj">object to compare to the current Customized Dimensions</param>
         */
        public override bool Equals(object obj)
        {
            //Check for null and compare run-time types.
            if ((obj == null) || !this.GetType().Equals(obj.GetType()))
            {
                return false;
            }
            else
            {
                CustomizedDimensions custDimensions = (CustomizedDimensions)obj;
                return height.Equals(custDimensions.height) &&
                        width.Equals(custDimensions.width) &&
                        depth.Equals(custDimensions.depth);
            }
        }


    }
}