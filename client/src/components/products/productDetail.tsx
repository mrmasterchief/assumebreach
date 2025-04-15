import { Icon } from "@iconify/react/dist/iconify.js";

export const ProductSection = ({
  title,
  content,
  isOpen,
  toggle,
}: {
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  toggle: () => void;
}) => (
  <div className="border-grey-20 group border-t last:mb-0 last:border-b py-3">
    <h3 className="px-1" onClick={toggle}>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <p className="font-normal font-san text-[#4b5563] text-lg">
            {title}
          </p>
        </div>
        <button
          type="button"
          aria-expanded={isOpen}
          className="relative p-[6px] transition-transform duration-300"
        >
          <div className="max-h-5 max-w-5 flex items-center justify-center">
            <Icon
              icon="bi:plus"
              className={`transition-opacity duration-300 absolute inset-0 ${
                isOpen ? "opacity-0 rotate-45" : "opacity-100"
              }`}
            />
            <Icon
              icon="bi:dash"
              className={`transition-opacity duration-300 absolute inset-0 ${
                isOpen ? "opacity-100" : "opacity-0 rotate-45"
              }`}
            />
          </div>
        </button>
      </div>
    </h3>
    <div
      className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
        isOpen ? "max-h-96" : "max-h-0"
      }`}
    >
      <div className="w-full">{content}</div>
    </div>
  </div>
);

export const ProductInfoContent = ({
    productDetails,
}: {
    productDetails: {
        material: string;
        country_of_origin: string;
        type: string;
        weight: string;
        dimensions: string;
    };
}) => (
  <div className="text-lg-regular py-8">
    <div className="grid grid-cols-2 gap-x-8">
      {[
        { label: "Material", value: productDetails?.material },
        {
          label: "Country of origin",
          value: productDetails?.country_of_origin,
        },
        { label: "Type", value: productDetails?.type },
        { label: "Weight", value: productDetails?.weight },
        { label: "Dimensions", value: productDetails?.dimensions },
      ].map((item, index) => (
        <div key={index} className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">{item.label}</span>
            <p>{item.value || "-"}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ShippingReturnsContent = () => (
  <div className="text-lg-regular py-8">
    <div className="grid grid-cols-2 gap-x-8">
      {[
        {
          icon: "bi:truck",
          label: "Shipping",
          text: "Free shipping on orders over $50",
        },
        {
          icon: "bi:arrow-return-right",
          label: "Returns",
          text: "Free returns within 30 days",
        },
      ].map((item, index) => (
        <div key={index} className="flex flex-col gap-y-4">
          <div className="flex flex-row gap-x-4">
            <Icon
              icon={item.icon}
              className="text-lg-regular"
              width={24}
              height={24}
            />
            <div className="flex flex-col gap-y-2">
              <span className="font-semibold">{item.label}</span>
              <p>{item.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
