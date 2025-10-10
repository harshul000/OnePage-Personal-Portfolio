
import os
from playwright.sync_api import sync_playwright, Page, expect

def verify_chat_widget(page: Page):
    # Get the absolute path to the HTML file
    file_path = os.path.abspath("index.html")
    # Go to the local HTML file
    page.goto(f"file://{file_path}")

    # 1. Click the chat circle to open the chat box
    chat_circle = page.locator("#chat-circle")
    expect(chat_circle).to_be_visible()
    chat_circle.click()

    # 2. Check if the chat box is now visible
    chat_box = page.locator("#chat-box")
    expect(chat_box).to_be_visible()

    # 3. Type a message and send it
    chat_input = page.locator("#chat-input")
    expect(chat_input).to_be_visible()
    chat_input.fill("Tell me about your projects.")
    chat_input.press("Enter")

    # 4. Wait for the user message to appear
    user_message = page.locator(".user-message p")
    expect(user_message).to_have_text("Tell me about your projects.")

    # 5. Wait for the AI's response to appear
    # This might take a moment, so we increase the timeout
    ai_message = page.locator(".ai-message p")
    expect(ai_message).to_be_visible(timeout=15000) # Increased timeout for API call
    expect(ai_message).not_to_be_empty() # Make sure it's not an empty response

    # 6. Take a screenshot of the chat interaction
    page.screenshot(path="jules-scratch/verification/chat_verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        verify_chat_widget(page)
        browser.close()

if __name__ == "__main__":
    main()
