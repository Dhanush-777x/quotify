import React, { useState, useEffect } from "react";

const CategoryManager = ({ currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Store the user being edited
  const [selectedCategory, setSelectedCategory] = useState("");

  // Hard-coded categories array
  const categories = [
    "art",
    "communication",
    "courage",
    "education",
    "family",
    "happiness",
    "health",
    "knowledge",
    "leadership",
    "money",
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://quotify-o02w.onrender.com/api/users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setSelectedCategory(user.quoteCategory || ""); // Default to the user's current category
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setSelectedCategory("");
  };

  const handleSaveCategory = async () => {
    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }

    try {
      const response = await fetch(
        `https://quotify-o02w.onrender.com/api/users/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            username: selectedUser.username,
            role: selectedUser.role,
            quoteCategory: selectedCategory,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user category");
      }

      const updatedUser = await response.json();
      setUsers((prev) =>
        prev.map((user) =>
          user._id === updatedUser._id
            ? { ...user, quoteCategory: selectedCategory }
            : user
        )
      );
      alert("Category updated successfully.");
      closeModal();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("quoteCategory");
    window.location.href = "/";
  };

  return (
    <div className="absolute text-white inset-0 -z-10 w-full items-center justify-center h-max px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_30%,#63e_100%)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Category Manager</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      {/* User List */}
      <div className="bg-white/10 rounded-lg backdrop-blur-lg p-10">
        <h3 className="text-xl font-medium mb-4">Users</h3>
        <div>
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between py-6 border-b border-gray-600"
              >
                <span>{user.username}</span>
                <button
                  onClick={() => openModal(user)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                >
                  Edit Category
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No users available</p>
          )}
        </div>
      </div>

      {/* Modal for Editing Category */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-medium mb-4">Edit Category</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent p-3 border border-white/30 rounded-md mb-4"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((category, index) => (
                <option key={index} value={category} className="bg-black">
                  {category}
                </option>
              ))}
            </select>
            <div className="flex justify-between">
              <button
                onClick={handleSaveCategory}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
