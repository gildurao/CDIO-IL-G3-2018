﻿using core.dto;
using Microsoft.EntityFrameworkCore.Infrastructure;
using support.dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace core.domain
{
    /// <summary>
    /// Represents the relation between a Product and a Material
    /// </summary>
    public class ProductMaterial : DTOAble<ProductMaterialDTO>
    {
        /// <summary>
        /// Long property with the persistence iD
        /// </summary>
        public long Id { get; private set; }

        /// <summary>
        /// Material
        /// </summary>
        /// 
        private Material _material;//!private field used for lazy loading, do not use this for storing or fetching data
        public virtual Material material { get => LazyLoader.Load(this, ref _material); set => _material = value; }

        /// <summary>
        /// List of restrictions in this relation
        /// </summary>
        private List<Restriction> _restrictions;//!private field used for lazy loading, do not use this for storing or fetching data
        public virtual List<Restriction> restrictions { get => LazyLoader.Load(this, ref _restrictions); set => _restrictions = value; }

        /// <summary>
        /// Product
        /// </summary>
        private Product _product;//!private field used for lazy loading, do not use this for storing or fetching data
        public virtual Product product { get => LazyLoader.Load(this, ref _product); set => _product = value; }

        /// <summary>
        /// LazyLoader injected by the framework.
        /// </summary>
        /// <value>Private Gets/Sets the LazyLoader.</value>
        private ILazyLoader LazyLoader { get; set; }

        /// <summary>
        /// Protected constructor in order to allow ORM mapping
        /// </summary>
        protected ProductMaterial() { }

        /// <summary>
        /// Constructor used for injecting the LazyLoader.
        /// </summary>
        /// <param name="lazyLoader">LazyLoader being injected.</param>
        private ProductMaterial(ILazyLoader lazyLoader)
        {
            this.LazyLoader = lazyLoader;
        }

        /// <summary>
        /// Creates a new instance of ProductMaterial from the data received as parameter
        /// </summary>
        /// <param name="product">Product instance in the new relation</param>
        /// <param name="material">Material instance in the new relation</param>
        public ProductMaterial(Product product, Material material)
        {
            this.product = product;
            this.material = material;
            restrictions = new List<Restriction>();
        }

        /// <summary>
        /// Creates a new instance of ProductMaterial from the data received as parameter
        /// </summary>
        /// <param name="material">Material instance in the new relation</param>
        /// <param name="restrictions">List of restrictions in the new relation</param>
        /// <param name="product">Product instance in the new relation</param>
        public ProductMaterial(Product product, Material material, List<Restriction> restrictions)
        {
            this.material = material;
            this.restrictions = restrictions;
            this.product = product;
        }

        /// <summary>
        /// Adds a restriction to the list of restrictions
        /// </summary>
        /// <param name="restriction">Restriction to be added</param>
        /// <returns>true if the Restriction was successfully added, false if not</returns>
        public bool addRestriction(Restriction restriction)
        {
            if (restriction == null || restrictionExists(restriction))
            {
                return false;
            }
            restrictions.Add(restriction);
            return true;
        }

        /// <summary>
        /// Checks if a Restriction exists in the list of restrictions
        /// </summary>
        /// <param name="restriction">Restriction to check</param>
        /// <returns>true if the list contains the Restriction, false if not</returns>
        public bool restrictionExists(Restriction restriction)
        {
            return restrictions.Contains(restriction);
        }

        /// <summary>
        /// Removes a Restriction from the list
        /// </summary>
        /// <param name="restriction">Restriction to be removed</param>
        /// <returns>true if the Restriction was removed, false if not</returns>
        public bool removeRestriction(Restriction restriction)
        {
            if (restriction != null && restrictionExists(restriction))
            {
                restrictions.Remove(restriction);
                return true;
            }
            return false;
        }

        /// <summary>
        /// Checks if this relation has a Material
        /// </summary>
        /// <param name="material">Material to be checked for</param>
        /// <returns>true if this relation is about the Material, false if not</returns>
        public bool hasMaterial(Material material)
        {
            return this.material.Equals(material);
        }

        /// <summary>
        /// Returns the current ProductMaterial as a DTO
        /// </summary>
        /// <returns>DTO with the representation of the current ProductMaterial</returns>
        public ProductMaterialDTO toDTO()
        {
            ProductMaterialDTO dto = new ProductMaterialDTO();
            dto.id = this.Id;
            dto.material = this.material.toDTO();
            dto.product = this.product.toDTO(); ;
            List<RestrictionDTO> restList = new List<RestrictionDTO>();
            foreach (Restriction rest in this.restrictions)
            {
                restList.Add(rest.toDTO());
            }
            dto.restrictions = restList;
            return dto;
        }
    }
}
