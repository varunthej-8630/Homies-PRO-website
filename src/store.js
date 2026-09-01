import { create } from 'zustand';
import { MOCK_CREATOR_PROFILE, MOCK_MODERATION_QUEUE, MOCK_ORDERS, MOCK_WITHDRAWALS } from './constants/marketplace';
import projects from './constants/projects';

// eslint-disable-next-line import/prefer-default-export
export const useStore = create((set) => ({
  // Core site state
  lenis: undefined,
  setLenis: (lenis) => set({ lenis }),
  introOut: false,
  setIntroOut: (introOut) => set({ introOut }),
  isMenuOpen: false,
  setIsMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  fluidColor: '#d7d7d4',
  setFluidColor: (fluidColor) => set({ fluidColor }),
  isAbout: false,
  setIsAbout: (isAbout) => set({ isAbout }),
  isConversationOpen: false,
  setIsConversationOpen: (isConversationOpen) => set({ isConversationOpen }),

  // Marketplace Ecosystem State
  userRole: 'CREATOR', // 'GUEST' | 'BUYER' | 'CREATOR' | 'ADMIN'
  setUserRole: (userRole) => set({ userRole }),

  // Buyer State
  purchasedProjectIds: ['project1', 'project3'],
  orders: MOCK_ORDERS,
  wishlist: ['project2'],
  toggleWishlist: (projectId) =>
    set((state) => ({
      wishlist: state.wishlist.includes(projectId) ? state.wishlist.filter((id) => id !== projectId) : [...state.wishlist, projectId],
    })),
  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
      purchasedProjectIds: [...new Set([...state.purchasedProjectIds, order.projectId])],
    })),

  // Creator State
  creatorProfile: MOCK_CREATOR_PROFILE,
  creatorProjects: projects,
  withdrawals: MOCK_WITHDRAWALS,
  addCreatorProject: (newProject) =>
    set((state) => ({
      creatorProjects: [newProject, ...state.creatorProjects],
      moderationQueue: [
        {
          id: `sub-${Date.now()}`,
          title: newProject.title,
          creatorName: state.creatorProfile.name,
          creatorHandle: state.creatorProfile.handle,
          category: newProject.category,
          price: newProject.price,
          submittedDate: new Date().toISOString().split('T')[0],
          status: 'PENDING_REVIEW',
          techStack: newProject.techStack || [],
          filesCount: newProject.deliverableFiles?.length || 4,
          hasDocumentation: true,
          hasLiveDemo: !!newProject.liveLink,
        },
        ...state.moderationQueue,
      ],
    })),
  requestWithdrawal: (withdrawal) =>
    set((state) => {
      const newBalance = Math.max(0, state.creatorProfile.wallet.availableBalance - withdrawal.amount);
      return {
        withdrawals: [
          {
            id: `WTH-${Math.floor(100 + Math.random() * 900)}`,
            amount: withdrawal.amount,
            date: new Date().toISOString().split('T')[0],
            method: withdrawal.method,
            status: 'Processing',
            transactionRef: `UTR${Date.now()}`,
          },
          ...state.withdrawals,
        ],
        creatorProfile: {
          ...state.creatorProfile,
          wallet: {
            ...state.creatorProfile.wallet,
            availableBalance: newBalance,
            withdrawn: state.creatorProfile.wallet.withdrawn + withdrawal.amount,
          },
        },
      };
    }),

  // Admin / Moderation State
  moderationQueue: MOCK_MODERATION_QUEUE,
  updateModerationStatus: (id, status, notes = '') =>
    set((state) => ({
      moderationQueue: state.moderationQueue.map((item) => (item.id === id ? { ...item, status, notes } : item)),
    })),

  // Search & Filtering
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  selectedCategory: 'all',
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  selectedTech: '',
  setSelectedTech: (selectedTech) => set({ selectedTech }),
}));
