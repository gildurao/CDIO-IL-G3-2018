using System;
using System.Collections.Generic;
using support.dto;
using core.domain;
using core.dto;
using Xunit;

namespace core_tests.domain
{
    /// <summary>
    /// Tests of the class CustomizedProductCollection.
    /// </summary>
    public class CustomizedProductCollectionTest
    {
        /// <summary>
        /// Test to ensure that a CustomizedProductCollection can't be created with a null list of CustomizedProducts.
        /// </summary>
        [Fact]
        public void ensureNullCustomizedProductListIsNotValid()
        {
            Assert.Throws<ArgumentException>(() => new CustomizedProductCollection("It's-a-me, Mario", null));
        }

        /// <summary>
        /// Test to ensure that a CustomizedProductCollection can't be created with an empty list of CustomizedProducts.
        /// </summary>
        [Fact]
        public void ensureEmptyCustomizedProductListIsNotValid()
        {
            Assert.Throws<ArgumentException>(() => new CustomizedProductCollection("It's-a-me, Mario", new List<CustomizedProduct>()));
        }

        /// <summary>
        /// Test to ensure that a CustomizedProductCollection can't be created with duplicated elements in the list of CustomizedProducts.
        /// </summary>
        [Fact]
        public void ensureCustomizedProductsListWithDuplicatesIsNotValid()
        {
            var category = new ProductCategory("It's-a-me again");

            //Creating Dimensions
            List<Double> values = new List<Double>();

            values.Add(500.0); //Width

            DiscreteDimensionInterval interval = new DiscreteDimensionInterval(values);

            List<Dimension> dimensions = new List<Dimension>();
            dimensions.Add(interval);

            IEnumerable<Dimension> heightValues = dimensions;
            IEnumerable<Dimension> widthValues = dimensions;
            IEnumerable<Dimension> depthValues = dimensions;

            //Creating a material
            string reference = "Just referencing";
            string designation = "Doin' my thing";

            List<Color> colors = new List<Color>();
            Color color = Color.valueOf("Goin' to church", 1, 2, 3, 0);
            colors.Add(color);

            List<Finish> finishes = new List<Finish>();
            Finish finish = Finish.valueOf("Prayin'");
            finishes.Add(finish);

            Material material = new Material(reference, designation, colors, finishes);
            List<Material> materials = new List<Material>();
            materials.Add(material);

            IEnumerable<Material> matsList = materials;

            Product product = new Product("Kinda dead", "So tired", category, matsList, heightValues, widthValues, depthValues);
            CustomizedDimensions customizedDimensions = CustomizedDimensions.valueOf(1.2, 1.5, 20.3);

            //Customized Material
            Color color1 = Color.valueOf("Burro quando foge", 1, 2, 3, 4);
            Finish finish2 = Finish.valueOf("Estragado");
            CustomizedMaterial mat = CustomizedMaterial.valueOf(color1, finish2);


            CustomizedProduct cp = new CustomizedProduct("Peach", "Luigi", mat, customizedDimensions, product);
            List<CustomizedProduct> products = new List<CustomizedProduct>();
            products.Add(cp);
            products.Add(cp);

            Assert.Throws<ArgumentException>(() => new CustomizedProductCollection("Mario", products));
        }


        /// <summary>
        /// Test to ensure that a CustomizedProductCollection can't be created with a null name.
        /// </summary>
        [Fact]
        public void ensureNullNameIsNotValid()
        {
            var category = new ProductCategory("It's-a-me again");

            //Creating Dimensions
            List<Double> values = new List<Double>();

            values.Add(500.0); //Width

            DiscreteDimensionInterval interval = new DiscreteDimensionInterval(values);

            List<Dimension> dimensions = new List<Dimension>();
            dimensions.Add(interval);

            IEnumerable<Dimension> heightValues = dimensions;
            IEnumerable<Dimension> widthValues = dimensions;
            IEnumerable<Dimension> depthValues = dimensions;

            //Creating a material
            string reference = "Just referencing";
            string designation = "Doin' my thing";

            List<Color> colors = new List<Color>();
            Color color = Color.valueOf("Goin' to church", 1, 2, 3, 0);
            colors.Add(color);

            List<Finish> finishes = new List<Finish>();
            Finish finish = Finish.valueOf("Prayin'");
            finishes.Add(finish);

            Material material = new Material(reference, designation, colors, finishes);
            List<Material> materials = new List<Material>();
            materials.Add(material);

            IEnumerable<Material> matsList = materials;

            Product product = new Product("Kinda dead", "So tired", category, matsList, heightValues, widthValues, depthValues);
            CustomizedDimensions customizedDimensions = CustomizedDimensions.valueOf(1.2, 1.5, 20.3);

            Assert.Throws<ArgumentException>(() => new CustomizedProductCollection(null));
        }

        /// <summary>
        /// Test to ensure that a CustomizedProductCollection can't be created with an empty name.
        /// </summary>
        [Fact]
        public void ensureEmptyNameIsNotValid()
        {
            var category = new ProductCategory("It's-a-me again");

            //Creating Dimensions
            List<Double> values = new List<Double>();

            values.Add(500.0); //Width

            DiscreteDimensionInterval interval = new DiscreteDimensionInterval(values);

            List<Dimension> dimensions = new List<Dimension>();
            dimensions.Add(interval);

            IEnumerable<Dimension> heightValues = dimensions;
            IEnumerable<Dimension> widthValues = dimensions;
            IEnumerable<Dimension> depthValues = dimensions;

            //Creating a material
            string reference = "Just referencing";
            string designation = "Doin' my thing";

            List<Color> colors = new List<Color>();
            Color color = Color.valueOf("Goin' to church", 1, 2, 3, 0);
            colors.Add(color);

            List<Finish> finishes = new List<Finish>();
            Finish finish = Finish.valueOf("Prayin'");
            finishes.Add(finish);

            Material material = new Material(reference, designation, colors, finishes);
            List<Material> materials = new List<Material>();
            materials.Add(material);

            IEnumerable<Material> matsList = materials;

            Product product = new Product("Kinda dead", "So tired", category, matsList, heightValues, widthValues, depthValues);
            CustomizedDimensions customizedDimensions = CustomizedDimensions.valueOf(1.2, 1.5, 20.3);

            Assert.Throws<ArgumentException>(() => new CustomizedProductCollection(""));
        }

        /// <summary>
        /// Test to ensure that a CustomizedProductCollection's name can be changed if the string is valid.
        /// </summary>
        [Fact]
        public void ensureValidNameCanBeChanged()
        {
            Assert.True(new CustomizedProductCollection("Luigi").changeName("Mario"));
        }

        /// <summary>
        /// Test to ensure that a CustomizedProductCollection's name can't be changed if the string is empty.
        /// </summary>
        [Fact]
        public void ensureEmptyNameCantBeChanged()
        {
            Assert.False(new CustomizedProductCollection("'Shroom").changeName(""));
        }

        /// <summary>
        /// Test to ensure that a CustomizedProductCollection's name can't be changed if the string is null.
        /// </summary>
        [Fact]
        public void ensureNullNameCantBeChanged()
        {
            Assert.False(new CustomizedProductCollection("Peach").changeName(null));
        }

        /// <summary>
        /// Test to ensure that a CustomizedProductCollection is the same as another entity's identity if it is the same.
        /// </summary>
        [Fact]
        public void ensureSameAsWorksForEqualCustomizedProductCollections()
        {
            Assert.True(new CustomizedProductCollection("Luigi").sameAs("Luigi"));
        }


        /// <summary>
        /// Test to ensure that the DTO is the expected.
        /// </summary>
        [Fact]
        public void ensureToDtoIsTheExpected()
        {
            var collection = new CustomizedProductCollection("Mario");
            var collectionDTO = new CustomizedProductCollectionDTO();
            collectionDTO.name = "Mario";
            collectionDTO.customizedProducts = new List<CustomizedProductDTO>(DTOUtils.parseToDTOS(collection.customizedProducts));

            Assert.Equal(collectionDTO.name, collection.toDTO().name);
            Assert.Equal(collectionDTO.id, collection.toDTO().id);
            Assert.Equal(collectionDTO.customizedProducts, collection.toDTO().customizedProducts);
        }

        /// <summary>
        /// Test to ensure that a CustomizedProductCollection is not the same as another entity's identity if it is different.
        /// </summary>
        [Fact]
        public void ensureSameAsFailsForDifferentCustomizedProductCollections()
        {
            Assert.False(new CustomizedProductCollection("Luigi").sameAs("Mario"));
        }

        /// <summary>
        /// Test to ensure that a valid CustomizedProduct can be added to the list.
        /// </summary>
        [Fact]
        public void ensureAddCustomizedProductWorksForValidProduct()
        {

            var category = new ProductCategory("It's-a-me again");

            //Creating Dimensions
            List<Double> values = new List<Double>();

            values.Add(500.0); //Width

            DiscreteDimensionInterval interval = new DiscreteDimensionInterval(values);

            List<Dimension> dimensions = new List<Dimension>();
            dimensions.Add(interval);

            IEnumerable<Dimension> heightValues = dimensions;
            IEnumerable<Dimension> widthValues = dimensions;
            IEnumerable<Dimension> depthValues = dimensions;

            //Creating a material
            string reference = "Just referencing";
            string designation = "Doin' my thing";

            List<Color> colors = new List<Color>();
            Color color = Color.valueOf("Goin' to church", 1, 2, 3, 0);
            colors.Add(color);

            List<Finish> finishes = new List<Finish>();
            Finish finish = Finish.valueOf("Prayin'");
            finishes.Add(finish);

            Material material = new Material(reference, designation, colors, finishes);
            List<Material> materials = new List<Material>();
            materials.Add(material);

            IEnumerable<Material> matsList = materials;

            Product product = new Product("Kinda dead", "So tired", category, matsList, heightValues, widthValues, depthValues);
            CustomizedDimensions customizedDimensions = CustomizedDimensions.valueOf(1.2, 1.5, 20.3);

            //Customized Material
            Color color1 = Color.valueOf("Burro quando foge", 1, 2, 3, 4);
            Finish finish2 = Finish.valueOf("Estragado");
            CustomizedMaterial mat = CustomizedMaterial.valueOf(color1, finish2);


            Assert.True(new CustomizedProductCollection("Mario").addCustomizedProduct(
                new CustomizedProduct("Peach", "Luigi", mat, customizedDimensions, product)));
        }

        /// <summary>
        /// Test to ensure that a CustomizedProduct can't be added to the list if it already exists.
        /// </summary>
        [Fact]
        public void ensureAddCustomizedProductFailsIfItAlreadyExists()
        {
            var category = new ProductCategory("It's-a-me again");

            //Creating Dimensions
            List<Double> values = new List<Double>();

            values.Add(500.0); //Width

            DiscreteDimensionInterval interval = new DiscreteDimensionInterval(values);

            List<Dimension> dimensions = new List<Dimension>();
            dimensions.Add(interval);

            IEnumerable<Dimension> heightValues = dimensions;
            IEnumerable<Dimension> widthValues = dimensions;
            IEnumerable<Dimension> depthValues = dimensions;

            //Creating a material
            string reference = "Just referencing";
            string designation = "Doin' my thing";

            List<Color> colors = new List<Color>();
            Color color = Color.valueOf("Goin' to church", 1, 2, 3, 0);
            colors.Add(color);

            List<Finish> finishes = new List<Finish>();
            Finish finish = Finish.valueOf("Prayin'");
            finishes.Add(finish);

            Material material = new Material(reference, designation, colors, finishes);
            List<Material> materials = new List<Material>();
            materials.Add(material);

            IEnumerable<Material> matsList = materials;

            Product product = new Product("Kinda dead", "So tired", category, matsList, heightValues, widthValues, depthValues);
            CustomizedDimensions customizedDimensions = CustomizedDimensions.valueOf(1.2, 1.5, 20.3);

            //Customized Material
            Color color1 = Color.valueOf("Burro quando foge", 1, 2, 3, 4);
            Finish finish2 = Finish.valueOf("Estragado");
            CustomizedMaterial mat = CustomizedMaterial.valueOf(color1, finish2);

            CustomizedProduct customizedProduct = new CustomizedProduct("Peach", "Luigi", mat, customizedDimensions, product);
            List<CustomizedProduct> list = new List<CustomizedProduct>();
            list.Add(customizedProduct);

            Assert.False(new CustomizedProductCollection("Mario", list).addCustomizedProduct(customizedProduct));
        }

        /// <summary>
        /// Test to ensure that a null CustomizedProduct can't be added to the list.
        /// </summary>
        [Fact]
        public void ensureAddCustomizedProductFailsIfItIsNull()
        {
            Assert.False(new CustomizedProductCollection("Mario").addCustomizedProduct(null));
        }


        /// <summary>
        /// Test to ensure that a CustomizedProduct can be removed from the list.
        /// </summary>
        [Fact]
        public void ensureRemovedCustomizedProductWorksForAlreadyExistentProduct()
        {

            var category = new ProductCategory("It's-a-me again");

            //Creating Dimensions
            List<Double> values = new List<Double>();

            values.Add(500.0); //Width

            DiscreteDimensionInterval interval = new DiscreteDimensionInterval(values);

            List<Dimension> dimensions = new List<Dimension>();
            dimensions.Add(interval);

            IEnumerable<Dimension> heightValues = dimensions;
            IEnumerable<Dimension> widthValues = dimensions;
            IEnumerable<Dimension> depthValues = dimensions;

            //Creating a material
            string reference = "Just referencing";
            string designation = "Doin' my thing";

            List<Color> colors = new List<Color>();
            Color color = Color.valueOf("Goin' to church", 1, 2, 3, 0);
            colors.Add(color);

            List<Finish> finishes = new List<Finish>();
            Finish finish = Finish.valueOf("Prayin'");
            finishes.Add(finish);

            Material material = new Material(reference, designation, colors, finishes);
            List<Material> materials = new List<Material>();
            materials.Add(material);

            IEnumerable<Material> matsList = materials;

            Product product = new Product("Kinda dead", "So tired", category, matsList, heightValues, widthValues, depthValues);
            CustomizedDimensions customizedDimensions = CustomizedDimensions.valueOf(1.2, 1.5, 20.3);

            //Customized Material
            Color color1 = Color.valueOf("Burro quando foge", 1, 2, 3, 4);
            Finish finish2 = Finish.valueOf("Estragado");
            CustomizedMaterial mat = CustomizedMaterial.valueOf(color1, finish2);

            CustomizedProduct cp = new CustomizedProduct("Peach", "Luigi", mat, customizedDimensions, product);
            List<CustomizedProduct> list = new List<CustomizedProduct>();
            list.Add(cp);

            Assert.True(new CustomizedProductCollection("Mario", list).removeCustomizedProduct(cp));
        }

        /// <summary>
        /// Test to ensure that the id of the CustomizedProductCollection is the expected.
        /// </summary>
        [Fact]
        public void ensureIdMethodWorks()
        {
            Assert.Equal("Mario", new CustomizedProductCollection("Mario").id());
        }

        /// <summary>
        /// Test to ensure that an already disabled CustomizedProductCollection can't be disabled.
        /// </summary>
        [Fact]
        public void ensureDisabledCustomizedProductCollectionCantBeDisabled()
        {
            CustomizedProductCollection collection = new CustomizedProductCollection("Mario");
            collection.disable();

            Assert.False(collection.disable());
        }
        /// <summary>
        /// Test to ensure that an enabled CustomizedProductCollection can be disabled.
        /// </summary>
        [Fact]
        public void ensureEnabledCustomizedProductCollectionCanBeDisabled()
        {
            Assert.True(new CustomizedProductCollection("Mario").disable());
        }

        /// <summary>
        /// Test to ensure that different CustomizedProductCollections are not equal.
        /// </summary>
        [Fact]
        public void ensureNotEqualCustomizedProductCollectionsAreNotEqual()
        {
            var category = new ProductCategory("It's-a-me again");

            //Creating Dimensions
            List<Double> values = new List<Double>();

            values.Add(500.0); //Width

            DiscreteDimensionInterval interval = new DiscreteDimensionInterval(values);

            List<Dimension> dimensions = new List<Dimension>();
            dimensions.Add(interval);

            IEnumerable<Dimension> heightValues = dimensions;
            IEnumerable<Dimension> widthValues = dimensions;
            IEnumerable<Dimension> depthValues = dimensions;

            //Creating a material
            string reference = "Just referencing";
            string designation = "Doin' my thing";

            List<Color> colors = new List<Color>();
            Color color = Color.valueOf("Goin' to church", 1, 2, 3, 0);
            colors.Add(color);

            List<Finish> finishes = new List<Finish>();
            Finish finish = Finish.valueOf("Prayin'");
            finishes.Add(finish);

            Material material = new Material(reference, designation, colors, finishes);
            List<Material> materials = new List<Material>();
            materials.Add(material);

            IEnumerable<Material> matsList = materials;

            Product product = new Product("Kinda dead", "So tired", category, matsList, heightValues, widthValues, depthValues);
            CustomizedDimensions customizedDimensions = CustomizedDimensions.valueOf(1.2, 1.5, 20.3);

            //Customized Material
            Color color1 = Color.valueOf("Burro quando foge", 1, 2, 3, 4);
            Finish finish2 = Finish.valueOf("Estragado");
            CustomizedMaterial mat = CustomizedMaterial.valueOf(color1, finish2);


            CustomizedProduct cp = new CustomizedProduct("Mushrooms", "Are deadly", mat, customizedDimensions, product);
            List<CustomizedProduct> products = new List<CustomizedProduct>();
            products.Add(cp);

            Assert.NotEqual(new CustomizedProductCollection("Mario", products), new CustomizedProductCollection("Luigi", products));
        }


        /// <summary>
        /// Test to ensure that two equal CustomizedProductCollections are equal.
        /// </summary>
        [Fact]
        public void ensureEqualCustomizedProductCollectionsAreEqual()
        {
            var category = new ProductCategory("It's-a-me again");

            //Creating Dimensions
            List<Double> values = new List<Double>();

            values.Add(500.0); //Width

            DiscreteDimensionInterval interval = new DiscreteDimensionInterval(values);

            List<Dimension> dimensions = new List<Dimension>();
            dimensions.Add(interval);

            IEnumerable<Dimension> heightValues = dimensions;
            IEnumerable<Dimension> widthValues = dimensions;
            IEnumerable<Dimension> depthValues = dimensions;

            //Creating a material
            string reference = "Just referencing";
            string designation = "Doin' my thing";

            List<Color> colors = new List<Color>();
            Color color = Color.valueOf("Goin' to church", 1, 2, 3, 0);
            colors.Add(color);

            List<Finish> finishes = new List<Finish>();
            Finish finish = Finish.valueOf("Prayin'");
            finishes.Add(finish);

            Material material = new Material(reference, designation, colors, finishes);
            List<Material> materials = new List<Material>();
            materials.Add(material);

            IEnumerable<Material> matsList = materials;

            Product product = new Product("Kinda dead", "So tired", category, matsList, heightValues, widthValues, depthValues);
            CustomizedDimensions customizedDimensions = CustomizedDimensions.valueOf(1.2, 1.5, 20.3);

            //Customized Material
            Color color1 = Color.valueOf("Burro quando foge", 1, 2, 3, 4);
            Finish finish2 = Finish.valueOf("Estragado");
            CustomizedMaterial mat = CustomizedMaterial.valueOf(color1, finish2);


            CustomizedProduct cp = new CustomizedProduct("Peach", "Luigi", mat, customizedDimensions, product);
            List<CustomizedProduct> products = new List<CustomizedProduct>();
            products.Add(cp);

            Assert.Equal(new CustomizedProductCollection("Mario", products), new CustomizedProductCollection("Mario", products));
        }

        /// <summary>
        /// Test to ensure that a different type object is not the same as a CustomizedProductCollection.
        /// </summary>
        [Fact]
        public void ensureDifferentTypeObjectIsNotEqualToCustomizedProductCollection()
        {
            var category = new ProductCategory("It's-a-me again");

            //Creating Dimensions
            List<Double> values = new List<Double>();

            values.Add(500.0); //Width

            DiscreteDimensionInterval interval = new DiscreteDimensionInterval(values);

            List<Dimension> dimensions = new List<Dimension>();
            dimensions.Add(interval);

            IEnumerable<Dimension> heightValues = dimensions;
            IEnumerable<Dimension> widthValues = dimensions;
            IEnumerable<Dimension> depthValues = dimensions;

            //Creating a material
            string reference = "Just referencing";
            string designation = "Doin' my thing";

            List<Color> colors = new List<Color>();
            Color color = Color.valueOf("Goin' to church", 1, 2, 3, 0);
            colors.Add(color);

            List<Finish> finishes = new List<Finish>();
            Finish finish = Finish.valueOf("Prayin'");
            finishes.Add(finish);

            Material material = new Material(reference, designation, colors, finishes);
            List<Material> materials = new List<Material>();
            materials.Add(material);

            IEnumerable<Material> matsList = materials;

            Product product = new Product("Kinda dead", "So tired", category, matsList, heightValues, widthValues, depthValues);
            CustomizedDimensions customizedDimensions = CustomizedDimensions.valueOf(1.2, 1.5, 20.3);

            //Customized Material
            Color color1 = Color.valueOf("Burro quando foge", 1, 2, 3, 4);
            Finish finish2 = Finish.valueOf("Estragado");
            CustomizedMaterial mat = CustomizedMaterial.valueOf(color1, finish2);


            CustomizedProduct cp = new CustomizedProduct("Luigi", "Peach", mat, customizedDimensions, product);
            List<CustomizedProduct> products = new List<CustomizedProduct>();
            products.Add(cp);

            Assert.False(new CustomizedProductCollection("Mario", products).Equals("Something"));
        }

        /// <summary>
        /// Test to ensure that a null object is not the same as a CustomizedProductCollection.
        /// </summary>
        [Fact]
        public void ensureNullObjectIsNotEqualToCustomizedProductCollection()
        {
            var category = new ProductCategory("It's-a-me again");

            //Creating Dimensions
            List<Double> values = new List<Double>();

            values.Add(500.0); //Width

            DiscreteDimensionInterval interval = new DiscreteDimensionInterval(values);

            List<Dimension> dimensions = new List<Dimension>();
            dimensions.Add(interval);

            IEnumerable<Dimension> heightValues = dimensions;
            IEnumerable<Dimension> widthValues = dimensions;
            IEnumerable<Dimension> depthValues = dimensions;

            //Creating a material
            string reference = "Just referencing";
            string designation = "Doin' my thing";

            List<Color> colors = new List<Color>();
            Color color = Color.valueOf("Goin' to church", 1, 2, 3, 0);
            colors.Add(color);

            List<Finish> finishes = new List<Finish>();
            Finish finish = Finish.valueOf("Prayin'");
            finishes.Add(finish);

            Material material = new Material(reference, designation, colors, finishes);
            List<Material> materials = new List<Material>();
            materials.Add(material);

            IEnumerable<Material> matsList = materials;

            Product product = new Product("Kinda dead", "So tired", category, matsList, heightValues, widthValues, depthValues);
            CustomizedDimensions customizedDimensions = CustomizedDimensions.valueOf(1.2, 1.5, 20.3);

            //Customized Material
            Color color1 = Color.valueOf("Burro quando foge", 1, 2, 3, 4);
            Finish finish2 = Finish.valueOf("Estragado");
            CustomizedMaterial mat = CustomizedMaterial.valueOf(color1, finish2);


            CustomizedProduct cp = new CustomizedProduct("Mushrooms", "Are deadly", mat, customizedDimensions, product);
            List<CustomizedProduct> products = new List<CustomizedProduct>();
            products.Add(cp);

            Assert.False(new CustomizedProductCollection("Mario", products).Equals(null));
        }

        /// <summary>
        /// Test to ensure that the generated hash code is the same for equal CustomizedProductCollections.
        /// </summary>
        [Fact]
        public void ensureHashCodeWorks()
        {
            var category = new ProductCategory("It's-a-me again");

            //Creating Dimensions
            List<Double> values = new List<Double>();

            values.Add(500.0); //Width

            DiscreteDimensionInterval interval = new DiscreteDimensionInterval(values);

            List<Dimension> dimensions = new List<Dimension>();
            dimensions.Add(interval);

            IEnumerable<Dimension> heightValues = dimensions;
            IEnumerable<Dimension> widthValues = dimensions;
            IEnumerable<Dimension> depthValues = dimensions;

            //Creating a material
            string reference = "Just referencing";
            string designation = "Doin' my thing";

            List<Color> colors = new List<Color>();
            Color color = Color.valueOf("Goin' to church", 1, 2, 3, 0);
            colors.Add(color);

            List<Finish> finishes = new List<Finish>();
            Finish finish = Finish.valueOf("Prayin'");
            finishes.Add(finish);

            Material material = new Material(reference, designation, colors, finishes);
            List<Material> materials = new List<Material>();
            materials.Add(material);

            IEnumerable<Material> matsList = materials;

            Product product = new Product("Kinda dead", "So tired", category, matsList, heightValues, widthValues, depthValues);
            CustomizedDimensions customizedDimensions = CustomizedDimensions.valueOf(1.2, 1.5, 20.3);

            //Customized Material
            Color color1 = Color.valueOf("Burro quando foge", 1, 2, 3, 4);
            Finish finish2 = Finish.valueOf("Estragado");
            CustomizedMaterial mat = CustomizedMaterial.valueOf(color1, finish2);


            CustomizedProduct cp = new CustomizedProduct("Peach", "Luigi", mat, customizedDimensions, product);
            List<CustomizedProduct> products = new List<CustomizedProduct>();
            products.Add(cp);

            Assert.Equal(new CustomizedProductCollection("Mario", products).GetHashCode(),
            new CustomizedProductCollection("Mario", products).GetHashCode());
        }

        /// <summary>
        /// Test to ensure that the string that describes the CustomizedProductCollection is the same for equal CustomizedProductCollections.
        /// </summary>
        [Fact]
        public void ensureToStringWorks()
        {
            var category = new ProductCategory("It's-a-me again");

            //Creating Dimensions
            List<Double> values = new List<Double>();

            values.Add(500.0); //Width

            DiscreteDimensionInterval interval = new DiscreteDimensionInterval(values);

            List<Dimension> dimensions = new List<Dimension>();
            dimensions.Add(interval);

            IEnumerable<Dimension> heightValues = dimensions;
            IEnumerable<Dimension> widthValues = dimensions;
            IEnumerable<Dimension> depthValues = dimensions;

            //Creating a material
            string reference = "Just referencing";
            string designation = "Doin' my thing";

            List<Color> colors = new List<Color>();
            Color color = Color.valueOf("Goin' to church", 1, 2, 3, 0);
            colors.Add(color);

            List<Finish> finishes = new List<Finish>();
            Finish finish = Finish.valueOf("Prayin'");
            finishes.Add(finish);

            Material material = new Material(reference, designation, colors, finishes);
            List<Material> materials = new List<Material>();
            materials.Add(material);

            IEnumerable<Material> matsList = materials;

            Product product = new Product("Kinda dead", "So tired", category, matsList, heightValues, widthValues, depthValues);
            CustomizedDimensions customizedDimensions = CustomizedDimensions.valueOf(1.2, 1.5, 20.3);

            //Customized Material
            Color color1 = Color.valueOf("Burro quando foge", 1, 2, 3, 4);
            Finish finish2 = Finish.valueOf("Estragado");
            CustomizedMaterial mat = CustomizedMaterial.valueOf(color1, finish2);


            CustomizedProduct cp = new CustomizedProduct("Peach", "Luigi", mat, customizedDimensions, product);
            List<CustomizedProduct> products = new List<CustomizedProduct>();
            products.Add(cp);

            Assert.Equal(new CustomizedProductCollection("Mario", products).ToString(),
            new CustomizedProductCollection("Mario", products).ToString());
        }
    }
}