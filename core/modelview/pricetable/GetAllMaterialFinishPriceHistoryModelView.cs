using System.Collections.Generic;
using System.Runtime.Serialization;

namespace core.modelview.pricetable{
     /// <summary>
     /// Model View representation for the fetch material finish price history context
     /// </summary>
    [CollectionDataContract]
    public sealed class GetAllMaterialFinishPriceHistoryModelView:List<GetMaterialFinishPriceModelView>{}
}