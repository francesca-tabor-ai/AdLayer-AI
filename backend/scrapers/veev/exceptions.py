class ScraperError(Exception):
    """Base exception for scraper errors."""


class AgeGateError(ScraperError):
    """Failed to bypass age verification gate."""


class CrawlError(ScraperError):
    """Error during page crawling."""


class ParseError(ScraperError):
    """Error during page parsing."""


class DownloadError(ScraperError):
    """Error during image download."""


class StorageError(ScraperError):
    """Error during file storage operations."""
