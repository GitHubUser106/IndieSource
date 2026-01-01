// MirrorSource Chrome Extension - Background Service Worker
// Tracks usage stats and updates badge

const DEFAULT_STATS = {
  totalStories: 0,
  monthlyStories: 0,
  monthStarted: new Date().toISOString().slice(0, 7),
  domains: {},
  recentExplorations: []
};

// Initialize on install
chrome.runtime.onInstalled.addListener((details) => {
  console.log('MirrorSource: Extension installed/updated', details.reason);
  initializeStats();
});

// Initialize on startup
chrome.runtime.onStartup.addListener(() => {
  console.log('MirrorSource: Browser started');
  initializeStats();
});

function initializeStats() {
  chrome.storage.local.get(['stats'], (result) => {
    if (!result.stats) {
      console.log('MirrorSource: Creating default stats');
      chrome.storage.local.set({ stats: { ...DEFAULT_STATS } }, () => {
        updateBadge();
      });
    } else {
      // Check for month rollover
      const currentMonth = new Date().toISOString().slice(0, 7);
      if (result.stats.monthStarted !== currentMonth) {
        console.log('MirrorSource: New month, resetting monthly count');
        result.stats.monthlyStories = 0;
        result.stats.monthStarted = currentMonth;
        chrome.storage.local.set({ stats: result.stats }, () => {
          updateBadge();
        });
      } else {
        updateBadge();
      }
    }
  });
}

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('MirrorSource: Message received:', message.action);
  
  if (message.action === 'trackUnlock') {
    handleTrackUnlock(message.url, message.domain, sendResponse);
    return true; // Will respond asynchronously
  }
  
  if (message.action === 'getStats') {
    handleGetStats(sendResponse);
    return true; // Will respond asynchronously
  }
  
  if (message.action === 'resetStats') {
    handleResetStats(sendResponse);
    return true; // Will respond asynchronously
  }
  
  return false;
});

function handleTrackUnlock(url, domain, sendResponse) {
  chrome.storage.local.get(['stats'], (result) => {
    const stats = result.stats || { ...DEFAULT_STATS };
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Reset if new month
    if (stats.monthStarted !== currentMonth) {
      stats.monthlyStories = 0;
      stats.monthStarted = currentMonth;
    }
    
    // Increment
    stats.totalStories = (stats.totalStories || 0) + 1;
    stats.monthlyStories = (stats.monthlyStories || 0) + 1;
    
    // Track domain
    const cleanDomain = (domain || '').replace(/^www\./, '');
    if (cleanDomain) {
      stats.domains = stats.domains || {};
      stats.domains[cleanDomain] = (stats.domains[cleanDomain] || 0) + 1;
    }
    
    // Recent explorations
    stats.recentExplorations = stats.recentExplorations || [];
    stats.recentExplorations.unshift({
      url: url,
      domain: cleanDomain,
      timestamp: Date.now()
    });
    stats.recentExplorations = stats.recentExplorations.slice(0, 50);
    
    console.log('MirrorSource: Saving stats, monthlyStories:', stats.monthlyStories);
    
    chrome.storage.local.set({ stats }, () => {
      if (chrome.runtime.lastError) {
        console.error('MirrorSource: Error saving stats', chrome.runtime.lastError);
      }
      updateBadge();
      sendResponse({ success: true, stats: stats });
    });
  });
}

function handleGetStats(sendResponse) {
  chrome.storage.local.get(['stats'], (result) => {
    const stats = result.stats || { ...DEFAULT_STATS };
    console.log('MirrorSource: Returning stats:', stats);
    sendResponse(stats);
  });
}

function handleResetStats(sendResponse) {
  chrome.storage.local.set({ stats: { ...DEFAULT_STATS } }, () => {
    console.log('MirrorSource: Stats reset');
    updateBadge();
    sendResponse({ success: true });
  });
}

function updateBadge() {
  chrome.storage.local.get(['stats'], (result) => {
    const stats = result.stats || { ...DEFAULT_STATS };
    const count = stats.monthlyStories || 0;
    
    console.log('MirrorSource: Updating badge, count:', count);
    
    if (count > 0) {
      chrome.action.setBadgeText({ text: String(count) });
      chrome.action.setBadgeBackgroundColor({ color: '#2563eb' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  });
}

// Also update badge when storage changes (for sync across tabs)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.stats) {
    console.log('MirrorSource: Storage changed, updating badge');
    updateBadge();
  }
});
