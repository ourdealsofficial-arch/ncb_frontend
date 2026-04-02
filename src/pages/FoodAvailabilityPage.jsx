import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Card from "../component/Card";
import Button from "../component/Button";
import Loading from "../component/Loading";
import Input from "../component/Input";
import PrintableBill from "../component/PrintableBill";
import { foodService } from "../services/foodService";
import { billService } from "../services/billService";

const FoodAvailabilityPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ category: "" });
  const [error, setError] = useState(null);

  // Order state
  const [orderItems, setOrderItems] = useState([]);
  const [, setShowCart] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    discount: 0,
    orderType: "TAKEAWAY",
    paymentMethod: "CASH",
  });

  // Bill state
  const [generatedBill, setGeneratedBill] = useState(null);
  const [showPrintBill, setShowPrintBill] = useState(false);
  const [creatingBill, setCreatingBill] = useState(false);

  const categories = [
    "All",
    "STARTERS",
    "MAIN_COURSE",
    "BEVERAGES",
    "DESSERTS",
    "SNACKS",
    "CHAAT",
  ];

  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = { isAvailable: true }; // Only show available foods
      if (filter.category && filter.category !== "All") {
        params.category = filter.category;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const response = await foodService.getAllFoods(params);
      setFoods(response.data.data?.foods || []);
    } catch (err) {
      console.error("Error fetching foods:", err);
      setError(err.response?.data?.message || "Failed to load food items");
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  // Add item to order
  const addToOrder = (food) => {
    setShowCart(true);
    const exist = orderItems.find((i) => i.foodName === food.name);
    if (exist) {
      setOrderItems(
        orderItems.map((i) =>
          i.foodName === food.name ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        { foodName: food.name, quantity: 1, price: food.price, foodId: food._id },
      ]);
    }
  };

  // Update quantity
  const updateQuantity = (foodName, delta) => {
    setOrderItems(
      orderItems
        .map((i) =>
          i.foodName === foodName
            ? { ...i, quantity: Math.max(0, i.quantity + delta) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  // Remove item
  const removeItem = (foodName) => {
    setOrderItems(orderItems.filter((i) => i.foodName !== foodName));
  };

  // Calculate totals
  const subtotal = orderItems.reduce(
    (acc, i) => acc + i.price * i.quantity,
    0
  );
  const totalAmount = subtotal - (Number(customer.discount) || 0);

  // Create bill
  const handleCreateBill = async () => {
    if (!customer.name || orderItems.length === 0) {
      alert("Please add items and customer name before generating bill.");
      return;
    }

    const payload = {
      orderType: customer.orderType,
      paymentMethod: customer.paymentMethod,
      discount: Number(customer.discount) || 0,
      customerDetails: {
        name: customer.name,
        phone: customer.phone,
      },
      items: orderItems.map(({ foodName, quantity, price, foodId }) => ({
        foodName,
        foodId,
        quantity,
        price,
      })),
    };

    try {
      setCreatingBill(true);
      const res = await billService.createBill(payload);
      const billData = res.data.data;

      // Ensure items have subtotal
      if (billData.items) {
        billData.items = billData.items.map((it) => ({
          ...it,
          subtotal: it.price * it.quantity,
        }));
      }

      setGeneratedBill(billData);
      setShowPrintBill(true);

      // Reset order
      setOrderItems([]);
      setShowCart(false);
      setCustomer({
        name: "",
        phone: "",
        discount: 0,
        orderType: "TAKEAWAY",
        paymentMethod: "CASH",
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error creating bill!");
    } finally {
      setCreatingBill(false);
    }
  };

  if (loading && foods.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* LEFT - Food List */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-orange-600 mb-6">
            🍕 Food Ordering (POS)
          </h1>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search food..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Button onClick={fetchFoods} variant="primary">
              Search
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Food Grid */}
          {loading ? (
            <div className="text-center text-gray-500 mt-20">Loading...</div>
          ) : foods.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              No food items found
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {foods.map((food) => (
                <motion.div
                  key={food._id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
                >
                  <img
                    src={
                      food.image
                        ? food.image.replace(
                            "https://drive.google.com/file/d/",
                            "https://drive.google.com/uc?export=view&id="
                          )
                        : "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
                    }
                    alt={food.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">
                      {food.name}
                    </h3>
                    <p className="text-orange-600 font-bold text-base mb-2">
                      ₹{food.price}
                    </p>
                    <button
                      onClick={() => addToOrder(food)}
                      className="w-full bg-orange-600 text-white py-1.5 rounded-md hover:bg-orange-700 transition-colors text-sm font-medium"
                    >
                      + Add
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT - Order Cart */}
      <div className="w-96 bg-white shadow-2xl border-l border-gray-200">
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Current Order
            </h2>
            {orderItems.length > 0 && (
              <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {orderItems.length}
              </span>
            )}
          </div>

          {/* Customer Details */}
          <div className="space-y-3 mb-4">
            <Input
              type="text"
              placeholder="Customer Name *"
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
            />
          </div>

          {/* Order Items */}
          <div className="flex-1 overflow-y-auto border rounded-lg p-3 mb-4 bg-gray-50">
            {orderItems.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-8">
                No items added yet
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div
                    key={item.foodName}
                    className="bg-white p-3 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {item.foodName}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹{item.price} × {item.quantity} = ₹
                          {item.price * item.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.foodName)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.foodName, -1)}
                        className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.foodName, 1)}
                        className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2 mb-4">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="font-semibold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Discount:</span>
              <input
                type="number"
                value={customer.discount}
                onChange={(e) =>
                  setCustomer({ ...customer, discount: e.target.value })
                }
                className="w-24 border rounded-lg px-2 py-1 text-right"
                min="0"
              />
            </div>
            <div className="flex justify-between font-bold text-lg text-orange-600 pt-2 border-t">
              <span>Total:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          {/* Order Type and Payment */}
          <div className="space-y-3 mb-4">
            <select
              value={customer.orderType}
              onChange={(e) =>
                setCustomer({ ...customer, orderType: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="TAKEAWAY">Takeaway</option>
              <option value="DINE_IN">Dine In</option>
            </select>
            <select
              value={customer.paymentMethod}
              onChange={(e) =>
                setCustomer({ ...customer, paymentMethod: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="CASH">Cash</option>
              <option value="ONLINE">Online</option>
            </select>
          </div>

          {/* Generate Bill Button */}
          <Button
            onClick={handleCreateBill}
            disabled={!customer.name || orderItems.length === 0 || creatingBill}
            variant="primary"
            size="lg"
            className="w-full"
          >
            {creatingBill ? "Generating..." : "Generate Bill"}
          </Button>
        </div>
      </div>

      {/* Printable Bill Modal */}
      {showPrintBill && generatedBill && (
        <PrintableBill
          bill={generatedBill}
          onClose={() => {
            setShowPrintBill(false);
            setGeneratedBill(null);
          }}
        />
      )}
    </div>
  );
};

export default FoodAvailabilityPage;
