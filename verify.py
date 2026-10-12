from playwright.sync_api import sync_playwright
import time
import os

def run_cuj(page):
    page.goto("http://localhost:8080/")
    time.sleep(2)

    # Trigger Dock Edit mode
    page.evaluate("() => { if(window.appInstance) window.appInstance.setState({ cEdit: true, cfPadShut: false }); }")
    time.sleep(1)

    # Focus and activate "DONE" button
    done_btn = page.locator("span[role='button'][aria-label='Finish editing dock']")
    done_btn.focus()
    page.wait_for_timeout(500)
    page.keyboard.press("Space")
    page.wait_for_timeout(500)

    # Trigger Move Pad Flyout
    page.evaluate("() => { if(window.appInstance) window.appInstance.setState({ cfFlyShow: true, cfPadShut: false }); }")
    time.sleep(1)

    # Focus and activate "MOVE PAD"
    move_pad = page.locator("div[role='button'][aria-label='Show move pad']")
    if move_pad.count() > 0:
        move_pad.focus()
        page.wait_for_timeout(500)
        page.keyboard.press("Space")
        page.wait_for_timeout(500)

    # Focus and activate "HIDE"
    hide_pad = page.locator("div[role='button'][aria-label='Hide move pad']")
    if hide_pad.count() > 0:
        hide_pad.focus()
        page.wait_for_timeout(500)
        page.keyboard.press("Enter")
        page.wait_for_timeout(500)

    # Focus and activate "RUN"
    run_pad = page.locator("div[role='button'][aria-label='Toggle run']")
    if run_pad.count() > 0:
        run_pad.focus()
        page.wait_for_timeout(500)
        page.keyboard.press("Space")
        page.wait_for_timeout(500)

    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
