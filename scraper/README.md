# Web scraper for code problems

Using BeautifulSoup 4 to scrape problems from [kattis](https://open.kattis.com/problems)
and format them into toml files using our desired format.

## Usage

```bash
# Interactive mode (<C-c> to exit)
python3 kattis_scraper.py 
# scrape all problems listed in file
python3 kattis_scraper.py <problem_list_file>
```

The problem_list_file should contain the name of the problems to scrape,
separated by newlines. Names are case-sensitive.
