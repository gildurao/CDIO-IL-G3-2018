using System;
using System.Collections.Generic;
using core.domain;
using Xunit;
using static core.domain.CustomizedProduct;

namespace core_tests.domain
{
    /// <summary>
    /// Tests of the class CatalogueCollectionProduct
    /// </summary>
    public class CatalogueCollectionProductTest
    {
        [Fact]
        private void ensureArgumentExceptionIsThrownIfBothParametersAreNull()
        {
            Action action = () => new CatalogueCollectionProduct(null, null);

            Assert.Throws<ArgumentException>(action);
        }

        [Fact]
        private void ensureArgumentExceptionIsThrownIfCatalogueCollectionIsNull()
        {
            Action action = () => new CatalogueCollectionProduct(null, buildCustomizedProduct());

            Assert.Throws<ArgumentException>(action);
        }

        [Fact]
        private void ensureArgumentExceptionIsThrownIfCustomizedProductIsNull()
        {
            Action action = () => new CatalogueCollectionProduct(buildCatalogueCollection(), null);

            Assert.Throws<ArgumentException>(action);
        }

        [Fact]
        private void ensureInstanceIsCreated()
        {
            CatalogueCollectionProduct catalogueCollectionProduct = new CatalogueCollectionProduct(buildCatalogueCollection(), buildCustomizedProduct());

            Assert.NotNull(catalogueCollectionProduct);
        }


        private CatalogueCollection buildCatalogueCollection()
        {
            CustomizedProductCollection customizedProductCollection = new CustomizedProductCollection("Awesome Products");

            return new CatalogueCollection(customizedProductCollection);
        }

        private CustomizedProduct buildCustomizedProduct()
        {
            Finish finish = Finish.valueOf("Glossy", 90);
            Color color = Color.valueOf("Deep Purple", 153, 50, 204, 0);

            Material material = new Material("materialid", "Metal", "ola.jpg", new List<Color>() { color }, new List<Finish>() { finish });

            ProductCategory productCategory = new ProductCategory("Bands");

            Dimension heightDimension = new SingleValueDimension(21.0);
            Dimension depthDimension = new SingleValueDimension(15.6);
            Dimension widthDimension = new SingleValueDimension(19);

            Measurement measurement = new Measurement(heightDimension, widthDimension, depthDimension);

            List<Measurement> measurements = new List<Measurement>() { measurement };

            Product product = new Product("productid", "Awesome shelf", "awesomeshelfyo.glb", productCategory, new List<Material>() { material }, measurements);

            CustomizedMaterial customizedMaterial = CustomizedMaterial.valueOf(material, color);
            CustomizedDimensions customizedDimensions = CustomizedDimensions.valueOf(21.0, 19, 15.6);

            return CustomizedProductBuilder.createCustomizedProduct("reference", product, customizedDimensions).withMaterial(customizedMaterial).build();
        }
    }
}