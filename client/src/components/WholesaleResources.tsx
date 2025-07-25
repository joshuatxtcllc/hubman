import { useState } from 'react';
import { ExternalLink, Download, Search, DollarSign, Package, Truck } from 'lucide-react';

const WholesaleResources = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const wholesalers = [
    {
      id: 1,
      name: "Larson Juhl",
      description: "Premium frame mouldings and professional framing supplies",
      website: "https://www.larsonjuhl.com",
      orderingPortal: "https://shop.larsonjuhl.com",
      catalogUrl: "/catalogs/larson-juhl-catalog.pdf",
      specialties: ["Premium Mouldings", "Custom Frames", "Conservation Materials"],
      logo: "🎯",
      gradient: "from-red-500 to-red-600",
      status: "Active Account"
    },
    {
      id: 2,
      name: "United Moulding",
      description: "Affordable frame mouldings and mat boards",
      website: "https://www.unitedmoulding.com",
      orderingPortal: "https://www.unitedmoulding.com/login",
      catalogUrl: "/catalogs/united-moulding-catalog.pdf",
      specialties: ["Standard Mouldings", "Mat Boards", "Bulk Orders"],
      logo: "🏢",
      gradient: "from-blue-500 to-blue-600",
      status: "Active Account"
    },
    {
      id: 3,
      name: "Framerica",
      description: "Contemporary and traditional frame styles",
      website: "https://www.framerica.com",
      orderingPortal: "https://www.framerica.com/dealer-login",
      catalogUrl: "/catalogs/framerica-catalog.pdf",
      specialties: ["Contemporary Frames", "Traditional Styles", "Quick Ship"],
      logo: "🖼️",
      gradient: "from-green-500 to-green-600",
      status: "Active Account"
    },
    {
      id: 4,
      name: "Roma Moulding",
      description: "Italian-inspired decorative frames and ornate styles",
      website: "https://www.romamoulding.com",
      orderingPortal: "https://www.romamoulding.com/dealer-portal",
      catalogUrl: "/catalogs/roma-moulding-catalog.pdf",
      specialties: ["Ornate Frames", "Italian Designs", "Decorative Elements"],
      logo: "🏛️",
      gradient: "from-purple-500 to-purple-600",
      status: "Active Account"
    },
    {
      id: 5,
      name: "Nielsen Bainbridge",
      description: "Professional matting and mounting supplies",
      website: "https://www.nielsen-bainbridge.com",
      orderingPortal: "https://www.nielsen-bainbridge.com/trade-login",
      catalogUrl: "/catalogs/nielsen-bainbridge-catalog.pdf",
      specialties: ["Mat Boards", "Mounting Supplies", "Preservation Materials"],
      logo: "📐",
      gradient: "from-yellow-500 to-yellow-600",
      status: "Active Account"
    },
    {
      id: 6,
      name: "Omega Moulding",
      description: "Budget-friendly frames and basic supplies",
      website: "https://www.omegamoulding.com",
      orderingPortal: "https://www.omegamoulding.com/dealer-access",
      catalogUrl: "/catalogs/omega-moulding-catalog.pdf",
      specialties: ["Budget Frames", "Basic Supplies", "Volume Discounts"],
      logo: "⭕",
      gradient: "from-orange-500 to-orange-600",
      status: "Active Account"
    }
  ];

  const quickAccessTools = [
    {
      title: "Price Comparison",
      description: "Compare prices across all wholesalers",
      icon: DollarSign,
      action: () => window.open('/tools/price-comparison', '_blank')
    },
    {
      title: "Inventory Check",
      description: "Check stock levels at all suppliers",
      icon: Package,
      action: () => window.open('/tools/inventory-check', '_blank')
    },
    {
      title: "Shipping Calculator",
      description: "Calculate shipping costs and delivery times",
      icon: Truck,
      action: () => window.open('/tools/shipping-calculator', '_blank')
    }
  ];

  const filteredWholesalers = wholesalers.filter(wholesaler =>
    wholesaler.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wholesaler.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Wholesale Resources</h2>
          <p className="text-slate-600">Access catalogs, pricing, and ordering portals</p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search wholesalers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Access Tools */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold mb-4 text-blue-900">Quick Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickAccessTools.map((tool, index) => (
            <div key={index} className="bg-white rounded-xl p-4 border border-blue-100 hover:shadow-lg transition-shadow cursor-pointer" onClick={tool.action}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <tool.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">{tool.title}</h4>
                  <p className="text-sm text-blue-700">{tool.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wholesaler Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWholesalers.map((wholesaler) => (
          <div key={wholesaler.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className={`bg-gradient-to-r ${wholesaler.gradient} p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{wholesaler.logo}</div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{wholesaler.name}</h3>
                    <span className="text-white/80 text-sm">{wholesaler.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-4">{wholesaler.description}</p>
              
              {/* Specialties */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Specialties:</h4>
                <div className="flex flex-wrap gap-2">
                  {wholesaler.specialties.map((specialty, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => window.open(wholesaler.catalogUrl, '_blank')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Catalog</span>
                </button>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => window.open(wholesaler.website, '_blank')}
                    className="flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Website</span>
                  </button>
                  
                  <button
                    onClick={() => window.open(wholesaler.orderingPortal, '_blank')}
                    className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                  >
                    <Package className="w-3 h-3" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Catalog Management */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Catalog Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-2">Current Catalogs</h4>
            <p className="text-sm text-gray-600 mb-3">All wholesaler catalogs are up to date as of January 2025</p>
            <div className="space-y-2">
              {wholesalers.slice(0, 3).map((wholesaler) => (
                <div key={wholesaler.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{wholesaler.name}</span>
                  <span className="text-green-600">✓ Current</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-2">Update Schedule</h4>
            <p className="text-sm text-gray-600 mb-3">Automatic updates for pricing and availability</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Pricing Updates</span>
                <span className="text-blue-600">Weekly</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">New Products</span>
                <span className="text-blue-600">Monthly</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Catalog Refresh</span>
                <span className="text-blue-600">Quarterly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WholesaleResources;