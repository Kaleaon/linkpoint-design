import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto("http://127.0.0.1:8080/index.html")
        await page.wait_for_timeout(2000)

        # Check window object for DC state
        res = await page.evaluate("""() => {
            const root = document.querySelector('.sc-host');
            return !!root;
        }""")
        print("Root exists:", res)

        await browser.close()

asyncio.run(run())
