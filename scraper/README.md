# Web scraper for code problems

Using BeautifulSoup 4 to scrape problems from [kattis](https://open.kattis.com/problems)
and format them into toml files using our desired format.

## Usage

Change the `problem_name` variable in `kattis_scraper.py`, and run the script.

The toml output will be saved so it can be viewed at the `/game-page` mock route, and the `challenge.toml` can then be copied into the `backend/challenges` directory when It's validated and ready.
