using FluentValidation;
using YallaFood.Application.DTOs;

namespace YallaFood.Application.Validators;

public class RequestOtpRequestValidator : AbstractValidator<RequestOtpRequest>
{
    public RequestOtpRequestValidator()
    {
        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("رقم الهاتف مطلوب.")
            .Matches(@"^\+?[0-9]{9,15}$").WithMessage("صيغة رقم الهاتف غير صحيحة.");
    }
}

public class VerifyOtpRequestValidator : AbstractValidator<VerifyOtpRequest>
{
    public VerifyOtpRequestValidator()
    {
        RuleFor(x => x.PhoneNumber).NotEmpty().WithMessage("رقم الهاتف مطلوب.");
        RuleFor(x => x.OtpCode).NotEmpty().WithMessage("رمز التحقق مطلوب.");
    }
}

public class CreateOrderRequestValidator : AbstractValidator<CreateOrderRequest>
{
    public CreateOrderRequestValidator()
    {
        RuleFor(x => x.RestaurantId).NotEmpty().WithMessage("معرف المطعم مطلوب.");
        RuleFor(x => x.Items).NotEmpty().WithMessage("يجب اختيار وجبة واحدة على الأقل.");
        RuleFor(x => x.DeliveryAddressText).NotEmpty().WithMessage("عنوان التوصيل مطلوب.");
        RuleFor(x => x.CustomerPhoneNumber).NotEmpty().WithMessage("رقم هاتف التواصل مطلوب.");
    }
}

public class CreateProductRequestValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductRequestValidator()
    {
        RuleFor(x => x.RestaurantId).NotEmpty().WithMessage("معرف المطعم مطلوب.");
        RuleFor(x => x.Name).NotEmpty().WithMessage("اسم الوجبة مطلوب.");
        RuleFor(x => x.Price).GreaterThan(0).WithMessage("السعر يجب أن يكون أكبر من 0.");
    }
}
