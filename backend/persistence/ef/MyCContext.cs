using Microsoft.EntityFrameworkCore;
using core.domain;
using backend.config;
using System.Linq;

namespace backend.persistence.ef
{
    /// <summary>
    /// Class representing the MakeYourCloset application database.
    /// </summary>
    public class MyCContext : DbContext
    {
        /// <summary>
        /// Database set containing all of the saved instances of CommercialCatalogue.
        /// </summary>
        /// <value>Gets/sets the database set containing all the saved instances of CommercialCatalogue.</value>
        public DbSet<CommercialCatalogue> CommercialCatalogue { get; set; }

        /// <summary>
        /// Database set containing all of the saved instances of Material.
        /// </summary>
        /// <value>Gets/sets the database set containing all the saved instances of Material.</value>
        public DbSet<Material> Material { get; set; }

        /// <summary>
        /// Database set containing all of the saved instances of Product.
        /// </summary>
        /// <value>Gets/sets the database set containing all the saved instances of Product.</value>
        public DbSet<Product> Product { get; set; }

        /// <summary>
        /// Database set containing all of the saved instances of ProductCategory.
        /// </summary>
        /// <value>Gets/sets the database set containing all the saved instances of ProductCategory.</value>
        public DbSet<ProductCategory> ProductCategory { get; set; }

        /// <summary>
        /// Database set containing all of the saved instances of CustomizedProduct.
        /// </summary>
        /// <value>Gets/sets the database set containing all the saved instances of CustomizedProduct.</value>
        public DbSet<CustomizedProductCollection> CustomizedProduct { get; set; }

        /// <summary>
        /// Database set containing all of the saved instances of CustomizedProductCollection.
        /// </summary>
        /// <value>Gets/sets the database set containing all the saved instances of CustomizedProductCollection.</value>
        public DbSet<CustomizedProductCollection> CustomizedProductCollection { get; set; }
        

        /// <summary>
        /// Constructs a new database for the MakeYourCloset application.
        /// </summary>
        /// <param name="options">The options for the context.</param>
        /// <returns>New instance of MyCContext.</returns>
        public MyCContext(DbContextOptions<MyCContext> options) : base(options) { BackendConfiguration.entityFrameworkContext = this; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //!Define How Entities Are Mapped Here
            //Dimension inheritance mapping
            builder.Entity<ContinuousDimensionInterval>().HasBaseType<Dimension>();
            builder.Entity<DiscreteDimensionInterval>().HasBaseType<Dimension>();
            builder.Entity<SingleValueDimension>().HasBaseType<Dimension>();

            //TODO: improve restriction mapping, since it currently has columns for various entity ids
            //builder.Entity<Dimension>().HasMany(d => d.restrictions);           //one-to-many relationship

            builder.Entity<DiscreteDimensionInterval>().HasMany(i => i.values); //one-to-many relationship

            //Configure one-to-one relationship between parent and child ProductCategory
            //*Change to many-to-one??? */
            builder.Entity<ProductCategory>().HasOne(c => c.parent).WithOne().HasForeignKey<ProductCategory>(c => c.parentId);

            builder.Entity<Material>().HasMany(m => m.Colors);                  //one-to-many relationship
            builder.Entity<Material>().HasMany(m => m.Finishes);                //one-to-many relationship

            //Configure many-to-many relationship between Product and Material
            builder.Entity<ProductMaterial>().HasOne(m =>m.material).WithMany();
            builder.Entity<Product>().HasMany(p => p.productMaterials).WithOne(pm =>pm.product);

            builder.Entity<Product>().HasOne(p => p.productCategory);           //many-to-one relationship
            builder.Entity<Product>().HasMany(p => p.depthValues);              //one-to-many relationship
            builder.Entity<Product>().HasMany(p => p.widthValues);              //one-to-many relationship
            builder.Entity<Product>().HasMany(p => p.heightValues);             //one-to-many relationship
            builder.Entity<Product>().OwnsOne(p => p.minSlotSize);              //embedded Dimensions
            builder.Entity<Product>().OwnsOne(p => p.maxSlotSize);              //embedded Dimensions
            builder.Entity<Product>().OwnsOne(p => p.recommendedSlotSize);      //embedded Dimensions

            builder.Entity<Component>().HasKey(c => new {c.fatherProductId, c.complementedProductId});

            builder.Entity<Component>().HasOne(c => c.fatherProduct).WithMany(p => p.complementedProducts).HasForeignKey(cp => cp.fatherProductId);
            //builder.Entity<Component>().HasOne(c => c.complementedProduct).WithMany(p => p.complementedProducts).HasForeignKey(cp => cp.complementedProductId);

            builder.Entity<CustomizedProduct>().HasOne(cp => cp.product);       //one-to-one relationship
            builder.Entity<CustomizedProduct>().OwnsOne(cp => cp.customizedDimensions); //embedded Dimensions
            builder.Entity<CustomizedProduct>().OwnsOne(cp => cp.customizedMaterial);   //embedded CustomizedMaterial
            builder.Entity<CustomizedProduct>().HasMany(cp => cp.slots);        //one-to-many relationship

            //!Slots have many customized products and a customized product has many slots
            //TODO: Create a relational class

            builder.Entity<Slot>().OwnsOne(s => s.slotDimensions);              //embedded Dimensions
            builder.Entity<Slot>().HasMany(s => s.customizedProducts);          //one-to-many relationship

            builder.Entity<CommercialCatalogue>().HasMany(c => c.collectionList); //one-to-many relationship
            
            builder.Entity<CatalogueCollection>().HasMany(c => c.customizedProduct);
            builder.Entity<CatalogueCollection>().HasOne(c => c.customizedProductCollection);   //one-to-one relationship
        }
    }
}