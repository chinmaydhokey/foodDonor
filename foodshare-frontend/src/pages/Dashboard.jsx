import { useEffect, useState } from "react";
import { Plus, Clock, MapPin, Tag, AlertTriangle, X, LogOut, Loader, MapPinIcon } from "lucide-react";

// Mock API service (assuming this would be replaced with actual implementation)
const API = {
  get: async (url) => {
    // This is a placeholder for demo purposes
    console.log(`GET request to ${url}`);
    
    // Return mock data for demonstration
    return {
      data: [
        {
          _id: "1",
          foodName: "Fresh Sandwiches",
          quantity: "20 boxes",
          status: "available",
          donorId: "user123",
          pickupTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          expiryTime: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
          location: {
            address: "123 Main St, Anytown",
            lat: 40.7128,
            lng: -74.006
          }
        },
        {
          _id: "2",
          foodName: "Rice and Curry",
          quantity: "5 kg",
          status: "available",
          donorId: "user456",
          pickupTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
          expiryTime: new Date(Date.now() + 172800000).toISOString(), // 48 hours from now
          location: {
            address: "456 Oak Ave, Somewhere",
            lat: 37.7749,
            lng: -122.4194
          }
        }
      ]
    };
  },
  post: async (url, data) => {
    // This is a placeholder for demo purposes
    console.log(`POST request to ${url}`, data);
    return { success: true };
  }
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [newListing, setNewListing] = useState({
    foodName: "",
    quantity: "",
    expiryTime: "",
    pickupTime: "",
    location: {
      address: "",
      lat: "",
      lng: ""
    }
  });

  useEffect(() => {
    // Simulate getting user from localStorage
    setTimeout(() => {
      const mockUser = {
        _id: "user123",
        name: "John Donor",
        role: "donor"
      };
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);

    // fetch listings
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/listings");
      setListings(res.data);
    } catch (err) {
      console.log("Error fetching listings", err);
      showNotification("Error fetching listings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (["address", "lat", "lng"].includes(name)) {
      setNewListing((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setNewListing((prev) => ({ ...prev, [name]: value }));
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const resetForm = () => {
    setNewListing({
      foodName: "",
      quantity: "",
      expiryTime: "",
      pickupTime: "",
      location: {
        address: "",
        lat: "",
        lng: ""
      }
    });
  };

  const handleLogout = () => {
    // Add animation before logout
    setIsLoading(true);
    
    // Simulate logout process
    setTimeout(() => {
      setUser(null);
      showNotification("You've been logged out successfully");
      
      // Simulate login again after 2 seconds (for demo purposes)
      setTimeout(() => {
        const mockUser = {
          _id: "user123",
          name: "John Donor",
          role: "donor"
        };
        setUser(mockUser);
        setIsLoading(false);
      }, 2000);
    }, 1000);
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      showNotification("Geolocation is not supported by your browser", "error");
      setIsGettingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update form with coordinates
        setNewListing(prev => ({
          ...prev,
          location: {
            ...prev.location,
            lat: latitude.toFixed(6),
            lng: longitude.toFixed(6)
          }
        }));
        
        showNotification("Location detected successfully!");
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        showNotification("Unable to retrieve your location. Please enter manually.", "error");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const payload = {
        ...newListing,
        donorId: user._id,
        location: {
          ...newListing.location,
          lat: parseFloat(newListing.location.lat),
          lng: parseFloat(newListing.location.lng)
        }
      };
      await API.post("/listings", payload);
      showNotification("Food listed successfully!");
      setIsFormOpen(false);
      resetForm();
      fetchListings();
    } catch (err) {
      console.log(err);
      showNotification("Error adding listing", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle user role for demo purposes
  const toggleRole = () => {
    if (user) {
      setUser(prev => ({
        ...prev,
        role: prev.role === "donor" ? "ngo" : "donor"
      }));
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300">
      {/* Notification */}
      {notification && (
        <div 
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center justify-between z-50 animate-slide-in transition-all ${
            notification.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4 text-gray-500 hover:text-gray-800">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md p-6 mb-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Welcome, {user?.name}
            </span>
            <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {user?.role}
            </span>
          </h2>
          
          <div className="flex items-center space-x-3">
            {/* Demo-only role toggle button */}
            <button 
              onClick={toggleRole} 
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
            >
              Switch to {user?.role === "donor" ? "NGO" : "Donor"} View
            </button>
            
            {/* Logout button */}
            <button 
              onClick={handleLogout} 
              className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded flex items-center transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 transition-all duration-300">
        {user?.role === "donor" && (
          <div className="mb-8">
            {!isFormOpen ? (
              <button 
                onClick={() => setIsFormOpen(true)} 
                className="group bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 flex items-center transform hover:scale-105"
              >
                <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Add New Food Listing
              </button>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-lg mb-6 transform animate-fade-in transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Add Food Listing</h3>
                  <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-red-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Food Name</label>
                      <input 
                        type="text" 
                        name="foodName" 
                        value={newListing.foodName}
                        placeholder="e.g., Sandwiches, Rice, etc."
                        onChange={handleInput} 
                        required 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Quantity</label>
                      <input 
                        type="text" 
                        name="quantity" 
                        value={newListing.quantity}
                        placeholder="e.g., 5kg, 10 boxes, etc." 
                        onChange={handleInput} 
                        required 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Expiry Time</label>
                      <input 
                        type="datetime-local" 
                        name="expiryTime" 
                        value={newListing.expiryTime}
                        onChange={handleInput} 
                        required 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Pickup Time</label>
                      <input 
                        type="datetime-local" 
                        name="pickupTime" 
                        value={newListing.pickupTime}
                        onChange={handleInput} 
                        required 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={newListing.location.address}
                      placeholder="Full address" 
                      onChange={handleInput} 
                      required 
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex justify-between">
                        <span>Latitude</span>
                        <button 
                          type="button"
                          onClick={getCurrentLocation}
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center transition-colors"
                        >
                          {isGettingLocation ? (
                            <>
                              <Loader size={12} className="mr-1 animate-spin" />
                              Getting location...
                            </>
                          ) : (
                            <>
                              <MapPinIcon size={12} className="mr-1" />
                              Use my current location
                            </>
                          )}
                        </button>
                      </label>
                      <input 
                        type="text" 
                        name="lat" 
                        value={newListing.location.lat}
                        placeholder="e.g., 40.7128" 
                        onChange={handleInput} 
                        required 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Longitude</label>
                      <input 
                        type="text" 
                        name="lng" 
                        value={newListing.location.lng}
                        placeholder="e.g., -74.0060" 
                        onChange={handleInput} 
                        required 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end space-x-3">
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsFormOpen(false);
                        resetForm();
                      }} 
                      className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-200"
                    >
                      Add Listing
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Your Listings</h3>
              
              {listings.filter((item) => item.donorId === user?._id).length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                  You haven't added any food listings yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {listings
                    .filter((item) => item.donorId === user?._id)
                    .map((item, index) => (
                      <div 
                        key={item._id} 
                        className="bg-white rounded-lg shadow-md overflow-hidden transform hover:shadow-lg transition-all duration-300 hover:translate-y-1 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="p-5 border-b">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-lg text-gray-800">{item.foodName}</h4>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              item.status === "available" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                        <div className="p-5 space-y-2">
                          <div className="flex items-start">
                            <Tag size={16} className="text-gray-500 mr-2 mt-1" />
                            <span>{item.quantity}</span>
                          </div>
                          <div className="flex items-start">
                            <MapPin size={16} className="text-gray-500 mr-2 mt-1" />
                            <span className="text-sm text-gray-700">{item.location.address}</span>
                          </div>
                          <div className="flex items-start">
                            <Clock size={16} className="text-gray-500 mr-2 mt-1" />
                            <span className="text-sm text-gray-700">
                              Pickup: {new Date(item.pickupTime).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <AlertTriangle size={16} className="text-amber-500 mr-2 mt-1" />
                            <span className="text-sm text-amber-700">
                              Expires: {new Date(item.expiryTime).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {user?.role === "ngo" && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Available Food Listings</h3>
            
            {listings.filter((item) => item.status === "available").length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                No food listings available at the moment. Check back later!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings
                  .filter((item) => item.status === "available")
                  .map((item, index) => (
                    <div 
                      key={item._id} 
                      className="bg-white rounded-lg shadow-md overflow-hidden transform hover:translate-y-1 hover:shadow-lg transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="h-3 bg-gradient-to-r from-green-400 to-blue-500"></div>
                      <div className="p-5">
                        <h4 className="font-bold text-xl text-gray-800 mb-2">{item.foodName}</h4>
                        <div className="text-sm font-medium text-green-700 bg-green-100 rounded-full inline-block px-3 py-1 mb-3">
                          {item.quantity}
                        </div>
                        
                        <div className="space-y-3 mt-4">
                          <div className="flex items-start">
                            <MapPin size={18} className="text-gray-500 mr-2 mt-1" />
                            <span className="text-gray-700">{item.location.address}</span>
                          </div>
                          <div className="flex items-start">
                            <Clock size={18} className="text-gray-500 mr-2 mt-1" />
                            <div>
                              <div className="text-gray-700">
                                Pickup: <span className="font-medium">{new Date(item.pickupTime).toLocaleString()}</span>
                              </div>
                              <div className="text-amber-600 text-sm mt-1">
                                Expires: {new Date(item.expiryTime).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-5 pt-4 border-t border-gray-100">
                          <button 
                            onClick={() => showNotification("Pickup requested successfully!")}
                            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm hover:shadow transform hover:scale-105 duration-200"
                          >
                            Request Pickup
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}