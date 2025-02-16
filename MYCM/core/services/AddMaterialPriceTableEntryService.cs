using core.modelview.pricetableentries;
using core.persistence;
using core.dto;
using core.domain;
using NodaTime;
using NodaTime.Text;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http;
using core.exceptions;
using core.modelview.pricetable;
using System.Collections.Generic;

namespace core.services
{
    /// <summary>
    /// Service that helps in transforming an AddMaterialPriceTableEntry into a MaterialPriceTableEntry and saving it to the database
    /// </summary>
    public static class AddMaterialPriceTableEntryService
    {
        /// <summary>
        /// Message that occurs if the requested material for the price table entry isn't found
        /// </summary>
        private const string MATERIAL_NOT_FOUND = "Requested material wasn't found";

        /// <summary>
        /// Message that occurs if one of the dates of the time period doesn't follow the General ISO format
        /// </summary>
        private const string DATES_WRONG_FORMAT = "Make sure all dates follow the General ISO Format: ";

        /// <summary>
        /// Message that occurs if the price table entry isn't created
        /// </summary>
        private const string PRICE_TABLE_ENTRY_NOT_CREATED = "A price table entry for the requested material with the same values already exists. Please try again";

        /// <summary>
        /// Message that occurs if the price table entry's time period contains past dates
        /// </summary>
        private const string PAST_DATE = "Can't create time periods with past dates!";

        /// <summary>
        /// Transforms an AddMaterialPriceTableEntry into a MaterialPriceTableEntry and saves it to the database
        /// </summary>
        /// <param name="modelView">material price table entry to transform and persist</param>
        /// <returns>created instance or null in case the creation wasn't successfull</returns>
        public static GetMaterialPriceModelView create(AddPriceTableEntryModelView modelView, IHttpClientFactory clientFactory)
        {
            string defaultCurrency = CurrencyPerAreaConversionService.getBaseCurrency();
            string defaultArea = CurrencyPerAreaConversionService.getBaseArea();
            long materialId = modelView.entityId;

            Material material = PersistenceContext.repositories().createMaterialRepository().find(materialId);

            if (material == null)
            {
                throw new ResourceNotFoundException(MATERIAL_NOT_FOUND);
            }

            string startingDateAsString = modelView.priceTableEntry.startingDate;
            string endingDateAsString = modelView.priceTableEntry.endingDate;

            LocalDateTime startingDate;
            LocalDateTime endingDate;
            LocalDateTime currentTime = NodaTime.LocalDateTime.FromDateTime(SystemClock.Instance.GetCurrentInstant().ToDateTimeUtc());

            try
            {
                startingDate = LocalDateTimePattern.GeneralIso.Parse(startingDateAsString).GetValueOrThrow();

                if (startingDate.CompareTo(currentTime) < 0)
                {
                    throw new InvalidOperationException(PAST_DATE);
                }
            }
            catch (UnparsableValueException)
            {
                throw new UnparsableValueException(DATES_WRONG_FORMAT + LocalDateTimePattern.GeneralIso.PatternText);
            }

            TimePeriod timePeriod = null;

            if (endingDateAsString != null)
            {
                try
                {
                    endingDate = LocalDateTimePattern.GeneralIso.Parse(endingDateAsString).GetValueOrThrow();

                    if (endingDate.CompareTo(currentTime) < 0)
                    {
                        throw new InvalidOperationException(PAST_DATE);
                    }

                    timePeriod = TimePeriod.valueOf(startingDate, endingDate);
                }
                catch (UnparsableValueException)
                {
                    throw new UnparsableValueException(DATES_WRONG_FORMAT + LocalDateTimePattern.GeneralIso.PatternText);
                }
            }
            else
            {
                timePeriod = TimePeriod.valueOf(startingDate);
            }

            CurrenciesService.checkCurrencySupport(modelView.priceTableEntry.price.currency);
            AreasService.checkAreaSupport(modelView.priceTableEntry.price.area);

            Price price = null;
            try
            {
                if (defaultCurrency.Equals(modelView.priceTableEntry.price.currency) && defaultArea.Equals(modelView.priceTableEntry.price.area))
                {
                    price = Price.valueOf(modelView.priceTableEntry.price.value);
                }
                else
                {
                    Task<double> convertedValueTask = new CurrencyPerAreaConversionService(clientFactory)
                                                    .convertCurrencyPerAreaToDefaultCurrencyPerArea(
                                                        modelView.priceTableEntry.price.currency,
                                                        modelView.priceTableEntry.price.area,
                                                        modelView.priceTableEntry.price.value);
                    convertedValueTask.Wait();
                    double convertedValue = convertedValueTask.Result;
                    price = Price.valueOf(convertedValue);
                }
            }
            catch (HttpRequestException)
            {
                price = Price.valueOf(modelView.priceTableEntry.price.value);
            }

            MaterialPriceTableEntry materialPriceTableEntry = new MaterialPriceTableEntry(material, price, timePeriod);
            MaterialPriceTableEntry savedMaterialPriceTableEntry =
                PersistenceContext.repositories().createMaterialPriceTableRepository().save(materialPriceTableEntry);

            if (savedMaterialPriceTableEntry == null)
            {
                throw new InvalidOperationException(PRICE_TABLE_ENTRY_NOT_CREATED);
            }

            GetMaterialPriceModelView createdPriceModelView = new GetMaterialPriceModelView();

            createdPriceModelView.materialId = material.Id;
            createdPriceModelView.startingDate = LocalDateTimePattern.GeneralIso.Format(savedMaterialPriceTableEntry.timePeriod.startingDate);
            createdPriceModelView.endingDate = LocalDateTimePattern.GeneralIso.Format(savedMaterialPriceTableEntry.timePeriod.endingDate);
            createdPriceModelView.value = savedMaterialPriceTableEntry.price.value;
            createdPriceModelView.currency = defaultCurrency;
            createdPriceModelView.area = defaultArea;
            createdPriceModelView.id = savedMaterialPriceTableEntry.Id;

            return createdPriceModelView;
        }
    }
}