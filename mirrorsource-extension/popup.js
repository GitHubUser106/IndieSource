document.getElementById('openBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0]?.url || '';
    
    const isArticle = currentUrl.includes('/') && 
                      !currentUrl.endsWith('.com/') && 
                      !currentUrl.endsWith('.org/') &&
                      !currentUrl.includes('/search') &&
                      !currentUrl.includes('/login');
    
    if (isArticle && currentUrl.startsWith('http')) {
      const encodedUrl = encodeURIComponent(currentUrl);
      chrome.tabs.create({ url: `https://mirrorsource.app?url=${encodedUrl}` });
    } else {
      chrome.tabs.create({ url: 'https://mirrorsource.app' });
    }
  });
});
