import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Star, 
  StarHalf,
  ShoppingBag,
  Package,
  TrendingUp,
  Heart,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Minus,
  ShieldCheck
} from 'lucide-react';
import { Product, ProductCategory, CartItem } from '../../types/marketplace';
import DemoLayout from '../components/layout/DemoLayout';

// Mock data based on treatment plan materials
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Advanced Hydrocolloid Wound Dressing',
    description: 'Premium hydrocolloid dressing for moderate to heavily exuding wounds. Promotes moist wound healing and provides bacterial barrier.',
    price: 24.99,
    currency: 'USD',
    category: ProductCategory.DRESSING,
    imageUrl: '/modern/wound-dressing-1.jpg',
    vendor: {
      id: 'vendor-001',
      name: 'MedSupply Pro',
      description: 'Professional medical supplies',
      rating: 4.8,
      reviewCount: 2453,
      verifiedSeller: true,
      location: 'USA'
    },
    inStock: true,
    stockQuantity: 145,
    rating: 4.7,
    reviewCount: 328,
    tags: ['wound care', 'hydrocolloid', 'professional grade'],
    isPrescriptionRequired: false,
    isFeatured: true,
    specifications: {
      'Size': '4" x 4" (10cm x 10cm)',
      'Pack Size': '10 dressings',
      'Material': 'Hydrocolloid with adhesive border',
      'Waterproof': 'Yes'
    }
  },
  {
    id: 'prod-002',
    name: 'Medical Grade Sterile Gauze Pads',
    description: 'High-absorbency sterile gauze pads for wound cleaning and dressing. Individually wrapped for maximum sterility.',
    price: 12.99,
    currency: 'USD',
    category: ProductCategory.DRESSING,
    imageUrl: '/modern/gauze-pads.jpg',
    vendor: {
      id: 'vendor-001',
      name: 'MedSupply Pro',
      description: 'Professional medical supplies',
      rating: 4.8,
      reviewCount: 2453,
      verifiedSeller: true,
      location: 'USA'
    },
    inStock: true,
    stockQuantity: 523,
    rating: 4.6,
    reviewCount: 892,
    tags: ['gauze', 'sterile', 'wound care'],
    isPrescriptionRequired: false,
    specifications: {
      'Size': '4" x 4"',
      'Pack Size': '50 pads',
      'Sterility': 'Individually wrapped',
      'Ply': '12-ply'
    }
  },
  {
    id: 'prod-003',
    name: 'Betadine Antiseptic Solution 10%',
    description: 'Povidone-iodine antiseptic solution for wound cleansing and infection prevention. Broad-spectrum antimicrobial action.',
    price: 15.99,
    currency: 'USD',
    category: ProductCategory.ANTISEPTIC,
    imageUrl: '/modern/antiseptic.jpg',
    vendor: {
      id: 'vendor-002',
      name: 'PharmaDirect',
      description: 'Trusted pharmaceutical supplier',
      rating: 4.9,
      reviewCount: 5672,
      verifiedSeller: true,
      location: 'USA'
    },
    inStock: true,
    stockQuantity: 234,
    rating: 4.8,
    reviewCount: 1245,
    tags: ['antiseptic', 'betadine', 'infection prevention'],
    isPrescriptionRequired: false,
    warnings: ['For external use only', 'May cause skin irritation in sensitive individuals'],
    specifications: {
      'Active Ingredient': 'Povidone-iodine 10%',
      'Volume': '16 oz (473ml)',
      'Form': 'Topical solution'
    }
  },
  {
    id: 'prod-004',
    name: 'Silver Alginate Wound Dressing',
    description: 'Advanced silver-infused alginate dressing with antimicrobial properties. Ideal for infected or high-risk wounds.',
    price: 34.99,
    currency: 'USD',
    category: ProductCategory.DRESSING,
    imageUrl: '/modern/silver-dressing.jpg',
    vendor: {
      id: 'vendor-003',
      name: 'WoundCare Innovations',
      description: 'Advanced wound care solutions',
      rating: 4.7,
      reviewCount: 1823,
      verifiedSeller: true,
      location: 'USA'
    },
    inStock: true,
    stockQuantity: 67,
    rating: 4.9,
    reviewCount: 456,
    tags: ['silver', 'antimicrobial', 'advanced wound care'],
    isPrescriptionRequired: false,
    isFeatured: true,
    discount: {
      percentage: 15,
      validUntil: '2025-11-30'
    },
    specifications: {
      'Size': '4" x 4"',
      'Pack Size': '5 dressings',
      'Silver Content': 'Ionic silver',
      'Exudate Management': 'High'
    }
  },
  {
    id: 'prod-005',
    name: 'Neosporin Triple Antibiotic Ointment',
    description: 'First aid antibiotic ointment with neomycin, polymyxin B, and bacitracin. Prevents infection in minor cuts and burns.',
    price: 8.99,
    currency: 'USD',
    category: ProductCategory.ANTIBIOTIC,
    imageUrl: '/modern/antibiotic-ointment.jpg',
    vendor: {
      id: 'vendor-002',
      name: 'PharmaDirect',
      description: 'Trusted pharmaceutical supplier',
      rating: 4.9,
      reviewCount: 5672,
      verifiedSeller: true,
      location: 'USA'
    },
    inStock: true,
    stockQuantity: 412,
    rating: 4.7,
    reviewCount: 3421,
    tags: ['antibiotic', 'ointment', 'infection prevention'],
    isPrescriptionRequired: false,
    specifications: {
      'Size': '1 oz (28g)',
      'Active Ingredients': 'Neomycin, Polymyxin B, Bacitracin',
      'Form': 'Topical ointment'
    }
  },
  {
    id: 'prod-006',
    name: 'Elastic Compression Bandage',
    description: 'High-quality elastic bandage for wound support and compression. Washable and reusable.',
    price: 6.99,
    currency: 'USD',
    category: ProductCategory.BANDAGE,
    imageUrl: '/modern/compression-bandage.jpg',
    vendor: {
      id: 'vendor-001',
      name: 'MedSupply Pro',
      description: 'Professional medical supplies',
      rating: 4.8,
      reviewCount: 2453,
      verifiedSeller: true,
      location: 'USA'
    },
    inStock: true,
    stockQuantity: 678,
    rating: 4.5,
    reviewCount: 567,
    tags: ['bandage', 'compression', 'elastic'],
    isPrescriptionRequired: false,
    specifications: {
      'Width': '3 inches',
      'Length': '5 yards',
      'Material': 'Cotton/Polyester blend',
      'Washable': 'Yes'
    }
  },
  {
    id: 'prod-007',
    name: 'Medicated Pain Relief Cream',
    description: 'Fast-acting topical pain relief with lidocaine. Reduces pain and discomfort from wounds and injuries.',
    price: 14.99,
    currency: 'USD',
    category: ProductCategory.PAIN_RELIEF,
    imageUrl: '/modern/pain-relief.jpg',
    vendor: {
      id: 'vendor-002',
      name: 'PharmaDirect',
      description: 'Trusted pharmaceutical supplier',
      rating: 4.9,
      reviewCount: 5672,
      verifiedSeller: true,
      location: 'USA'
    },
    inStock: true,
    stockQuantity: 189,
    rating: 4.6,
    reviewCount: 743,
    tags: ['pain relief', 'lidocaine', 'topical'],
    isPrescriptionRequired: false,
    warnings: ['For external use only', 'Do not use on deep wounds'],
    specifications: {
      'Active Ingredient': 'Lidocaine 4%',
      'Size': '2 oz (57g)',
      'Form': 'Topical cream'
    }
  },
  {
    id: 'prod-008',
    name: 'Sterile Saline Wound Wash',
    description: 'Sterile saline solution for gentle wound irrigation and cleansing. Preservative-free formula.',
    price: 9.99,
    currency: 'USD',
    category: ProductCategory.CLEANING,
    imageUrl: '/modern/saline-wash.jpg',
    vendor: {
      id: 'vendor-001',
      name: 'MedSupply Pro',
      description: 'Professional medical supplies',
      rating: 4.8,
      reviewCount: 2453,
      verifiedSeller: true,
      location: 'USA'
    },
    inStock: true,
    stockQuantity: 345,
    rating: 4.8,
    reviewCount: 621,
    tags: ['saline', 'wound wash', 'sterile'],
    isPrescriptionRequired: false,
    isFeatured: true,
    specifications: {
      'Volume': '12 oz (355ml)',
      'Solution': '0.9% Sodium Chloride',
      'Sterility': 'Sterile',
      'Preservatives': 'None'
    }
  }
];

const Marketplace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'ALL'>('ALL');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchQuery, selectedCategory, priceRange]);

  // Cart management
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  return (
    <DemoLayout>
      <div className="min-h-screen bg-gray-50 -m-4 lg:-m-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">DermaIQ Marketplace</h1>
                  <p className="text-sm text-gray-600">Medical supplies for your wound care needs</p>
                </div>
              </div>
            
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for medical supplies, medications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <Filter className="w-5 h-5 text-gray-400" />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedCategory === 'ALL'}
                      onChange={() => setSelectedCategory('ALL')}
                      className="mr-2"
                    />
                    <span className="text-sm">All Products</span>
                  </label>
                  {Object.values(ProductCategory).map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="mr-2"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Featured Badge */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Featured Products</p>
                    <p className="text-xs text-blue-700 mt-1">Handpicked for quality and efficacy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredProducts.length}</span> products
              </p>
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-20 h-20 text-gray-300" />
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-2">
                      {product.isFeatured && (
                        <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                      {product.discount && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          -{product.discount.percentage}%
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          wishlist.has(product.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Vendor */}
                    <div className="flex items-center space-x-1 mb-2">
                      {product.vendor.verifiedSeller && (
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-xs text-gray-600">{product.vendor.name}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-3">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-600 ml-2">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        {product.discount ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-gray-900">
                              ${(product.price * (1 - product.discount.percentage / 100)).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {product.inStock ? (
                        <span className="flex items-center text-xs text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          In Stock
                        </span>
                      ) : (
                        <span className="flex items-center text-xs text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Prescription Required */}
                    {product.isPrescriptionRequired && (
                      <div className="mb-3 flex items-center space-x-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        <AlertCircle className="w-3 h-3" />
                        <span>Prescription Required</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shopping Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex gap-4 pb-4 border-b border-gray-200">
                      <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <Package className="w-10 h-10 text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{item.product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.product.vendor.name}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">
                            ${item.product.price.toFixed(2)}
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 rounded border border-gray-300 hover:bg-gray-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 rounded border border-gray-300 hover:bg-gray-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-32 h-32 text-gray-300" />
                </div>

                <div>
                  <div className="mb-4">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded">
                      {selectedProduct.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 mb-4">
                    {renderStars(selectedProduct.rating)}
                    <span className="text-sm text-gray-600 ml-2">
                      ({selectedProduct.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-6">{selectedProduct.description}</p>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                    <div className="space-y-2">
                      {selectedProduct.specifications &&
                        Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600">{key}:</span>
                            <span className="font-medium text-gray-900">{value}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {selectedProduct.warnings && selectedProduct.warnings.length > 0 && (
                    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-900 mb-2">Warnings</h4>
                          <ul className="text-sm text-yellow-800 space-y-1">
                            {selectedProduct.warnings.map((warning, index) => (
                              <li key={index}>• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Vendor Information</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      {selectedProduct.vendor.verifiedSeller && (
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                      )}
                      <span className="font-medium">{selectedProduct.vendor.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{selectedProduct.vendor.description}</p>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={!selectedProduct.inStock}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </DemoLayout>
  );
};

export default Marketplace;
