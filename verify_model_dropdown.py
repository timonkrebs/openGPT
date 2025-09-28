from playwright.sync_api import Page, expect

def test_model_dropdown(page: Page):
    """
    This test verifies that the model dropdown is present and populated.
    """
    # 1. Arrange: Go to the application homepage.
    page.goto("http://localhost:4200/")

    # 2. Assert: Check that the model dropdown is visible.
    model_dropdown = page.get_by_label("Select a model")
    expect(model_dropdown).to_be_visible()

    # 3. Act: Click the dropdown to show the options.
    model_dropdown.click()

    # 4. Assert: Check that there are options in the dropdown.
    # The options might take a moment to load from the server.
    # We'll wait for at least one option to appear.
    expect(page.get_by_role("option")).to_have_count(1, timeout=5000)

    # 5. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")