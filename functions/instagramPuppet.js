const puppeteer = require('puppeteer');
const os = require('os');

const Instapuppet = async (url) => {
    let filenameFromUrl = url.split('/')[5] + "";
    
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    const getRandomDelay = () => Math.random() * 200 + 500;
    
    const expandContent = async (page) => {
        const possibleSelectors = [
            'a[role="button"]',
            'button[aria-label*="view more"]',
            'button[aria-label*="show more"]',
            'button[aria-label*="load more"]',
            'a[href="javascript:void(0)"]',
            '[data-action*="expand"]',
            '.expandable',
            '.show-more',
            '.view-more',
            'button[aria-label*="more"]',
            'button[aria-label*="expand"]',
            'a[role="button"][aria-label*="more"]',
            'a[role="button"][aria-label*="expand"]',
            '[aria-label*="more"]',
            '[aria-label*="expand"]'
        ];
        
        for (const selector of possibleSelectors) {
            try {
                const elements = await page.$$(selector);
                for (const element of elements) {
                    const isVisible = await element.isIntersectingViewport();
                    if (isVisible) {
                        await element.click();
                        await sleep(getRandomDelay());
                    }
                }
            } catch (error) {
                console.error(`Error with selector "${selector}":`, error);
            }
        }
    };
    
    try {
        const username = os.userInfo().username;
        const braveUserDataDir = `C:\\Users\\${username}\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data\\Default`;
        
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
            userDataDir: braveUserDataDir,
        });
    
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
        
        await page.goto(url, { waitUntil: 'networkidle2' });
        await sleep(Math.random() * 2000 + 1000);
        
        page.on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.dismiss();
        });
    
        await sleep(2000);
        const screenshotPath = `../ZENITHLABSBACKEND/postImages/${filenameFromUrl}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        await sleep(Math.random() * 2000);
        await browser.close();
        
        return [true, screenshotPath];
    } catch (err) {
        console.error('Error in Instapuppet:', err);
        return [false, err];
    }
};

module.exports = Instapuppet;
