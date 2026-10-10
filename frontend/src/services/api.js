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
  furniture: '🪑', clothing: '👟', paper: '📰', default: '📦',
};

const MOCK_ITEMS = [
  { id: 'item-001', title: 'Study Table Lamp', category: 'electronics', condition: 'good', description: 'LED desk lamp, adjustable arm, works perfectly. Minor scratch on base.', suggestedPrice: { min: 150, max: 300 }, askingPrice: 200, priceType: 'price', route: 'reuse', status: 'available', postedBy: 'user-002', communityId: 'comm-001', postedAt: '2026-10-05T08:30:00Z', expiresAt: '2026-10-12T08:30:00Z' },
  { id: 'item-002', title: 'Organic Chemistry Textbook (Morrison & Boyd)', category: 'books', condition: 'fair', description: 'Used textbook with some highlighting. All pages intact.', suggestedPrice: { min: 50, max: 150 }, askingPrice: 0, priceType: 'free', route: 'reuse', status: 'available', postedBy: 'user-003', communityId: 'comm-001', postedAt: '2026-10-06T14:00:00Z', expiresAt: '2026-10-13T14:00:00Z' },
  { id: 'item-003', title: 'Broken Laptop Charger (Dell)', category: 'electronics', condition: 'broken', description: 'Dell 65W charger, frayed cable near connector. Not safe to use.', suggestedPrice: { min: 0, max: 0 }, askingPrice: 0, priceType: 'scrap', route: 'ewaste', status: 'available', postedBy: 'user-002', communityId: 'comm-001', postedAt: '2026-10-04T11:00:00Z', expiresAt: '2026-10-11T11:00:00Z' },
  { id: 'item-004', title: 'Cotton Bedsheet Set', category: 'home', condition: 'good', description: 'Queen size cotton bedsheet with 2 pillow covers. Lightly used, freshly washed.', suggestedPrice: { min: 100, max: 250 }, askingPrice: 150, priceType: 'price', route: 'reuse', status: 'available', postedBy: 'user-004', communityId: 'comm-001', postedAt: '2026-10-07T09:00:00Z', expiresAt: '2026-10-14T09:00:00Z' },
  { id: 'item-005', title: 'Electric Kettle (Prestige)', category: 'appliances', condition: 'good', description: '1.5L electric kettle. Works well, minor limescale inside.', suggestedPrice: { min: 200, max: 400 }, askingPrice: 250, priceType: 'price', route: 'reuse', status: 'claimed', postedBy: 'user-003', claimedBy: 'user-001', communityId: 'comm-001', postedAt: '2026-10-03T16:00:00Z', expiresAt: '2026-10-10T16:00:00Z' },
  { id: 'item-006', title: 'Yoga Mat', category: 'fitness', condition: 'like_new', description: '6mm thick yoga mat, used only twice. No odor.', suggestedPrice: { min: 200, max: 400 }, askingPrice: 0, priceType: 'free', route: 'reuse', status: 'available', postedBy: 'user-004', communityId: 'comm-001', postedAt: '2026-10-08T07:00:00Z', expiresAt: '2026-10-15T07:00:00Z' },
  { id: 'item-007', title: 'Old CRT Monitor', category: 'electronics', condition: 'broken', description: '15 inch CRT monitor from 2005. Screen flickers. E-waste.', suggestedPrice: { min: 0, max: 0 }, askingPrice: 0, priceType: 'scrap', route: 'ewaste', status: 'available', postedBy: 'user-002', communityId: 'comm-001', postedAt: '2026-10-04T11:30:00Z', expiresAt: '2026-10-11T11:30:00Z' },
  { id: 'item-008', title: 'Wooden Bookshelf (Small)', category: 'furniture', condition: 'fair', description: '3-shelf wooden bookshelf. Slightly wobbly but functional.', suggestedPrice: { min: 300, max: 600 }, askingPrice: 400, priceType: 'price', route: 'reuse', status: 'available', postedBy: 'user-003', communityId: 'comm-001', postedAt: '2026-10-07T12:00:00Z', expiresAt: '2026-10-14T12:00:00Z' },
  { id: 'item-009', title: 'Pile of Old Newspapers (5kg)', category: 'paper', condition: 'na', description: 'Stack of old newspapers, about 5kg. Good for recycling.', suggestedPrice: { min: 0, max: 25 }, askingPrice: 0, priceType: 'scrap', route: 'scrap', status: 'available', postedBy: 'user-004', communityId: 'comm-001', postedAt: '2026-10-06T10:00:00Z', expiresAt: '2026-10-13T10:00:00Z' },
  { id: 'item-010', title: 'Running Shoes (Nike, Size 9)', category: 'clothing', condition: 'good', description: 'Nike running shoes, worn for ~3 months. Good grip, clean.', suggestedPrice: { min: 400, max: 800 }, askingPrice: 500, priceType: 'price', route: 'reuse', status: 'available', postedBy: 'user-002', communityId: 'comm-001', postedAt: '2026-10-08T15:00:00Z', expiresAt: '2026-10-15T15:00:00Z' },
];

const MOCK_WISHLIST = [
  { id: 'wish-001', userId: 'user-001', communityId: 'comm-001', keyword: 'study lamp', category: 'electronics', createdAt: '2026-10-01T10:00:00Z' },
  { id: 'wish-002', userId: 'user-001', communityId: 'comm-001', keyword: 'bookshelf', category: 'furniture', createdAt: '2026-10-02T10:00:00Z' },
  { id: 'wish-003', userId: 'user-003', communityId: 'comm-001', keyword: 'yoga mat', category: 'fitness', createdAt: '2026-10-05T10:00:00Z' },
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
  { name: 'Desk Lamp (LED)', category: 'electronics', condition: 'good', suggestedPrice: { min: 150, max: 300 }, route: 'reuse', description: 'Adjustable LED desk lamp with metal arm. Appears functional with minor wear.' },
  { name: 'Textbook — Data Structures & Algorithms', category: 'books', condition: 'fair', description: 'Programming textbook with some wear on cover. Pages appear intact.', suggestedPrice: { min: 50, max: 120 }, route: 'reuse' },
  { name: 'Phone Charger Cable (USB-C)', category: 'electronics', condition: 'broken', description: 'USB-C cable with frayed insulation near connector. Not safe for use.', suggestedPrice: { min: 0, max: 0 }, route: 'ewaste' },
  { name: 'Water Bottle (Steel, 750ml)', category: 'home', condition: 'good', description: 'Stainless steel water bottle with minor dents. Clean and functional.', suggestedPrice: { min: 80, max: 150 }, route: 'reuse' },
  { name: 'Pair of Jeans (Men, 32)', category: 'clothing', condition: 'good', description: 'Blue denim jeans, lightly faded. No tears or stains.', suggestedPrice: { min: 100, max: 250 }, route: 'reuse' },
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
    // Try real backend endpoint
    try {
      const { base64, mimeType } = await fileToBase64(file);
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType }),
      });

      if (res.ok) {
        const data = await res.json();
        // Backend returns { items: [...], provider: 'groq'|'mock', mock: boolean }
        return {
          items: data.items || [],
          provider: data.provider || 'unknown',
          mock: data.mock ?? true,
        };
      }

      // Backend returned an error — parse and throw
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Backend error (${res.status})`);
    } catch (err) {
      // Network error or no backend running — fall back to mock
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        console.info('[PassOn] Backend not reachable — using mock AI analysis');
        await delay(2000);
        return { items: [...MOCK_AI_RESPONSE], provider: 'mock', mock: true };
      }
      // Re-throw backend errors (not network errors)
      throw err;
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
