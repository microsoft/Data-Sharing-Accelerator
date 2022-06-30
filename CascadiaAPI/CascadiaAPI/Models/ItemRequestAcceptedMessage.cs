using System;
using Newtonsoft.Json;

namespace CascadiaWeb.Models
{
    public class ItemRequestAcceptedMessage
    {
        public ItemRequestAcceptedMessage()
        {

        }

        public ItemRequestAcceptedMessage(Notification n, Response r) : this(
            n.HashString,
            n.Partner,
            n.CreatedDate,
            r.ExpectedDate,
            r.MethodDelivery,
            r.Poc,
            r.NeedsToPickup,
            r.AddressToPickup,
            r.FacilityHoursPickUp,
            r.PoOrRelease,
            r.ProductType,
            r.ExpirationDate,
            r.UnitType,
            r.QuantityByUnit,
            r.QuantityDimensionPallets,
            r.WeightProduct,
            r.RetailValue)
        {
            
        }

        public ItemRequestAcceptedMessage(string hashString, string partner, DateTime? createdDate, DateTime? expectedDate, string methodDelivery, string poc, bool? needsToPickup, string addressToPickup, string facilityHoursPickUp, string poOrRelease, string productType, DateTime? expirationDate, string unitType, int quantityByUnit, float quantityDimensionPallets, float weightProduct, float retailValue)
        {
            HashString = hashString;
            Partner = partner;
            CreatedDate = createdDate;
            ExpectedDate = expectedDate;
            MethodDelivery = methodDelivery;
            Poc = poc;
            NeedsToPickup = needsToPickup;
            AddressToPickup = addressToPickup;
            FacilityHoursPickUp = facilityHoursPickUp;
            PoOrRelease = poOrRelease;
            ProductType = productType;
            ExpirationDate = expirationDate;
            UnitType = unitType;
            QuantityByUnit = quantityByUnit;
            QuantityDimensionPallets = quantityDimensionPallets;
            WeightProduct = weightProduct;
            RetailValue = retailValue;
        }

        [JsonProperty("hashString")]
        public string HashString { get; set; }
        [JsonProperty("partner")]
        public string Partner { get; set; }
        [JsonProperty("createdDate")]
        public DateTime? CreatedDate { get; set; }
        [JsonProperty("expectedDate")]
        public DateTime? ExpectedDate { get; set; }
        [JsonProperty("methodDelivery")]
        public string MethodDelivery { get; set; }
        [JsonProperty("poc")]
        public string Poc { get; set; }
        [JsonProperty("needsToPickup")]
        public bool? NeedsToPickup { get; set; }
        [JsonProperty("addressToPickup")]
        public string AddressToPickup { get; set; }
        [JsonProperty("facilityHoursPickup")]
        public string FacilityHoursPickUp { get; set; }
        [JsonProperty("poOrRelease")]
        public string PoOrRelease { get; set; }
        [JsonProperty("productType")]
        public string ProductType { get; set; }
        [JsonProperty("expirationDate")]
        public DateTime? ExpirationDate { get; set; }
        [JsonProperty("unitType")]
        public string UnitType { get; set; }
        [JsonProperty("quantityByUnit")]
        public int QuantityByUnit { get; set; }
        [JsonProperty("quantityDimensionPallets")]
        public float QuantityDimensionPallets { get; set; }
        [JsonProperty("weightProduct")]
        public float WeightProduct { get; set; }
        [JsonProperty("retailValue")]
        public float RetailValue { get; set; }

        public override bool Equals(object obj)
        {
            return obj is ItemRequestAcceptedMessage message &&
                   HashString == message.HashString &&
                   Partner == message.Partner &&
                   CreatedDate == message.CreatedDate &&
                   ExpectedDate == message.ExpectedDate &&
                   MethodDelivery == message.MethodDelivery &&
                   Poc == message.Poc &&
                   NeedsToPickup == message.NeedsToPickup &&
                   AddressToPickup == message.AddressToPickup &&
                   FacilityHoursPickUp == message.FacilityHoursPickUp &&
                   PoOrRelease == message.PoOrRelease &&
                   ProductType == message.ProductType &&
                   ExpirationDate == message.ExpirationDate &&
                   UnitType == message.UnitType &&
                   QuantityByUnit == message.QuantityByUnit &&
                   QuantityDimensionPallets == message.QuantityDimensionPallets &&
                   WeightProduct == message.WeightProduct &&
                   RetailValue == message.RetailValue;
        }

        public override int GetHashCode()
        {
            HashCode hash = new HashCode();
            hash.Add(HashString);
            hash.Add(Partner);
            hash.Add(CreatedDate);
            hash.Add(ExpectedDate);
            hash.Add(MethodDelivery);
            hash.Add(Poc);
            hash.Add(NeedsToPickup);
            hash.Add(AddressToPickup);
            hash.Add(FacilityHoursPickUp);
            hash.Add(PoOrRelease);
            hash.Add(ProductType);
            hash.Add(ExpirationDate);
            hash.Add(UnitType);
            hash.Add(QuantityByUnit);
            hash.Add(QuantityDimensionPallets);
            hash.Add(WeightProduct);
            hash.Add(RetailValue);
            return hash.ToHashCode();
        }

        public Notification toNotification()
        {
            return new Notification()
            {
                HashString = this.HashString,
                Partner = this.Partner,
                CreatedDate = this.CreatedDate,
            };
        }

        public Response toResponse()
        {
            return new Response()
            {
                ExpectedDate = this.ExpectedDate,
                MethodDelivery = this.MethodDelivery,
                Poc = this.Poc,
                NeedsToPickup = this.NeedsToPickup,
                AddressToPickup = this.AddressToPickup,
                FacilityHoursPickUp = this.FacilityHoursPickUp,
                PoOrRelease = this.PoOrRelease,
                ProductType = this.ProductType,
                ExpirationDate = this.ExpirationDate,
                UnitType = this.UnitType,
                QuantityByUnit = this.QuantityByUnit,
                QuantityDimensionPallets = this.QuantityDimensionPallets,
                WeightProduct = this.WeightProduct,
                RetailValue = this.RetailValue,
            };
        }
    }
}
