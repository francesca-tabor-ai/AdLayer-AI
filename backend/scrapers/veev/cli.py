import asyncio
import json
import sys

import click
import structlog

from .config import VeevScraperSettings
from .pipeline import VeevScrapePipeline


def setup_logging(verbose: bool = False) -> None:
    """Configure structured logging."""
    structlog.configure(
        processors=[
            structlog.stdlib.add_log_level,
            structlog.dev.ConsoleRenderer(colors=True),
        ],
        wrapper_class=structlog.stdlib.BoundLogger,
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
    )


@click.group()
def cli():
    """VEEV website scraper for AdLayer-AI."""
    pass


@cli.command()
@click.option(
    "--region", "-r",
    multiple=True,
    default=["ch_en"],
    help="Region(s) to scrape. Can specify multiple: -r ch_en -r gb_en",
)
@click.option("--output-dir", "-o", default="./output/veev", help="Output directory")
@click.option("--headless/--headed", default=True, help="Run browser in headless mode")
@click.option("--dry-run", is_flag=True, help="Crawl and parse only, skip downloading")
@click.option("--max-pages", default=200, type=int, help="Max pages to crawl per region")
@click.option("--verbose", "-v", is_flag=True, help="Verbose logging")
def scrape(region, output_dir, headless, dry_run, max_pages, verbose):
    """Run the VEEV scraper."""
    setup_logging(verbose)
    log = structlog.get_logger()

    settings = VeevScraperSettings(
        output_dir=output_dir,
        headless=headless,
        max_pages_per_site=max_pages,
    )

    pipeline = VeevScrapePipeline(settings)

    log.info("starting_scrape", regions=list(region), dry_run=dry_run)

    manifest = asyncio.run(pipeline.run(regions=list(region), dry_run=dry_run))

    # Print summary
    click.echo(f"\nScrape Complete!")
    click.echo(f"  Job ID:           {manifest.job.job_id}")
    click.echo(f"  Regions:          {', '.join(manifest.job.regions)}")
    click.echo(f"  Pages crawled:    {manifest.job.pages_crawled}")
    click.echo(f"  Images found:     {manifest.job.images_found}")
    click.echo(f"  Images downloaded: {manifest.job.images_downloaded}")
    click.echo(f"  Errors:           {len(manifest.job.errors)}")
    click.echo(f"  Output:           {output_dir}")

    if manifest.job.errors:
        click.echo(f"\nErrors:")
        for err in manifest.job.errors[:10]:
            click.echo(f"  - {err}")

    sys.exit(0 if manifest.job.status == "completed" else 1)


@cli.command()
@click.argument("manifest_path")
def show(manifest_path):
    """Show a scrape manifest summary."""
    with open(manifest_path, "r") as f:
        data = json.load(f)

    job = data.get("job", {})
    items = data.get("items", [])

    click.echo(f"Job ID:    {job.get('job_id')}")
    click.echo(f"Status:    {job.get('status')}")
    click.echo(f"Regions:   {', '.join(job.get('regions', []))}")
    click.echo(f"Pages:     {job.get('pages_crawled')}")
    click.echo(f"Images:    {len(items)}")

    # Count by type
    types: dict[str, int] = {}
    for item in items:
        t = item.get("image", {}).get("image_type", "unknown")
        types[t] = types.get(t, 0) + 1
    click.echo(f"\nBy type:")
    for t, count in sorted(types.items()):
        click.echo(f"  {t}: {count}")


def main():
    cli()


if __name__ == "__main__":
    main()
