from kattis_scraper import scrape_problem, format_as_toml

problem_name = "findingana"

data = scrape_problem(problem_name)
toml = format_as_toml(data)

output_path = "../frontend/src/pages/game/mock/challenge.toml"
with open(output_path, "w") as file:
    file.write(toml)
    print(f"Problem '{problem_name}' created in {output_path}")
