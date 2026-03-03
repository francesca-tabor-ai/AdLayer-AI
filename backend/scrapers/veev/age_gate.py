import structlog
from playwright.async_api import Page

from .config import SITE_REGISTRY, VeevScraperSettings
from .exceptions import AgeGateError

log = structlog.get_logger()


class AgeGateHandler:
    """Handles age verification gates on VEEV websites."""

    def __init__(self, settings: VeevScraperSettings):
        self.settings = settings

    async def bypass(self, page: Page, region: str) -> bool:
        """Bypass the age gate for a given region. Returns True if successful."""
        site_config = SITE_REGISTRY[region]
        gate_config = site_config["age_gate"]
        gate_type = gate_config["type"]

        log.info("age_gate_starting", region=region, type=gate_type)

        try:
            if gate_type == "swiss_multi_step":
                return await self._handle_swiss(page, gate_config)
            elif gate_type == "dob_inputs":
                return await self._handle_inputs(page, gate_config)
            else:
                raise AgeGateError(f"Unknown age gate type: {gate_type}")
        except AgeGateError:
            raise
        except Exception as exc:
            try:
                await page.screenshot(path="output/veev/age_gate_failure.png")
            except Exception:
                pass
            raise AgeGateError(f"Age gate bypass failed: {exc}") from exc

    async def _handle_swiss(self, page: Page, config: dict) -> bool:
        """
        Handle the Swiss VEEV site multi-step gate:
        1. Country connection check dialog -> click Continue
        2. Soft age gate dialog -> click "Yes, I am over 18"
        3. Cookie consent -> click Accept All Cookies
        """
        # Step 1: Dismiss country connection check
        try:
            country_sel = config["country_check_selector"]
            country = page.locator(country_sel)
            if await country.is_visible(timeout=5000):
                log.info("country_check_detected")
                continue_sel = config["country_continue_selector"]
                continue_btn = page.locator(continue_sel).first
                await continue_btn.click(timeout=5000)
                await page.wait_for_timeout(2000)
                log.info("country_check_dismissed")
        except Exception as exc:
            log.debug("country_check_skip", note=str(exc)[:100])

        # Step 2: Handle soft age gate
        try:
            gate_sel = config["gate_selector"]
            gate = page.locator(gate_sel)
            if await gate.is_visible(timeout=5000):
                log.info("soft_age_gate_detected")
                over18_sel = config["confirm_over_18_selector"]
                over18_btn = page.locator(over18_sel).first
                await over18_btn.click(timeout=5000)
                await page.wait_for_timeout(2000)
                log.info("soft_age_gate_confirmed")
        except Exception as exc:
            log.warning("soft_age_gate_issue", note=str(exc)[:100])

        # Step 3: Dismiss cookie consent
        try:
            cookie_sel = config["cookie_accept_selector"]
            cookie_btn = page.locator(cookie_sel).first
            if await cookie_btn.is_visible(timeout=3000):
                await cookie_btn.click(timeout=5000)
                await page.wait_for_timeout(500)
                log.info("cookie_consent_accepted")
        except Exception:
            pass

        log.info("age_gate_bypassed", method="swiss_multi_step")
        return True

    async def _handle_inputs(self, page: Page, config: dict) -> bool:
        """Handle UK-style input field age gate."""
        day_sel = config.get("day_selector", "")
        month_sel = config["month_selector"]
        year_sel = config["year_selector"]
        submit_sel = config["submit_selector"]

        if day_sel:
            el = page.locator(day_sel).first
            await el.fill(str(self.settings.age_gate_day), timeout=5000)
        month_el = page.locator(month_sel).first
        await month_el.fill(str(self.settings.age_gate_month), timeout=5000)
        year_el = page.locator(year_sel).first
        await year_el.fill(str(self.settings.age_gate_year), timeout=5000)

        submit = page.locator(submit_sel).first
        await submit.click(timeout=5000)

        await page.wait_for_timeout(2000)
        log.info("age_gate_bypassed", method="inputs")
        return True
