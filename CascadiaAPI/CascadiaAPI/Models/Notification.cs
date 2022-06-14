using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CascadiaWeb.Models
{
    public class Notification
    {

        [Column("RESPONSE_DETAILS_ID", TypeName = "bigint")]
        public Int64 ResponseDetailsId { get; set; }
        public Response Response { get; set; }

        [Column("hashstring", TypeName = "varchar(100)")]
        public string HashString { get; set; }

        [Column("partner", TypeName = "varchar(100)")]
        public string Partner { get; set; }

        [Column("createdDate", TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }
    }
}
