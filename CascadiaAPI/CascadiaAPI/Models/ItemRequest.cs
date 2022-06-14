using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace CascadiaWeb.Models
{
    public class ItemRequest
    {


        [Column("id")]
        public int ID { get; set; }

        [Column("createdby", TypeName="varchar(100)")]
        [JsonProperty]
        public string CreatedBy { get; set; }

        [Column("createdon", TypeName="datetime")]
        [JsonProperty]
        public DateTime? CreatedOn { get; set; }

        [Column("createdonbehalfby", TypeName = "varchar(100)")]
        [JsonProperty]
        public string CreatedOnBehalfBy { get; set; }

        [Column("modifiedonbehalfby", TypeName = "varchar(100)")]
        [JsonProperty]
        public string ModifiedOnBehalfBy { get; set; }

        [Column("modifiedby", TypeName = "varchar(100)")]
        [JsonProperty]
        public string ModifiedBy { get; set; }

        [Column("modifiedon", TypeName = "datetime")]
        [JsonProperty]
        public DateTime? ModifiedOn { get; set; }

        [Column("msnfp_description", TypeName = "varchar(200)")]
        [JsonProperty]
        public string MsnfpDescription { get; set; }

        [Column("msnfp_georeference", TypeName = "varchar(100)")]
        [JsonProperty]
        public string MsnfpGeoreference { get; set; }

        [Column("importsequencenumber", TypeName = "varchar(100)")]
        [JsonProperty]
        public string ImportSequenceNumber { get; set; }

        [Column("msnfp_itemid")]
        [JsonProperty]
        public int? MsnfpItemId { get; set; }

        [Column("msnfp_itemcode", TypeName = "varchar(100)")]
        [JsonProperty]
        public string MsnfpItemCode { get; set; }

        [Column("msnfp_itemgroup", TypeName = "varchar(100)")]
        [JsonProperty]
        public string MsnfpItemGroup { get; set; }

        [Column("msnfp_itemname", TypeName = "varchar(200)")]
        [JsonProperty]
        public string MsnfpItemName { get; set; }

        [Column("msnfp_itemnumber")]
        [JsonProperty]
        public int? MsnfpItemNumber { get; set; }

        [Column("msnfp_itemstatus", TypeName = "varchar(100)")]
        [JsonProperty]
        public string MsnfpItemStatus { get; set; }

        [Column("msnfp_itemtype", TypeName = "varchar(100)")]
        [JsonProperty]
        public string MsnfpItemType { get; set; }

        [Column("msnfp_longitude", TypeName = "varchar(200)")]
        [JsonProperty]
        public string MsnfpLongitude { get; set; }

        [Column("msnfp_latitude", TypeName = "varchar(200)")]
        [JsonProperty]
        public string MsnfpLatitude { get; set; }

        [Column("ownerid", TypeName = "varchar(100)")]
        [JsonProperty]
        public string OwnerId { get; set; }

        [Column("owningbusinessunit", TypeName = "varchar(100)")]
        [JsonProperty]
        public string OwningBusinessUnit { get; set; }

        [Column("owningteam", TypeName = "varchar(200)")]
        [JsonProperty]
        public string OwningTeam { get; set; }

        [Column("owninguser", TypeName = "varchar(100)")]
        [JsonProperty]
        public string OwningUser { get; set; }

        [Column("msnfp_polygon", TypeName = "varchar(100)")]
        [JsonProperty]
        public string MsnfpPolygon { get; set; }

        [Column("msnfp_purchasecategory", TypeName = "varchar(100)")]
        [JsonProperty]
        public string MsnfpPurchaseCategory { get; set; }

        [Column("overriddencreatedon", TypeName = "varchar(100)")]
        [JsonProperty]
        public string OverriddenCreatedOn { get; set; }

        [Column("statecode")]
        [JsonProperty]
        public int? StateCode { get; set; }

        [Column("msnfp_supplierid", TypeName = "varchar(100)")]
        [JsonProperty]
        public string MsnfpSupplierId { get; set; }

        [Column("timezoneruleversionnumber", TypeName = "varchar(100)")]
        [JsonProperty]
        public string TimeZoneRuleVersionNumber { get; set; }

        [Column("itccpnversiontimezonecode", TypeName = "varchar(100)")]
        [JsonProperty]
        public string ItccpnVersionTimeZoneCode { get; set; }

        [Column("versionnumber", TypeName = "varchar(100)")]
        [JsonProperty]
        public string VersionNumber { get; set; }

        [Column("deliverOn", TypeName = "datetime")]
        [JsonProperty]
        public DateTime? DeliverOn { get; set; }

        [Column("hashstring", TypeName = "varchar(100)")]
        [JsonProperty]
        public string HashString { get; set; }

        [NotMapped]
        public string AcceptedBy { get; set; }

    }
    public class ItemRequestGroup
    {
        [JsonProperty(PropertyName ="requests")]
        public ItemRequest[] Requests { get; set; }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
