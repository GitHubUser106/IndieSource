// MirrorSource Chrome Extension - Content Script
// Adds a floating "Find Other Sources" button on news articles

(function () {
  // Don't run on non-article pages
  const url = window.location.href;
  const excludePatterns = [
    /\/(login|signup|subscribe|account|settings|search|tag|category|author)\//i,
    /\.(pdf|jpg|png|gif|mp4|mp3)$/i,
    /^https?:\/\/[^\/]+\/?$/,  // Homepage only
  ];

  for (const pattern of excludePatterns) {
    if (pattern.test(url)) return;
  }

  // Check if button already exists
  if (document.getElementById('mirrorsource-fab')) return;

  // Create container with shadow DOM for style isolation
  const container = document.createElement('div');
  container.id = 'mirrorsource-fab';

  // Apply critical styles inline - positioned for maximum visibility
  container.setAttribute('style', `
    position: fixed !important;
    bottom: 80px !important;
    right: 24px !important;
    z-index: 2147483647 !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    pointer-events: auto !important;
    visibility: visible !important;
    opacity: 1 !important;
    display: block !important;
  `);

  // Create shadow root for complete isolation
  const shadow = container.attachShadow({ mode: 'closed' });

  // Add styles inside shadow DOM
  const style = document.createElement('style');
  style.textContent = `
    * {
      box-sizing: border-box;
    }
    
    .ms-fab-wrapper {
      position: relative;
    }
    
    .ms-fab-button {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      background: #2563eb !important;
      color: white !important;
      padding: 12px 20px !important;
      border-radius: 9999px !important;
      cursor: pointer !important;
      box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4) !important;
      transition: all 0.2s ease !important;
      border: none !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      line-height: 1 !important;
      -webkit-tap-highlight-color: transparent !important;
      -webkit-touch-callout: none !important;
      -webkit-user-select: none !important;
      user-select: none !important;
    }

    .ms-fab-button:hover {
      background: #1d4ed8 !important;
      transform: scale(1.05) !important;
      box-shadow: 0 6px 24px rgba(37, 99, 235, 0.5) !important;
    }

    .ms-fab-button:active {
      transform: scale(0.98) !important;
      background: #1d4ed8 !important;
    }

    .ms-fab-button:focus {
      outline: none !important;
      background: #2563eb !important;
    }

    .ms-fab-icon {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
    }

    .ms-fab-icon img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .ms-fab-text {
      white-space: nowrap;
    }

    .ms-fab-tooltip {
      position: absolute;
      bottom: calc(100% + 8px);
      right: 0;
      background: #1e293b;
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .ms-fab-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      right: 24px;
      border: 6px solid transparent;
      border-top-color: #1e293b;
    }

    .ms-fab-wrapper:hover .ms-fab-tooltip {
      opacity: 1;
      visibility: visible;
    }

    /* Minimized state - icon only */
    .ms-fab-button.minimized {
      padding: 16px !important;
      border-radius: 50% !important;
      box-shadow: 0 4px 24px rgba(37, 99, 235, 0.5) !important;
    }
    
    .ms-fab-button.minimized .ms-fab-text {
      display: none !important;
    }
    
    .ms-fab-button.minimized .ms-fab-icon {
      width: 34px;
      height: 34px;
    }

    @media (max-width: 480px) {
      .ms-fab-button {
        padding: 16px !important;
        border-radius: 50% !important;
      }
      
      .ms-fab-text {
        display: none !important;
      }
      
      .ms-fab-icon {
        width: 34px;
        height: 34px;
      }
    }
  `;

  // Create button HTML - using icon from extension
  const wrapper = document.createElement('div');
  wrapper.className = 'ms-fab-wrapper';

  // Get icon URL from extension
  const iconUrl = chrome.runtime.getURL('icons/icon48.png');

  wrapper.innerHTML = `
    <button class="ms-fab-button">
      <div class="ms-fab-icon">
        <img src="${iconUrl}" alt="" />
      </div>
      <span class="ms-fab-text">Look for Other Sources</span>
    </button>
    <div class="ms-fab-tooltip">See this story from multiple perspectives</div>
  `;

  shadow.appendChild(style);
  shadow.appendChild(wrapper);
  document.body.appendChild(container);

  const fabButton = wrapper.querySelector('.ms-fab-button');

  // Click handler - open MirrorSource with the article URL and track usage
  fabButton.addEventListener('click', () => {
    const articleUrl = window.location.href;
    const encodedUrl = encodeURIComponent(articleUrl);
    
    // Track this exploration (silently, no badge update needed)
    chrome.runtime.sendMessage({ 
      action: 'trackUnlock', 
      url: articleUrl,
      domain: window.location.hostname 
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('MirrorSource: Error tracking', chrome.runtime.lastError.message);
      }
    });
    
    window.open(`https://mirrorsource.app?url=${encodedUrl}`, '_blank');
  });

  // Minimize button after scrolling down, expand on hover
  let isMinimized = false;
  let hoverTimeout = null;

  // Minimize after 3 seconds of being on page if scrolled
  setTimeout(() => {
    if (window.scrollY > 100) {
      fabButton.classList.add('minimized');
      isMinimized = true;
    }
  }, 3000);

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Minimize when scrolled down
    if (currentScrollY > 200 && !isMinimized) {
      fabButton.classList.add('minimized');
      isMinimized = true;
    }
    
    // Expand when scrolled back to top
    if (currentScrollY < 100 && isMinimized) {
      fabButton.classList.remove('minimized');
      isMinimized = false;
    }
  });

  // Expand on hover when minimized
  fabButton.addEventListener('mouseenter', () => {
    if (isMinimized) {
      fabButton.classList.remove('minimized');
      clearTimeout(hoverTimeout);
    }
  });

  fabButton.addEventListener('mouseleave', () => {
    if (window.scrollY > 200) {
      hoverTimeout = setTimeout(() => {
        fabButton.classList.add('minimized');
        isMinimized = true;
      }, 500);
    }
  });

})();
