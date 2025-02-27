const puppeteer = require('puppeteer');
const os = require('os');

const LinkedInpuppet = async (url) => {
    let filenameFromUrl = url.split('/')[3];
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    
    function getRandomDelay() {
        return Math.random() * 200 + 500; // Random delay between 0.5 and 2.5 seconds
    }
    
    async function expandContent(page) {
    const possibleSelectors = [
        'a[role="button"]', // Buttons with ARIA role
        'button',
        'button[aria-label*="view more"]', // Check aria-label for "view more"
        'button[aria-label*="show more"]', // Check aria-label for "show more"
        'button[aria-label*="load more"]',
        'a[href="javascript:void(0)"]',
        'a[role="button"][aria-label*="view more"]', // Links with role and aria-label
        'a[role="button"][aria-label*="show more"]',
        'a[role="button"][aria-label*="load more"]',
        '[data-action*="expand"]', // Elements with data-action attributes
        '.expandable', // Generic class names
        '.show-more',
        '.view-more',
        'button[aria-label*="more"]', // Check aria-label for "view more"
        'button[aria-label*="expand"]', // Check aria-label for "expand"
        'a[role="button"][aria-label*="more"]', // Links with role and aria-label
        'a[role="button"][aria-label*="expand"]',
        '[aria-label*="more"]', // Other elements with aria-label
        '[aria-label*="expand"]'
    ];
    
    for (const selector of possibleSelectors) {
        let elements = await page.$$(selector); // Find ALL matching elements
    
        for (const element of elements) {
        try {
            await page.waitForSelector(`${selector}`, { visible: true, timeout: 5000});
            const isVisible = await element.isIntersectingViewport(); // Check if element is visible
            if (isVisible) {
            await element.click();
            await sleep(getRandomDelay());
            }
        } catch (error) {
            console.error(`Error clicking element with selector "${selector}":`, error);
        }
        }
    }
    }
    
    async function scrollToBottom(page) {
        let previousHeight = 0;
        let currentHeight = await page.evaluate('document.body.scrollHeight');
      
        while (currentHeight > previousHeight) {
          previousHeight = currentHeight;
          await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
          await sleep(500); // Check more frequently
          currentHeight = await page.evaluate('document.body.scrollHeight');
        }
      }
    
    async function loadAllContent(page) {
    await expandContent(page);
    await scrollToBottom(page);
    }

    try {
        const mainCode = async () => {
            const username = os.userInfo().username; 
             // Brave browser profile path for Windows
            const braveUserDataDir = `C:\\Users\\${username}\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data\\Default`;
            const browser = await puppeteer.launch({
                headless: true,
                executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
                userDataDir: braveUserDataDir,
            });
        
            const page = await browser.newPage();
            // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'); // Set User Agent HERE
            await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2}); // Set Viewport HERE
            // const cookies = await browser.cookies();
            // await browser.setCookie(...cookies); // Restore cookies
            // console.log(cookies); // Log cookies to verify they are loaded
            await page.goto(`${url}`,{
                waitUntil: 'networkidle2',
            });
            await sleep(Math.random() * 2000 + 1000);
            page.on('dialog', async dialog => {
              console.log(dialog.message());
              await dialog.dismiss(); // Dismiss any dialog that appears
              });
        
            // Take a screenshot or perform other actions
            // await loadAllContent(page); // Load all dynamic content
            await sleep(2000);
            await page.screenshot({ path: `../ZENITHLABSBACKEND/postImages/${filenameFromUrl}.png` , fullPage: true});
            await sleep(Math.random() * 2000);
            await browser.close();
        };
        await mainCode()
        return [true,`../ZENITHLABSBACKEND/postImages/${filenameFromUrl}.png`]
    } catch (err) {
        return [false,err]
    }
}

module.exports = LinkedInpuppet;

