using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CascadiaWeb.Models
{
    public class Response
    {
        [Column("id", TypeName = "bigint")]
        public Int64 ID { get; set; }

        [Column("expectedDate", TypeName = "datetime")]
        public DateTime? ExpectedDate { get; set; }

        [Column("methodDelivery", TypeName = "varchar(100)")]
        public string MethodDelivery { get; set; }

        [Column("poc", TypeName = "varchar(200)")]
        public string Poc { get; set; }

        [Column("needsToPickup", TypeName = "bit")]
        public bool? NeedsToPickup { get; set; }

        [Column("addressToPickup", TypeName = "varchar(300)")]
        public string AddressToPickup { get; set; }

        [Column("facilityHoursPickUp", TypeName = "varchar(20)")]
        public string FacilityHoursPickUp { get; set; }

        [Column("poOrRelease", TypeName = "varchar(100)")]
        public string PoOrRelease { get; set; }

        [Column("productType", TypeName = "varchar(100)")]
        public string ProductType { get; set; }

        [Column("expirationDate", TypeName = "date")]
        public DateTime? ExpirationDate { get; set; }

        [Column("unitType", TypeName = "varchar(100)")]
        public string UnitType { get; set; }

        [Column("quantityByUnit", TypeName = "int")]
        public int QuantityByUnit { get; set; }

        [Column("quantityDimensionPallets", TypeName = "float")]
        public float QuantityDimensionPallets { get; set; }

        [Column("weightProduct", TypeName = "float")]
        public float WeightProduct { get; set; }

        [Column("retailValue", TypeName = "float")]
        public float RetailValue { get; set; }

        public Notification Notification { get; set; }
    }
}
