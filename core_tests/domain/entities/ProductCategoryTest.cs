using Xunit;
using core.domain;
using System;
using System.Reflection;
using System.Collections.Generic;

namespace core_tests.domain.entities
{
    public class ProductCategoryTest
    {

        private const string CATEGORY_FIELD_NAME = "name";

        private const string PRODUCT_FIELD_NAME = "products";

        [Fact]
        public void ensureInstanceCantBeCreatedWithEmptyName()
        {
            Action action = () => new ProductCategory("");

            Assert.Throws<ArgumentException>(action);
        }

        [Fact]
        public void ensureInstanceCantBeCreatedWithWhitespaces()
        {
            Action action = () => new ProductCategory("         ");

            Assert.Throws<ArgumentException>(action);
        }


        [Fact]
        public void ensureInstanceIsCreated()
        {
            var category = new ProductCategory("Drawers");

            Assert.NotNull(category);
        }

        [Fact]
        public void ensureChangeNameWithEmptyNameReturnsFalse()
        {
            var category = new ProductCategory("Drawers");

            bool changed = category.changeName("");

            Assert.False(changed);
        }

        [Fact]
        public void ensureChangeNameWithEmptyNameDoesNotChangeName()
        {
            string name = "Drawers";

            var category = new ProductCategory(name);

            category.changeName("");

            //Use reflection
            string currentName = (string)typeof(ProductCategory).GetField(CATEGORY_FIELD_NAME,
             BindingFlags.NonPublic | BindingFlags.Instance).GetValue(category);

            Assert.Equal(name, currentName);
        }

        [Fact]
        public void ensureChangeNameWithWhitespacesReturnsFalse()
        {
            var category = new ProductCategory("Drawers");

            Assert.False(category.changeName("         "));
        }

        [Fact]
        public void ensureChangeNameWithWhitespacesDoesNotChangeName()
        {
            string name = "Drawers";

            var category = new ProductCategory(name);

            category.changeName("           ");

            //Use reflection
            string currentName = (string)typeof(ProductCategory).GetField(CATEGORY_FIELD_NAME,
             BindingFlags.NonPublic | BindingFlags.Instance).GetValue(category);

            Assert.Equal(name, currentName);
        }

        [Fact]
        public void ensureChangeNameWithValidNameReturnsFalse()
        {
            var category = new ProductCategory("Hangers");

            Assert.True(category.changeName("Shelves"));
        }

        [Fact]
        public void ensureChangeNameWithValidNameChangesName()
        {
            var category = new ProductCategory("Drawers");

            string newName = "Coat-hangers";

            category.changeName(newName);

            //Use reflection
            string currentName = (string)typeof(ProductCategory).GetField(CATEGORY_FIELD_NAME,
             BindingFlags.NonPublic | BindingFlags.Instance).GetValue(category);

            Assert.Equal(newName, currentName);
        }


        [Fact]
        public void ensureEqualsReturnsFalseIfObjectIsNull()
        {
            ProductCategory category = new ProductCategory("Drawers");

            ProductCategory invalidCategory = null;

            Assert.False(category.Equals(invalidCategory));
        }


        [Fact]
        public void ensureEqualsReturnsFalseIfObjectIsNotCategory()
        {

            ProductCategory category = new ProductCategory("Drawers");

            var color = Color.valueOf("Blue", 0, 0, 255, 0);
            var colors = new List<Color>();
            colors.Add(color);

            var finish = Finish.valueOf("Glossy");
            var finishes = new List<Finish>();
            finishes.Add(finish);

            Material material = new Material("4342342", "MDF", colors, finishes);
            var materials = new List<Material>();
            materials.Add(material);

            Product product = new Product("11124", "Product", materials);

            Assert.False(category.Equals(product));

        }


        [Fact]
        public void ensureEqualsReturnsTrueIfSameCategoryIsUsed()
        {
            ProductCategory category = new ProductCategory("Drawers");

            Assert.True(category.Equals(category));
        }

        [Fact]
        public void ensureEqualsReturnsTrueIfCategoriesHaveSameName()
        {
            ProductCategory category = new ProductCategory("Drawers");

            ProductCategory otherCategory = new ProductCategory("drawers");

            Assert.Equal(category, otherCategory);
        }


        [Fact]
        public void ensureCategoriesWithSameNameHaveSameHashCode()
        {
            ProductCategory category = new ProductCategory("Drawers");

            int hashCode = category.GetHashCode();

            ProductCategory otherCategory = new ProductCategory("drawers");

            int otherHashCode = otherCategory.GetHashCode();

            Assert.Equal(hashCode, otherHashCode);
        }

        [Fact]
        public void ensureCategoriesWithDifferentNamesHaveDifferentHashCodes()
        {
            ProductCategory category = new ProductCategory("Drawers");

            int hashCode = category.GetHashCode();

            ProductCategory otherCategory = new ProductCategory("Shelves");

            int otherHashCode = otherCategory.GetHashCode();

            Assert.NotEqual(hashCode, otherHashCode);
        }

        [Fact]
        public void ensureIdReturnsTheCategoryName()
        {
            ProductCategory category = new ProductCategory("Drawers");

            string id = category.id();

            string expected = "Drawers";

            Assert.Equal(expected, id);
        }

        [Fact]
        public void ensureToStringWorks()
        {
            ProductCategory category = new ProductCategory("Drawers");

            string actual = category.ToString();

            string expected = "Name: " + category.id();

            Assert.Equal(expected, actual);
        }

        [Fact]
        public void ensureToDTOWorks()
        {
            var category = new ProductCategory("Shelves");

            var categoryDTO = category.toDTO().ToString();

            var otherCategory = new ProductCategory("Shelves");

            var otherCategoryDTO = otherCategory.toDTO().ToString();

            Assert.Equal(otherCategoryDTO, categoryDTO);
        }

        [Fact]
        public void ensureSameAsReturnsTrueIfIdentityIsEqual()
        {

            string identity = "Shelves";

            var category = new ProductCategory(identity);

            Assert.True(category.sameAs(identity));
        }

        [Fact]
        public void ensureSameAsReturnsFalseIfIdentityIsNotEqual()
        {
            string identity = "Shelves";

            var category = new ProductCategory(identity);

            string otherIdentity = "Drawer";

            Assert.False(category.sameAs(otherIdentity));
        }

    }
}