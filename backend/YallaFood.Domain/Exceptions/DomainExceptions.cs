namespace YallaFood.Domain.Exceptions;

public class DomainException : Exception
{
    public DomainException(string message) : base(message)
    {
    }
}

public class MinimumOrderAmountException : DomainException
{
    public decimal MinimumAmount { get; }
    public decimal ActualAmount { get; }

    public MinimumOrderAmountException(decimal minimumAmount, decimal actualAmount)
        : base($"الحد الأدنى للطلب هو {minimumAmount:N0} ليرة سورية. القيمة الحالية لطلبك هي {actualAmount:N0} ليرة سورية.")
    {
        MinimumAmount = minimumAmount;
        ActualAmount = actualAmount;
    }
}

public class SingleRestaurantOrderException : DomainException
{
    public SingleRestaurantOrderException()
        : base("يمكن التوصيل من مطعم واحد فقط لكل طلب. يرجى إفراغ السلة أولاً قبل التوصيل من مطعم آخر.")
    {
    }
}

public class InvalidOrderStatusTransitionException : DomainException
{
    public InvalidOrderStatusTransitionException(string currentStatus, string targetStatus)
        : base($"لا يمكن تغيير حالة الطلب من '{currentStatus}' إلى '{targetStatus}'.")
    {
    }
}

public class NotFoundException : DomainException
{
    public NotFoundException(string name, object key)
        : base($"العنصر المطلوبة ({name}) بالمعرف '{key}' غير موجودة.")
    {
    }
}
