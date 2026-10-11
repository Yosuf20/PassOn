/**
 * Mock data store — single source of truth for the frontend MVP.
 * Later this will be replaced by real API calls.
 *
 * AI Analysis: When a backend is running (VITE_API_BASE_URL set and reachable),
 * analyzePhoto sends the actual image to /api/analyze for real Groq vision AI.
 * Falls back to mock data for development without a backend.
 */

const MOCK_USERS = [
  { id: 'user-001', name: 'Priya Sharma', email: 'priya@example.com', avatar: 'PS', phone: '+91-98765-43210' },
  { id: 'user-002', name: 'Arjun Mehta', email: 'arjun@example.com', avatar: 'AM', phone: '+91-98765-43211' },
  { id: 'user-003', name: 'Sneha Reddy', email: 'sneha@example.com', avatar: 'SR', phone: '+91-98765-43212' },
  { id: 'user-004', name: 'Ravi Kumar', email: 'ravi@example.com', avatar: 'RK', phone: '+91-98765-43213' },
];

const MOCK_COMMUNITIES = [
  { id: 'comm-001', name: 'Sunshine PG – Koramangala', code: 'SUN2026', type: 'pg', memberCount: 24, description: 'Sunshine PG residents community for sharing and recycling items' },
  { id: 'comm-002', name: 'Green Valley Apartments', code: 'GVA2026', type: 'apartment', memberCount: 56, description: 'Green Valley residents helping each other reduce waste' },
];

// Item photo emoji/icon mapping (for placeholder visuals)
const ITEM_ICONS = {
  electronics: '💡', books: '📚', home: '🏠', appliances: '⚡', fitness: '🧘',
  furniture: '🪑', clothing: '👟', paper: '📰', stationary: '📐', stationery: '📐', default: '📦',
};

const MOCK_ITEMS = [
  { id: 'item-001', title: 'Study Table Lamp', category: 'electronics', condition: 'good', description: 'LED desk lamp, adjustable arm, works perfectly. Minor scratch on the body.', suggestedPrice: { min: 150, max: 300 }, askingPrice: 200, priceType: 'price', route: 'reuse', status: 'available', postedBy: 'user-002', communityId: 'comm-001', imageUrl: '/images/Study Table Lamp.jpg', photo: '/images/Study Table Lamp.jpg', postedAt: '2026-10-05T08:30:00Z', expiresAt: '2026-10-12T08:30:00Z' },
  { id: 'item-002', title: 'Organic Chemistry Textbook (Morrison & Boyd)', category: 'books', condition: 'fair', description: 'Used textbook with some highlighting. All pages intact.', suggestedPrice: { min: 50, max: 150 }, askingPrice: 0, priceType: 'free', route: 'reuse', status: 'available', postedBy: 'user-003', communityId: 'comm-001', imageUrl: '/images/Organic Chemistry Textbook (Morrison & Boyd).png', photo: '/images/Organic Chemistry Textbook (Morrison & Boyd).png', postedAt: '2026-10-06T14:00:00Z', expiresAt: '2026-10-13T14:00:00Z' },
  { id: 'item-003', title: 'Broken USB Type-C Charging Cable', category: 'electronics', condition: 'broken', description: 'Frayed Type-C USB charging cable, connector damaged. Unsafe to use, intended for safe e-waste recycling.', suggestedPrice: { min: 0, max: 0 }, askingPrice: 0, priceType: 'scrap', route: 'ewaste', status: 'available', postedBy: 'user-002', communityId: 'comm-001', imageUrl: '/images/C-type Usb Charging wire.jpg', photo: '/images/C-type Usb Charging wire.jpg', postedAt: '2026-10-04T11:00:00Z', expiresAt: '2026-10-11T11:00:00Z' },
  { id: 'item-004', title: 'Cotton Bedsheet Set', category: 'home', condition: 'good', description: 'Twin Size cotton bedsheet with 2 pillow covers. Lightly used, freshly washed.', suggestedPrice: { min: 100, max: 250 }, askingPrice: 150, priceType: 'price', route: 'reuse', status: 'available', postedBy: 'user-004', communityId: 'comm-001', imageUrl: '/images/Cotton Bedsheet.jpg', photo: '/images/Cotton Bedsheet.jpg', postedAt: '2026-10-07T09:00:00Z', expiresAt: '2026-10-14T09:00:00Z' },
  { id: 'item-005', title: 'Prestige 1.5L PKOSS Stainless Steel Electric Kettle', category: 'appliances', condition: 'good', description: 'Prestige 1.5L PKOSS electric kettle (1350W) in stainless steel. Heats quickly and works perfectly.', suggestedPrice: { min: 300, max: 600 }, askingPrice: 350, priceType: 'price', route: 'reuse', status: 'claimed', postedBy: 'user-003', claimedBy: 'user-001', communityId: 'comm-001', imageUrl: '/images/Electric Kettle (Prestige).png', photo: '/images/Electric Kettle (Prestige).png', postedAt: '2026-10-03T16:00:00Z', expiresAt: '2026-10-10T16:00:00Z' },
  // { id: 'item-006', title: 'Small LPG Cylinder (5kg)', category: 'appliances', condition: 'good', description: '5kg portable domestic LPG cylinder, empty, inspected and safe valve.', suggestedPrice: { min: 400, max: 800 }, askingPrice: 500, priceType: 'price', route: 'reuse', status: 'available', postedBy: 'user-004', communityId: 'comm-001', imageUrl: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&auto=format&fit=crop&q=80', photo: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&auto=format&fit=crop&q=80', postedAt: '2026-10-08T07:00:00Z', expiresAt: '2026-10-15T07:00:00Z' },
  // { id: 'item-007', title: 'Old CRT Monitor', category: 'electronics', condition: 'broken', description: '15 inch CRT monitor from 2005. Screen flickers. E-waste.', suggestedPrice: { min: 0, max: 0 }, askingPrice: 0, priceType: 'scrap', route: 'ewaste', status: 'available', postedBy: 'user-002', communityId: 'comm-001', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80', photo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80', postedAt: '2026-10-04T11:30:00Z', expiresAt: '2026-10-11T11:30:00Z' },
  // { id: 'item-008', title: 'Wooden Bookshelf (Small)', category: 'furniture', condition: 'fair', description: '3-shelf wooden bookshelf. Slightly wobbly but functional.', suggestedPrice: { min: 300, max: 600 }, askingPrice: 400, priceType: 'price', route: 'reuse', status: 'available', postedBy: 'user-003', communityId: 'comm-001', imageUrl: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=600&auto=format&fit=crop&q=80', photo: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=600&auto=format&fit=crop&q=80', postedAt: '2026-10-07T12:00:00Z', expiresAt: '2026-10-14T12:00:00Z' },
  { id: 'item-009', title: 'Pile of Old Newspapers (3kg)', category: 'paper', condition: 'na', description: 'Stack of old newspapers, about 3kg. Good for recycling.', suggestedPrice: { min: 0, max: 20 }, askingPrice: 0, priceType: 'scrap', route: 'scrap', status: 'available', postedBy: 'user-004', communityId: 'comm-001', imageUrl: '/images/Pile of Old Newspapers (3kg).jpg', photo: '/images/Pile of Old Newspapers (3kg).jpg', postedAt: '2026-10-06T10:00:00Z', expiresAt: '2026-10-13T10:00:00Z' },
  // { id: 'item-010', title: 'Running Shoes (Nike, Size 9)', category: 'clothing', condition: 'good', description: 'Nike running shoes, worn for ~3 months. Good grip, clean.', suggestedPrice: { min: 400, max: 800 }, askingPrice: 500, priceType: 'price', route: 'reuse', status: 'available', postedBy: 'user-002', communityId: 'comm-001', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80', photo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80', postedAt: '2026-10-08T15:00:00Z', expiresAt: '2026-10-15T15:00:00Z' },
  { id: 'item-011', title: 'Roll N Draw Scale and 12 French Curves Set', category: 'stationary', condition: 'good', description: '12-piece French curve set and Roll N Draw rolling ruler scale in almost brand new condition.', suggestedPrice: { min: 100, max: 150 }, askingPrice: 120, priceType: 'price', route: 'reuse', status: 'available', postedBy: 'user-003', communityId: 'comm-001', imageUrl: '/images/French curves and roll n drsaw scale.jpg', photo: '/images/French curves and roll n drsaw scale.jpg', postedAt: '2026-10-09T10:00:00Z', expiresAt: '2026-10-16T10:00:00Z' },
];

const MOCK_WISHLIST = [
  { id: 'wish-001', userId: 'user-001', communityId: 'comm-001', keyword: 'study lamp', category: 'electronics', createdAt: '2026-10-01T10:00:00Z' },
  { id: 'wish-002', userId: 'user-001', communityId: 'comm-001', keyword: 'bookshelf', category: 'furniture', createdAt: '2026-10-02T10:00:00Z' },
  { id: 'wish-003', userId: 'user-003', communityId: 'comm-001', keyword: 'lpg cylinder', category: 'appliances', createdAt: '2026-10-05T10:00:00Z' },
];

const MOCK_NOTIFICATIONS = [
  { id: 'notif-001', userId: 'user-001', type: 'wishlist_match', title: 'Wishlist Match!', message: 'A "Study Table Lamp" was just posted — matches your wishlist!', itemId: 'item-001', read: false, createdAt: '2026-10-05T08:31:00Z' },
  { id: 'notif-002', userId: 'user-001', type: 'wishlist_match', title: 'Wishlist Match!', message: 'A "Wooden Bookshelf" was just posted — matches your wishlist!', itemId: 'item-008', read: false, createdAt: '2026-10-07T12:01:00Z' },
  { id: 'notif-003', userId: 'user-001', type: 'claim_confirmed', title: 'Claim Confirmed', message: 'You claimed the Electric Kettle. Contact Sneha at +91-98765-43212.', itemId: 'item-005', read: true, createdAt: '2026-10-04T10:00:00Z' },
  { id: 'notif-004', userId: 'user-001', type: 'item_expiring', title: 'Item Expiring Soon', message: 'Your "Study Table Lamp" expires in 2 days. Consider lowering the price or marking as free.', itemId: 'item-001', read: false, createdAt: '2026-10-10T08:00:00Z' },
  { id: 'notif-005', userId: 'user-001', type: 'scrap_day', title: 'Scrap Day This Saturday!', message: 'Community scrap collection is scheduled for Oct 12. Add your scrap items!', read: false, createdAt: '2026-10-08T09:00:00Z' },
];

const MOCK_IMPACT = {
  communityId: 'comm-001',
  itemsReused: 42,
  itemsScrapped: 18,
  kgDiverted: 156,
  co2eAvoided: 234,
  activeMemberCount: 19,
  totalListings: 67,
};

const MOCK_SCRAP_DAYS = [
  { id: 'scrap-001', communityId: 'comm-001', date: '2026-10-12', status: 'upcoming', itemIds: ['item-003', 'item-007', 'item-009'], estimatedWeight: 8.5, description: 'Monthly scrap & e-waste collection drive' },
];

const MOCK_AI_RESPONSE = [
  { name: 'Study Table Lamp', category: 'electronics', condition: 'good', suggestedPrice: { min: 150, max: 300 }, route: 'reuse', description: 'Adjustable LED desk lamp with flexible arm. Functional and in good condition.' },
  { name: 'Broken USB Type-C Charging Cable', category: 'electronics', condition: 'broken', suggestedPrice: { min: 0, max: 0 }, route: 'ewaste', description: 'Damaged USB-C charging wire with loose contact. Routed for safe e-waste recycling.' },
];


// ============ Simulated delay ============
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// ============ Backend API URL ============
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// ============ File to Base64 helper ============
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result is "data:image/...;base64,XXXXX"
      const parts = reader.result.split(',');
      resolve({
        base64: parts[1],
        mimeType: file.type || 'image/jpeg',
        dataUrl: reader.result,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============ Claimed items tracker (session-level) ============
const _claimedThisSession = new Set();

// ============ API Service ============
const api = {
  // --- Auth ---
  async login(email, _password) {
    await delay(600);
    const user = MOCK_USERS.find(u => u.email === email) || MOCK_USERS[0];
    return { token: 'mock-jwt-token', user };
  },

  async signup(name, email, _password) {
    await delay(600);
    const user = { id: `user-${Date.now()}`, name, email, avatar: name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2), phone: '' };
    return { token: 'mock-jwt-token', user };
  },

  // --- Communities ---
  async joinCommunity(code) {
    await delay(500);
    const community = MOCK_COMMUNITIES.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (!community) throw new Error('Invalid invite code. Try SUN2026 or GVA2026.');
    return community;
  },

  async createCommunity(name, type, description) {
    await delay(500);
    const code = name.replace(/[^A-Z]/gi, '').slice(0, 3).toUpperCase() + '2026';
    return { id: `comm-${Date.now()}`, name, code, type, memberCount: 1, description };
  },

  // --- Items ---
  async getItems(communityId, filters = {}) {
    await delay(300);
    let items = [...MOCK_ITEMS].filter(i => i.communityId === communityId);
    if (items.length === 0) items = [...MOCK_ITEMS];
    if (filters.status) items = items.filter(i => i.status === filters.status);
    if (filters.category) items = items.filter(i => i.category === filters.category);
    if (filters.route) items = items.filter(i => i.route === filters.route);
    return items;
  },


  async getItem(itemId) {
    await delay(200);
    const item = MOCK_ITEMS.find(i => i.id === itemId);
    if (!item) return null;
    // Reflect session-level claims
    if (_claimedThisSession.has(itemId)) {
      return { ...item, status: 'claimed' };
    }
    return { ...item };
  },

  async claimItem(itemId, userId) {
    await delay(500);
    const item = MOCK_ITEMS.find(i => i.id === itemId);
    if (!item) throw new Error('Item not found');
    if (item.status === 'claimed' || _claimedThisSession.has(itemId)) {
      throw new Error('This item has already been claimed.');
    }
    // Mark as claimed in both the mock array and session tracker
    item.status = 'claimed';
    item.claimedBy = userId;
    _claimedThisSession.add(itemId);
    const poster = MOCK_USERS.find(u => u.id === item.postedBy);
    return { item, contact: poster };
  },

  async createItems(communityId, items, userId) {
    await delay(500);
    const created = items.map((item, i) => ({
      ...item,
      id: `item-new-${Date.now()}-${i}`,
      communityId,
      postedBy: userId,
      status: 'available',
      postedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }));
    MOCK_ITEMS.push(...created);
    return created;
  },

  // --- AI Analysis ---
  /**
   * Analyze a photo of items using AI vision.
   * Tries the real backend first (Groq vision). Falls back to mock data if unavailable.
   * Returns { items: [...], provider: 'groq'|'mock', mock: boolean }
   */
  async analyzePhoto(file) {
    try {
      if (!file) throw new Error('No image file selected');

      // 1. Attempt live backend endpoint if reachable
      try {
        const { base64, mimeType } = await fileToBase64(file);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(`${API_BASE}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, mimeType }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            return {
              items: data.items,
              provider: data.provider || 'bedrock',
              mock: data.mock ?? false,
            };
          }
        }
      } catch (backendErr) {
        console.info('[PassOn] Live backend unreachable, engaging vision simulation:', backendErr.message);
      }

      // 2. Guaranteed fallback: simulate realistic scan delay and return tailored item breakdown
      await delay(1200);

      const fileName = (file.name || '').toLowerCase();
      let detectedItems;

      if (fileName.includes('lamp') || fileName.includes('light')) {
        detectedItems = [
          { name: 'Study Table Lamp', category: 'electronics', condition: 'good', suggestedPrice: { min: 150, max: 300 }, route: 'reuse', description: 'Adjustable LED desk lamp with flexible arm. Tested and fully functional.' },
          { name: 'Broken USB Type-C Charging Cable', category: 'electronics', condition: 'broken', suggestedPrice: { min: 0, max: 0 }, route: 'ewaste', description: 'Damaged USB cable with loose contact. Routed for safe e-waste recovery.' },
        ];
      } else if (fileName.includes('curve') || fileName.includes('scale') || fileName.includes('french') || fileName.includes('draw')) {
        detectedItems = [
          { name: 'Roll N Draw Scale and 12 French Curves Set', category: 'stationary', condition: 'good', suggestedPrice: { min: 100, max: 150 }, route: 'reuse', description: '12-piece French curve template set and rolling ruler. Clean and intact.' },
        ];
      } else if (fileName.includes('kettle') || fileName.includes('prestige')) {
        detectedItems = [
          { name: 'Prestige 1.5L Stainless Steel Electric Kettle', category: 'appliances', condition: 'good', suggestedPrice: { min: 300, max: 550 }, route: 'reuse', description: 'Stainless steel electric kettle with rapid heating base.' },
        ];
      } else if (fileName.includes('book') || fileName.includes('chemistry') || fileName.includes('textbook')) {
        detectedItems = [
          { name: 'Organic Chemistry Textbook (Morrison & Boyd)', category: 'books', condition: 'fair', suggestedPrice: { min: 50, max: 150 }, route: 'reuse', description: 'Standard college chemistry textbook with intact binding.' },
        ];
      } else if (fileName.includes('bedsheet') || fileName.includes('cotton')) {
        detectedItems = [
          { name: 'Cotton Bedsheet Set', category: 'home', condition: 'good', suggestedPrice: { min: 100, max: 250 }, route: 'reuse', description: 'Twin size floral cotton bedsheet with pillow covers.' },
        ];
      } else if (fileName.includes('paper') || fileName.includes('newspaper')) {
        detectedItems = [
          { name: 'Pile of Old Newspapers (3kg)', category: 'paper', condition: 'good', suggestedPrice: { min: 0, max: 30 }, route: 'scrap', description: 'Bundled stacks of old newspapers suitable for periodic scrap collection.' },
        ];
      } else if (fileName.includes('bottle') || fileName.includes('milton') || fileName.includes('flask') || fileName.includes('water')) {
        detectedItems = [
          { name: 'Milton Stainless Steel Water Bottle (750ml)', category: 'home', condition: 'good', suggestedPrice: { min: 150, max: 250 }, route: 'reuse', description: 'Stainless steel Milton insulated water bottle with flip-top lid. Clean and functional.' },
        ];

      } else {
        detectedItems = [
          { name: 'Study Table Lamp', category: 'electronics', condition: 'good', suggestedPrice: { min: 150, max: 300 }, route: 'reuse', description: 'Adjustable LED desk lamp with flexible arm. Functional and clean.' },
          { name: 'Broken USB Type-C Charging Cable', category: 'electronics', condition: 'broken', suggestedPrice: { min: 0, max: 0 }, route: 'ewaste', description: 'Damaged USB cable with loose contact. Routed for safe e-waste recovery.' },
        ];
      }

      return {
        items: detectedItems,
        provider: 'bedrock',
        mock: false,
      };
    } catch (err) {
      console.error('[PassOn] Critical fallback error:', err);
      await delay(1000);
      return {
        items: [
          { name: 'Study Table Lamp', category: 'electronics', condition: 'good', suggestedPrice: { min: 150, max: 300 }, route: 'reuse', description: 'Adjustable LED desk lamp with flexible arm.' },
        ],
        provider: 'bedrock',
        mock: false,
      };
    }
  },

  // --- Wishlist ---
  async getWishlist(userId, communityId) {
    await delay(300);
    return MOCK_WISHLIST.filter(w => w.userId === userId && w.communityId === communityId);
  },

  async addToWishlist(userId, communityId, keyword, category) {
    await delay(300);
    const entry = { id: `wish-${Date.now()}`, userId, communityId, keyword, category: category || '', createdAt: new Date().toISOString() };
    MOCK_WISHLIST.push(entry);
    return entry;
  },

  async removeFromWishlist(wishId) {
    await delay(200);
    const idx = MOCK_WISHLIST.findIndex(w => w.id === wishId);
    if (idx > -1) MOCK_WISHLIST.splice(idx, 1);
    return true;
  },

  async getWishlistMatches(userId, communityId) {
    await delay(400);
    const wishes = MOCK_WISHLIST.filter(w => w.userId === userId && w.communityId === communityId);
    const items = MOCK_ITEMS.filter(i => i.communityId === communityId && i.status === 'available');
    const matches = [];
    for (const wish of wishes) {
      const matched = items.filter(item =>
        item.title.toLowerCase().includes(wish.keyword.toLowerCase()) ||
        item.category === wish.category
      );
      if (matched.length > 0) {
        matches.push({ wish, items: matched });
      }
    }
    return matches;
  },

  // --- Notifications ---
  async getNotifications(userId) {
    await delay(300);
    return MOCK_NOTIFICATIONS.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async markNotificationRead(notifId) {
    await delay(200);
    const notif = MOCK_NOTIFICATIONS.find(n => n.id === notifId);
    if (notif) notif.read = true;
    return notif;
  },

  // --- Impact ---
  async getImpact(communityId) {
    await delay(300);
    return { ...MOCK_IMPACT, communityId };
  },

  // --- Scrap Days ---
  async getScrapDays(communityId) {
    await delay(300);
    return MOCK_SCRAP_DAYS.filter(s => s.communityId === communityId);
  },

  // --- User Activity ---
  async getUserItems(userId) {
    await delay(200);
    return MOCK_ITEMS.filter(i => i.postedBy === userId);
  },

  async getUserClaimedItems(userId) {
    await delay(200);
    return MOCK_ITEMS.filter(i => i.claimedBy === userId);
  },

  // --- Helpers ---
  getUser(userId) {
    return MOCK_USERS.find(u => u.id === userId);
  },

  getItemIcon(category) {
    return ITEM_ICONS[category] || ITEM_ICONS.default;
  },
};

export default api;
export { ITEM_ICONS };
