using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using core.dto;
using Microsoft.EntityFrameworkCore.Infrastructure;
using support.dto;
using System.Linq;

namespace core.domain
{
    /// <summary>
    /// Represents a Catalogue Collection (list of customized products and customized product collections)
    /// </summary>
    /// <typeparam name="CatalogueCollectionDTO">DTO Type</typeparam>
    public class CatalogueCollection : DTOAble<CatalogueCollectionDTO>
    {
        ///<summary>
        ///Constant that represents the message that is presented if the Customized Products are not valid
        ///</summary>
        private const string INVALID_LIST = "The Customized Product List is not valid!";

        ///<summary>
        ///Constant that represents the message that is presented if the Customized Product Collection is not valid
        ///</summary>
        private const string INVALID_COLLECTION = "The Customized Product Collection is not valid!";

        /// <summary>
        /// CommercialCatalogue's foreign key, which is part of the CatalogueCollection's compound primary key.
        /// </summary>
        /// <value>Gets/sets the value of the CatalogueCollection's CommercialCatalogue foreign key.</value>
        public long catalogueId { get; internal set; }

        /// <summary>
        /// CustomizedProductCollection's foreign key, which is part of the CatalogueCollection's compound primary key.
        /// </summary>
        /// <value>Gets/sets the value of the CatalogueCollection's CustomizedProductCollection foreign key.</value>
        public long customizedProductCollectionId { get; internal set; }

        ///<summary>
        ///CustomizedProductCollection being added to the CommercialCatalogue.
        ///</summary>
        private CustomizedProductCollection _customizedProductCollection; //!private field used for lazy loading, do not use this for storing or fetching data
        public CustomizedProductCollection customizedProductCollection
        {
            get => LazyLoader.Load(this, ref _customizedProductCollection); protected set => _customizedProductCollection = value;
        }


        ///<summary>
        ///List of CustomizedProduct being added to the CommercialCatalogue.
        ///</summary>
        private List<CatalogueCollectionProduct> _catalogueCollectionProducts; //!private field used for lazy loading, do not use this for storing or fetching data
        public List<CatalogueCollectionProduct> catalogueCollectionProducts
        {
            get => LazyLoader.Load(this, ref _catalogueCollectionProducts); protected set => _catalogueCollectionProducts = value;
        }

        /// <summary>
        /// LazyLoader injected by the framework.
        /// </summary>
        /// <value>Private gets/sets the lazy loader</value>
        private ILazyLoader LazyLoader { get; set; }

        ///<summary>
        /// Empty constructor for ORM
        /// </summary>
        protected CatalogueCollection() { }

        /// <summary>
        /// Constructor used for injecting the LazyLoader.
        /// </summary>
        /// <param name="lazyLoader">LazyLoader being injected.</param>
        private CatalogueCollection(ILazyLoader lazyLoader)
        {
            this.LazyLoader = lazyLoader;
        }

        /// <summary>
        /// Builds a new CatalogueCollection instance with a CustomizedProductCollection.
        /// </summary>
        /// <param name="customizedProductCollection">CustomizedProductCollection being added to the CommercialCatalogue.</param>
        public CatalogueCollection(CustomizedProductCollection customizedProductCollection)
        {
            checkAttributes(customizedProductCollection);
            this.customizedProductCollection = customizedProductCollection;

            //*If no list of CustomizedProduct is specified, then assume all instances of CustomizedProduct that belong to the collection are to be added */

            this.catalogueCollectionProducts = new List<CatalogueCollectionProduct>();

            IEnumerable<CustomizedProduct> customizedProductsFromCollection = customizedProductCollection.collectionProducts.Select(cp => cp.customizedProduct);

            foreach (CustomizedProduct customizedProduct in customizedProductsFromCollection)
            {
                this.catalogueCollectionProducts.Add(new CatalogueCollectionProduct(this, customizedProduct));
            }
        }

        /// <summary>
        /// Builds a new CatologueCollection instance with a list of CustomizedProduct and a CustomizedProductCollection.
        /// </summary>
        /// <param name="customizedProductCollection">CustomizedProductCollection being added to the CommercialCatalogue.</param>
        /// <param name="customizedProducts">List containing all the instances of CustomizedProduct being added to the CommercialCatalogue.</param>
        public CatalogueCollection(CustomizedProductCollection customizedProductCollection, List<CustomizedProduct> customizedProducts)
        {
            //Please note that this constructor does not chain with the other constructor in order to avoid filling the product list and then dereferencing it
            checkAttributes(customizedProductCollection, customizedProducts);
            this.customizedProductCollection = customizedProductCollection;
            this.catalogueCollectionProducts = new List<CatalogueCollectionProduct>();

            foreach (CustomizedProduct customizedProduct in customizedProducts)
            {
                this.catalogueCollectionProducts.Add(new CatalogueCollectionProduct(this, customizedProduct));
            }
        }

        /// <summary>
        /// Checks if constructor parameters are valid.
        /// </summary>
        /// <param name="customizedProductCollection">CustomizedProductCollection being checked.</param>
        private void checkAttributes(CustomizedProductCollection customizedProductCollection)
        {
            if (customizedProductCollection == null)
            {
                throw new ArgumentException(INVALID_COLLECTION);
            }
        }

        /// <summary>
        /// Checks if constructor parameters are valid.
        /// </summary>
        /// <param name="customizedProductCollection">CustomizedProductCollection being checked.</param>
        /// <param name="customizedProducts">List of CustomizedProduct being checked.</param>
        private void checkAttributes(CustomizedProductCollection customizedProductCollection, List<CustomizedProduct> customizedProducts)
        {
            checkAttributes(customizedProductCollection);
            //TODO: check if all the specified customized products belong to the given collection
            if (customizedProducts == null || customizedProducts.Count == 0)
            {
                throw new ArgumentException(INVALID_LIST);
            }
        }

        /// <summary>
        /// toDTO method
        ///</summary>
        public CatalogueCollectionDTO toDTO()
        {
            CatalogueCollectionDTO CatalogueCollectionDTO = new CatalogueCollectionDTO();
            List<CustomizedProductDTO> customizedProductDTOs = new List<CustomizedProductDTO>();
            foreach (CatalogueCollectionProduct catalogueCollectionProduct in this.catalogueCollectionProducts)
            {
                customizedProductDTOs.Add(catalogueCollectionProduct.customizedProduct.toDTO());
            }
            CatalogueCollectionDTO.customizedProductsDTO = customizedProductDTOs;
            CatalogueCollectionDTO.catalogueId = this.catalogueId;
            CatalogueCollectionDTO.collectionId = this.customizedProductCollectionId;
            CatalogueCollectionDTO.customizedProductCollectionDTO = this.customizedProductCollection.toDTO();
            return CatalogueCollectionDTO;
        }

        ///<summary>
        ///Returns the generated hash code of the CatalogueCollection.
        ///</summary>
        public override int GetHashCode()
        {
            unchecked
            {
                int hash = 29;

                hash = hash * 31 + customizedProductCollection.GetHashCode();

                foreach (CatalogueCollectionProduct catalogueCollectionProduct in this.catalogueCollectionProducts)
                {
                    hash = hash * 47 + catalogueCollectionProduct.customizedProduct.GetHashCode();
                }

                return hash;
            }



            //return customizedProductCollection.GetHashCode() + catalogueCollectionProducts.GetHashCode();
        }

        ///<summary>
        ///Checks if a certain Customized is the same as a received object.
        ///</summary>
        ///<param name = "obj">object to compare to the current CatalogueCollection</param>
        public override bool Equals(object obj)
        {
            //Check for null and compare run-time types.
            if ((obj == null) || !this.GetType().Equals(obj.GetType()))
            {
                return false;
            }
            else
            {
                CatalogueCollection CatalogueCollection = (CatalogueCollection)obj;
                return customizedProductCollection.Equals(CatalogueCollection.customizedProductCollection) && catalogueCollectionProducts.Equals(CatalogueCollection.catalogueCollectionProducts);
            }
        }

        ///<summary>
        ///Returns a textual description of the CommercialCatalogue.
        ///</summary>
        public override string ToString()
        {
            return string.Format("List of Customized Products: {0}, Customized Product Collection {1}", catalogueCollectionProducts.ToString(), customizedProductCollection.ToString());
        }

        /*  public void addCustomizedProductToCollection(CustomizedProduct customizedProduct){
             if()
         }  */
    }
}