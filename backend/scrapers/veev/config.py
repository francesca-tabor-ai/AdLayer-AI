from pydantic_settings import BaseSettings


class VeevScraperSettings(BaseSettings):
    # Age gate DOB (must be 18+)
    age_gate_day: int = 1
    age_gate_month: int = 1
    age_gate_year: int = 1990

    # Download settings
    output_dir: str = "./output/veev"
    max_concurrent_downloads: int = 5
    download_timeout_seconds: int = 30
    retry_max_attempts: int = 3

    # Crawl settings
    max_pages_per_site: int = 200
    crawl_delay_seconds: float = 1.5
    user_agent: str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

    # S3 settings (optional, for future use)
    s3_bucket: str = ""
    s3_prefix: str = "veev/"
    s3_endpoint_url: str = ""

    # Browser
    headless: bool = True
    viewport_width: int = 1920
    viewport_height: int = 1080

    model_config = {"env_prefix": "VEEV_SCRAPER_"}


# Site registry: per-region configuration for crawling
SITE_REGISTRY: dict = {
    "ch_en": {
        "base_url": "https://veev-vape.com/ch/en",
        "entry_points": [
            "",
            "/veev-one",
            "/veev-now-ultra",
            "/pods",
            "/starter-kits",
            "/smart-corner",
            "/discover-veev",
        ],
        "age_gate": {
            "type": "swiss_multi_step",
            "country_check_selector": "#countryConnectionCheck",
            "country_continue_selector": "#countryConnectionCheck button.cta, #countryConnectionCheck button:has-text('Continue')",
            "gate_selector": "#soft-age-gate",
            "confirm_over_18_selector": "#soft-age-gate button:has-text('Yes, I am over 18')",
            "cookie_accept_selector": "button:has-text('Accept All Cookies')",
        },
        "link_patterns": [
            r"/ch/en/",
            r"/veev-",
            r"/pods",
            r"/starter-kit",
            r"/discover",
            r"/shop",
            r"/smart-corner",
        ],
        "exclude_patterns": [
            r"/cart",
            r"/checkout",
            r"/login",
            r"/register",
            r"/account",
            r"/contact",
            r"\.pdf$",
            r"#",
        ],
        "image_selectors": [
            "img[src*='files/']",
            "img[data-src]",
            "img[data-lazy]",
            "img.product-image",
            ".slick-slide img",
            ".hero-banner img",
            ".field--name-field-image img",
            "picture source",
            "img",
        ],
        "cdn_patterns": [
            r"files/hncfsx\d+/files/",
            r"/sites/g/files/",
        ],
    },
    "gb_en": {
        "base_url": "https://www.iqos.com/gb/en/discover-vaping",
        "entry_points": [
            "",
            "/buy-veev-one.html",
            "/buy-pods.html",
            "/buy-x-flavour-pods.html",
        ],
        "age_gate": {
            "type": "dob_inputs",
            "day_selector": "input[name='day'], input#day, input[placeholder*='DD']",
            "month_selector": "input[name='month'], input#month, input[placeholder*='MM']",
            "year_selector": "input[name='year'], input#year, input[placeholder*='YYYY']",
            "submit_selector": "button[type='submit'], button.age-gate-submit, button[class*='submit']",
            "detection_selector": ".age-gate, [class*='age-gate'], [class*='ageGate'], [data-testid*='age']",
        },
        "link_patterns": [
            r"/discover-vaping/",
            r"/veev",
            r"/buy-",
        ],
        "exclude_patterns": [
            r"/cart",
            r"/checkout",
            r"/login",
            r"/register",
            r"/account",
            r"\.pdf$",
            r"#",
        ],
        "image_selectors": [
            "img[src*='media.iqos.com']",
            "img[src*='pmintl']",
            "picture source[srcset*='media.iqos.com']",
            "img[class*='product']",
            "img",
        ],
        "cdn_patterns": [
            r"media\.iqos\.com/is/image/pmintl/",
        ],
    },
}
