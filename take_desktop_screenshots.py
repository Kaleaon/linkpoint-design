import asyncio
import os
from playwright.async_api import async_playwright

os.makedirs("docs/screenshots/desktop_verify", exist_ok=True)

async def capture():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1440, "height": 900})

        # 1. Capture index.html
        print("Capturing index.html Desktop Sweep/LCARS...")
        await page.goto("http://127.0.0.1:8080/index.html")
        await page.wait_for_timeout(1500)

        # Click "Desktop" in DEVICE panel
        await page.get_by_text("Desktop", exact=True).first.click()
        await page.wait_for_timeout(500)

        # Click "Sweep Console" in LAYOUT PACK panel
        await page.get_by_text("Sweep Console", exact=True).first.click()
        await page.wait_for_timeout(500)

        # Click "LCARS Amber" in COLOUR PACK panel
        await page.get_by_text("LCARS Amber", exact=True).first.click()
        await page.wait_for_timeout(1000)

        await page.screenshot(path="docs/screenshots/desktop_verify/html_sweep_lcars_desk.png")
        print("Captured docs/screenshots/desktop_verify/html_sweep_lcars_desk.png")

        # Click "Aero Glass" layout + "Frutiger Aero" palette
        await page.get_by_text("Aero Glass", exact=True).first.click()
        await page.wait_for_timeout(500)
        await page.get_by_text("Frutiger Aero", exact=True).first.click()
        await page.wait_for_timeout(1000)
        await page.screenshot(path="docs/screenshots/desktop_verify/html_aero_glass_desk.png")
        print("Captured docs/screenshots/desktop_verify/html_aero_glass_desk.png")

        # 2. Capture react/dist/index.html
        print("Capturing react dist Desktop...")
        await page.goto("http://127.0.0.1:8080/react/dist/index.html")
        await page.wait_for_timeout(1500)

        await page.get_by_text("Desktop", exact=True).first.click()
        await page.wait_for_timeout(500)
        await page.get_by_text("Sweep Console", exact=True).first.click()
        await page.wait_for_timeout(500)
        await page.get_by_text("LCARS Amber", exact=True).first.click()
        await page.wait_for_timeout(1000)
        await page.screenshot(path="docs/screenshots/desktop_verify/react_sweep_lcars_desk.png")
        print("Captured docs/screenshots/desktop_verify/react_sweep_lcars_desk.png")

        await page.get_by_text("Aero Glass", exact=True).first.click()
        await page.wait_for_timeout(500)
        await page.get_by_text("Frutiger Aero", exact=True).first.click()
        await page.wait_for_timeout(1000)
        await page.screenshot(path="docs/screenshots/desktop_verify/react_aero_glass_desk.png")
        print("Captured docs/screenshots/desktop_verify/react_aero_glass_desk.png")

        await browser.close()

asyncio.run(capture())
