const PrintableMenu = ({ foods }) => {
  // Group foods by category
  const groupedFoods = foods.reduce((acc, food) => {
    if (food.isAvailable) {
      const category = food.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(food);
    }
    return acc;
  }, {});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCategoryName = (category) => {
    return category.replace(/_/g, " ");
  };

  return (
    <div className="hidden print:block">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-menu, .printable-menu * {
              visibility: visible;
            }
            .printable-menu {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            @page {
              margin: 1cm;
            }
          }
        `}
      </style>
      
      <div className="printable-menu p-8">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Restaurant Menu
          </h1>
          <p className="text-lg text-gray-600">
            Available Items - {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Menu Items by Category */}
        {Object.keys(groupedFoods).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No available items to display</p>
          </div>
        ) : (
          Object.entries(groupedFoods).map(([category, items]) => (
            <div key={category} className="mb-8 break-inside-avoid">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-400">
                {formatCategoryName(category)}
              </h2>
              <div className="space-y-3">
                {items.map((food) => (
                  <div
                    key={food.id}
                    className="flex justify-between items-start border-b border-gray-200 pb-2"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {food.name}
                      </h3>
                      {food.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {food.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(food.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Footer */}
        <div className="mt-12 pt-4 border-t-2 border-gray-800 text-center">
          <p className="text-sm text-gray-600">
            Thank you for dining with us!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintableMenu;
