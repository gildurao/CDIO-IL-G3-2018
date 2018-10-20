using backend_tests.Setup;
using backend_tests.utils;
using core.dto;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Diagnostics;
using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;

namespace backend_tests.Controllers
{
    [Collection("Integration Collection")]
    [TestCaseOrderer(TestPriorityOrderer.TYPE_NAME, TestPriorityOrderer.ASSEMBLY_NAME)]
    public sealed class CustomizedProductControllerIntegrationTest : IClassFixture<TestFixture<TestStartupSQLite>>
    {

        /// <summary>
        /// String with the URI where the API Requests will be performed
        /// </summary>
        private const string CUSTOMIZED_PRODUCTS_URI = "myc/api/customizedproducts";
        /// <summary>
        /// Injected Mock Server
        /// </summary>
        private TestFixture<TestStartupSQLite> fixture;
        /// <summary>
        /// Current HTTP Client
        /// </summary>
        private HttpClient httpClient;
        /// <summary>
        /// Builds a new CustomizedProductControllerIntegrationTest with the mocked server injected by parameters
        /// </summary>
        /// <param name="fixture">Injected Mocked Server</param>
        public CustomizedProductControllerIntegrationTest(TestFixture<TestStartupSQLite> fixture)
        {
            this.fixture = fixture;
            this.httpClient = fixture.CreateClient(new WebApplicationFactoryClientOptions
            {
                AllowAutoRedirect = false,
                BaseAddress = new Uri("http://localhost:5001")
            });
        }

        /// <summary>
        /// Ensures that a customized product is created succesfuly
        /// </summary>
        [Fact, TestPriority(1)]
        public async Task<CustomizedProductDTO> ensureCustomizedProductIsCreatedSuccesfuly()
        {
            //CustomizedDimensionsDTO creation
            CustomizedDimensionsDTO customizedDimensionsDTO = new CustomizedDimensionsDTO();
            customizedDimensionsDTO.height = 200.0;
            customizedDimensionsDTO.width = 230.0;
            customizedDimensionsDTO.depth = 120.0;

            FinishDTO finishDTO = new FinishDTO();
            finishDTO.description = "MDF";

            ColorDTO colorDTO = new ColorDTO();
            colorDTO.name = "White";
            colorDTO.red = 0XFF;
            colorDTO.green = 0XFF;
            colorDTO.blue = 0XFF;
            colorDTO.alpha = 0XFF;

            //CustomizedMaterialDTO creation
            CustomizedMaterialDTO customizedMaterialDTO = new CustomizedMaterialDTO();
            customizedMaterialDTO.finish = finishDTO;
            customizedMaterialDTO.color = colorDTO;

            ProductControllerIntegrationTest productControllerTest = new ProductControllerIntegrationTest(fixture);
            ProductDTO productDTO = await productControllerTest.ensureProductIsCreatedSuccesfuly();

        
            //CustomizedProductDTO creation with the previously created dimensions and material
            CustomizedProductDTO customizedProductDTO = new CustomizedProductDTO();
            //A customized product requires a valid reference
            customizedProductDTO.reference = "#CP4445" + Guid.NewGuid().ToString("n");
            //A customized product requires a valid designation
            customizedProductDTO.designation = "Pride Closet";
            customizedProductDTO.customizedDimensionsDTO = customizedDimensionsDTO;
            customizedProductDTO.customizedMaterialDTO = customizedMaterialDTO;
            customizedProductDTO.productDTO = productDTO;


            //TODO:SLOTS
            var createCustomizedProduct=await httpClient.PostAsJsonAsync(CUSTOMIZED_PRODUCTS_URI,customizedProductDTO);
            Assert.True(createCustomizedProduct.StatusCode==HttpStatusCode.Created);
            return JsonConvert.DeserializeObject<CustomizedProductDTO>(await createCustomizedProduct.Content.ReadAsStringAsync());
        }

    }
}