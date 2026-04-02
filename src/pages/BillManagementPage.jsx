import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

import { billService } from "../services/billService";
import { foodService } from "../services/foodService";
import Button from "../component/Button";
import Card from "../component/Card";
import Input from "../component/Input";
import Modal from "../component/Modal";
import Loading from "../component/Loading";
import Badge from "../component/Badge";
import PrintableBill from "../component/PrintableBill";
import { Search, Plus, Eye, Edit, Trash2, Calendar, DollarSign, AlertCircle, CheckCircle2, Printer } from "lucide-react";

const BillManagementPage = () => {
  const [bills, setBills] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create', 'edit', 'view'
  const [selectedBill, setSelectedBill] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const [showPrintBill, setShowPrintBill] = useState(false);
  const [billToPrint, setBillToPrint] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    paymentMethod: "",
    search: "",
  });

  // Form state for create/edit
  const [formData, setFormData] = useState({
    customerDetails: {
      name: "",
      phone: "",
    },
    items: [],
    discount: 0,
    paymentMethod: "CASH",
    orderType: "DINE_IN",
  });

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchBills = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod;
      if (filters.search) params.search = filters.search;

      const response = await billService.getAllBills(params);
      // Backend returns bills directly in response.data.data array
      setBills(response.data.data || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setErrorMessage(error.response?.data?.message || "Failed to fetch bills. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch bills on mount and when filters change
  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  // Fetch foods for the create/edit modal
  useEffect(() => {
    if (showModal && (modalMode === "create" || modalMode === "edit")) {
      fetchFoods();
    }
  }, [showModal, modalMode]);

  const fetchFoods = async () => {
    try {
      const response = await foodService.getAllFoods({ isAvailable: true });
      // Backend returns foods in response.data.data.foods array
      setFoods(response.data.data?.foods || []);
    } catch (error) {
      console.error("Error fetching foods:", error);
      setErrorMessage(error.response?.data?.message || "Failed to fetch food items.");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchBills();
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      paymentMethod: "",
      search: "",
    });
    setTimeout(() => fetchBills(), 0);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedBill(null);
    setFormData({
      customerDetails: {
        name: "",
        phone: "",
      },
      items: [],
      discount: 0,
      paymentMethod: "CASH",
      orderType: "DINE_IN",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openViewModal = async (bill) => {
    setModalMode("view");
    setSelectedBill(bill);
    setShowModal(true);
  };

  const openEditModal = async (bill) => {
    setModalMode("edit");
    setSelectedBill(bill);
    setFormData({
      customerDetails: bill.customerDetails,
      items: bill.items.map((item) => ({
        foodId: item.foodId,
        foodName: item.foodName,
        quantity: item.quantity,
        price: item.price,
      })),
      discount: bill.discount,
      paymentMethod: bill.paymentMethod,
      orderType: bill.orderType,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openDeleteConfirm = (bill) => {
    setBillToDelete(bill);
    setShowDeleteConfirm(true);
  };

  const handleDeleteBill = async () => {
    if (!billToDelete) return;

    try {
      await billService.deleteBill(billToDelete.id);
      setBills((prev) => prev.filter((b) => b.id !== billToDelete.id));
      setShowDeleteConfirm(false);
      setBillToDelete(null);
      setSuccessMessage("Bill deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting bill:", error);
      setErrorMessage(error.response?.data?.message || "Failed to delete bill. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBill(null);
    setFormData({
      customerDetails: {
        name: "",
        phone: "",
      },
      items: [],
      discount: 0,
      paymentMethod: "CASH",
      orderType: "DINE_IN",
    });
    setFormErrors({});
  };

  // Calculate subtotal and total
  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - (formData.discount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.customerDetails.name.trim()) {
      errors.customerName = "Customer name is required";
    }

    if (formData.items.length === 0) {
      errors.items = "At least one item is required";
    }

    if (formData.discount < 0) {
      errors.discount = "Discount cannot be negative";
    }

    if (formData.discount > calculateSubtotal()) {
      errors.discount = "Discount cannot exceed subtotal";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateBill = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const billData = {
        customerDetails: formData.customerDetails,
        items: formData.items.map((item) => ({
          foodId: item.foodId,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || null,
        })),
        discount: formData.discount,
        paymentMethod: formData.paymentMethod,
        orderType: formData.orderType,
      };

      await billService.createBill(billData);
      setSuccessMessage("Bill created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      closeModal();
      fetchBills();
    } catch (error) {
      console.error("Error creating bill:", error);
      setErrorMessage(error.response?.data?.message || "Failed to create bill. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBill = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const billData = {
        customerDetails: formData.customerDetails,
        items: formData.items.map((item) => ({
          foodId: item.foodId,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || null,
        })),
        discount: formData.discount,
        paymentMethod: formData.paymentMethod,
        orderType: formData.orderType,
      };

      await billService.updateBill(selectedBill.id, billData);
      setSuccessMessage("Bill updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      closeModal();
      fetchBills();
    } catch (error) {
      console.error("Error updating bill:", error);
      setErrorMessage(error.response?.data?.message || "Failed to update bill. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (loading && bills.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </motion.div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </motion.div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bill Management</h1>
          <p className="text-gray-600">Manage customer bills and orders</p>
        </div>

        {/* Filters Section */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              type="date"
              label="Start Date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              icon={<Calendar size={18} />}
            />
            <Input
              type="date"
              label="End Date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              icon={<Calendar size={18} />}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              >
                <option value="">All Methods</option>
                <option value="CASH">Cash</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>
            <Input
              type="text"
              label="Search Customer"
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              icon={<Search size={18} />}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleApplyFilters} size="sm">
              Apply Filters
            </Button>
            <Button onClick={handleClearFilters} variant="secondary" size="sm">
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Create Bill Button */}
        <div className="mb-6">
          <Button onClick={openCreateModal} icon={<Plus size={20} />}>
            Create Bill
          </Button>
        </div>

        {/* Bills Table */}
        <Card>
          {loading ? (
            <div className="text-center py-8">
              <Loading />
            </div>
          ) : bills.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No bills found</p>
              <p className="text-gray-400 text-sm mt-2">
                Create your first bill to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Bill Number
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Customer Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Total Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Payment Method
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Order Type
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr
                      key={bill.id}
                      className="border-b border-gray-100 hover:bg-orange-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-[#FF6B35]">
                        {bill.billNumber}
                      </td>
                      <td className="py-3 px-4">{bill.customerDetails.name}</td>
                      <td className="py-3 px-4 font-semibold">
                        ₹{bill.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            bill.paymentMethod === "CASH" ? "info" : "success"
                          }
                        >
                          {bill.paymentMethod}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            bill.orderType === "DINE_IN" ? "warning" : "info"
                          }
                        >
                          {bill.orderType}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(bill.paidAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setBillToPrint(bill);
                              setShowPrintBill(true);
                            }}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Print"
                          >
                            <Printer size={18} />
                          </button>
                          <button
                            onClick={() => openViewModal(bill)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openEditModal(bill)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(bill)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Create/Edit Modal */}
        {showModal && (modalMode === "create" || modalMode === "edit") && (
          <Modal
            isOpen={showModal}
            onClose={closeModal}
            title={modalMode === "create" ? "Create New Bill" : "Edit Bill"}
            size="xl"
          >
            <CreateEditBillForm
              formData={formData}
              setFormData={setFormData}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
              foods={foods}
              calculateSubtotal={calculateSubtotal}
              calculateTotal={calculateTotal}
              onSubmit={modalMode === "create" ? handleCreateBill : handleUpdateBill}
              onCancel={closeModal}
              mode={modalMode}
              loading={loading}
            />
          </Modal>
        )}

        {/* View Modal */}
        {showModal && modalMode === "view" && selectedBill && (
          <Modal
            isOpen={showModal}
            onClose={closeModal}
            title="View Bill Details"
            size="lg"
          >
            <ViewBillDetails bill={selectedBill} />
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <Modal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            title="Confirm Delete"
            size="sm"
          >
            <div className="py-4">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete bill{" "}
                <span className="font-semibold text-[#FF6B35]">
                  {billToDelete?.billNumber}
                </span>
                ?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteBill}>
                  Delete
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Printable Bill Modal */}
        {showPrintBill && billToPrint && (
          <PrintableBill
            bill={billToPrint}
            onClose={() => {
              setShowPrintBill(false);
              setBillToPrint(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Create/Edit Bill Form Component
const CreateEditBillForm = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  foods,
  calculateSubtotal,
  calculateTotal,
  onSubmit,
  onCancel,
  mode,
  loading,
}) => {
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleAddItem = () => {
    if (!selectedFoodId) {
      alert("Please select a food item");
      return;
    }

    const food = foods.find((f) => f.id === selectedFoodId);
    if (!food) return;

    // Check if item already exists
    const existingItemIndex = formData.items.findIndex(
      (item) => item.foodId === selectedFoodId
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      const updatedItems = [...formData.items];
      updatedItems[existingItemIndex].quantity += quantity;
      setFormData({ ...formData, items: updatedItems });
    } else {
      // Add new item
      const newItem = {
        foodId: food.id,
        foodName: food.name,
        quantity: quantity,
        price: food.price,
      };
      setFormData({ ...formData, items: [...formData.items, newItem] });
    }

    setSelectedFoodId("");
    setQuantity(1);
    setFormErrors({ ...formErrors, items: "" });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleUpdateItemQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedItems = [...formData.items];
    updatedItems[index].quantity = newQuantity;
    setFormData({ ...formData, items: updatedItems });
  };

  return (
    <div className="space-y-6">
      {/* Customer Details Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Customer Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Customer Name"
            required
            value={formData.customerDetails.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                customerDetails: {
                  ...formData.customerDetails,
                  name: e.target.value,
                },
              })
            }
            error={formErrors.customerName}
            placeholder="Enter customer name"
          />
          <Input
            label="Phone Number"
            type="tel"
            value={formData.customerDetails.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                customerDetails: {
                  ...formData.customerDetails,
                  phone: e.target.value,
                },
              })
            }
            placeholder="Enter phone number (optional)"
          />
        </div>
      </div>

      {/* Food Items Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Food Items
        </h3>

        {/* Add Item */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <select
              value={selectedFoodId}
              onChange={(e) => setSelectedFoodId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            >
              <option value="">Select food item...</option>
              {foods.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name} - ₹{food.price}
                </option>
              ))}
            </select>
          </div>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            placeholder="Qty"
            className="w-24"
          />
          <Button onClick={handleAddItem} size="md">
            Add
          </Button>
        </div>

        {formErrors.items && (
          <p className="text-sm text-red-600 mb-2">{formErrors.items}</p>
        )}

        {/* Items List */}
        {formData.items.length > 0 ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">
                    Item
                  </th>
                  <th className="text-center py-2 px-4 text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="text-center py-2 px-4 text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">
                    Subtotal
                  </th>
                  <th className="text-center py-2 px-4 text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="py-2 px-4">{item.foodName}</td>
                    <td className="py-2 px-4 text-center">₹{item.price}</td>
                    <td className="py-2 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            handleUpdateItemQuantity(index, item.quantity - 1)
                          }
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleUpdateItemQuantity(index, item.quantity + 1)
                          }
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-right font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
            No items added yet
          </div>
        )}
      </div>

      {/* Order Details Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Order Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            >
              <option value="CASH">Cash</option>
              <option value="ONLINE">Online</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.orderType}
              onChange={(e) =>
                setFormData({ ...formData, orderType: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            >
              <option value="DINE_IN">Dine In</option>
              <option value="TAKEAWAY">Takeaway</option>
            </select>
          </div>
          <Input
            label="Discount"
            type="number"
            min="0"
            value={formData.discount}
            onChange={(e) =>
              setFormData({
                ...formData,
                discount: parseFloat(e.target.value) || 0,
              })
            }
            error={formErrors.discount}
            icon={<DollarSign size={18} />}
          />
        </div>
      </div>

      {/* Total Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span className="font-semibold">₹{calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Discount:</span>
            <span className="font-semibold">-₹{formData.discount.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold text-[#FF6B35]">
            <span>Total:</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onSubmit} loading={loading}>
          {mode === "create" ? "Create Bill" : "Update Bill"}
        </Button>
      </div>
    </div>
  );
};

// View Bill Details Component
const ViewBillDetails = ({ bill }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Bill Header */}
      <div className="text-center border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Bill Receipt</h2>
        <p className="text-sm text-gray-600 mt-1">
          Bill Number: <span className="font-semibold text-[#FF6B35]">{bill.billNumber}</span>
        </p>
        <p className="text-sm text-gray-600">
          Date: {new Date(bill.paidAt).toLocaleString()}
        </p>
      </div>

      {/* Customer Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Customer Details
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700">
            <span className="font-medium">Name:</span> {bill.customerDetails.name}
          </p>
          {bill.customerDetails.phone && (
            <p className="text-gray-700 mt-1">
              <span className="font-medium">Phone:</span> {bill.customerDetails.phone}
            </p>
          )}
        </div>
      </div>

      {/* Order Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Order Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Payment Method</p>
            <Badge variant={bill.paymentMethod === "CASH" ? "info" : "success"}>
              {bill.paymentMethod}
            </Badge>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Order Type</p>
            <Badge variant={bill.orderType === "DINE_IN" ? "warning" : "info"}>
              {bill.orderType}
            </Badge>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Items</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">
                  Item
                </th>
                <th className="text-center py-2 px-4 text-sm font-semibold text-gray-700">
                  Price
                </th>
                <th className="text-center py-2 px-4 text-sm font-semibold text-gray-700">
                  Quantity
                </th>
                <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="py-2 px-4">{item.foodName}</td>
                  <td className="py-2 px-4 text-center">₹{item.price}</td>
                  <td className="py-2 px-4 text-center">{item.quantity}</td>
                  <td className="py-2 px-4 text-right font-semibold">
                    ₹{item.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span className="font-semibold">₹{bill.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Discount:</span>
            <span className="font-semibold">-₹{bill.discount.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold text-[#FF6B35]">
            <span>Total Amount:</span>
            <span>₹{bill.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button onClick={handlePrint}>Print Bill</Button>
      </div>
    </div>
  );
};

export default BillManagementPage;
