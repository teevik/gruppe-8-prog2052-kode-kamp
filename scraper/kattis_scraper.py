import requests
from bs4 import BeautifulSoup
import toml
import sys


WRITE_TO_PATH = "../backend/challenges/"

def fetch_problem(name):
    url = 'https://open.kattis.com/problems/' + name
    response = requests.get(url)

    match response.status_code:
        case 200:
            pass
        case 404:
            print(f"Problem '{name}' not found")
            return 
        case _:
            print(f"Failed to fetch: {response.status_code}")
            return


    soup = BeautifulSoup(response.content, 'html.parser')

    title = soup.select_one('h1.book-page-heading')
    if title:
        title = title.get_text(strip=True) 
    else:
        print(f"Title not found for {name}")
        return;

    authors = soup.select_one('.metadata-license-card').select('a[href^="/problem-authors/"]')
    description = ' '.join([str(element) for element in soup.select('div.problembody *')])
    
    def read_content(header):
        c = ""
        elm = soup.find('h2', string=header).find_next_sibling()
        while elm != None and elm.name not in ('h2', 'div', 'table.sample', 'Output'):
            c += str(elm)
            elm = elm.find_next_sibling()
        return c

    input = read_content('Input')
    output = read_content('Output')

    tables = soup.select('table.sample')
    sample_inputs = [table.find('td').get_text(strip=True) for table in tables]
    sample_outputs = [table.find('td').find_next_sibling().get_text(strip=True) for table in tables]

    template = "let input = readline()\n\nconsole.log(output)"

    doc = {
        'title': title,
        'license': "Creative Commons License (cc by)",
        'attribution': [
            {
                'name': author.get_text(strip=True), 
                'url': f"https://open.kattis.com{author['href']}"
            }
            for author in authors
        ],
        'description': description,
        'input': input,
        'output': output,

        'sampleTests': [
            {'input' : i, 'output' : o} 
            for i, o in zip(sample_inputs, sample_outputs)
        ]
        # 'template':
    }

    with open(f"{WRITE_TO_PATH}{name}.toml", "w") as file:
        toml.dump(doc, file)
        print(f"Problem '{name}.toml' created in {WRITE_TO_PATH}")

match len(sys.argv):
    case 1: 
        while True:
            print("Enter problem name:", end=" ")
            fetch_problem(input())
    case 2: 
            match sys.argv[1]:
                case "--list":
                    with open("problem_list", 'r') as f:
                        for line in f:
                            fetch_problem(line.strip())
                case _: fetch_problem(sys.argv[1])
