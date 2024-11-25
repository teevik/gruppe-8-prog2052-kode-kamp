import requests
from bs4 import BeautifulSoup, NavigableString

def scrape_problem(name):
    url = 'https://open.kattis.com/problems/' + name
    response = requests.get(url)

    match response.status_code:
        case 200:
            pass
        case 404:
            print(f"Problem '{name}' not found")
            exit(1) 
        case _:
            print(f"Failed to fetch: {response.status_code}")
            exit(1)


    soup = BeautifulSoup(response.content, 'html.parser')

    title = soup.select_one('h1.book-page-heading')
    if title:
        title = title.get_text(strip=True) 
    else:
        print(f"Title not found for {name}")
        return;

    authors = soup.select_one('.metadata-license-card').select('a[href^="/problem-authors/"]')

    container = soup.select_one('div.problembody')
    problem_body = container.children
    
    # Get the problem description
    description = ""
    for next_element in problem_body:
        # Fast forward on text nodes
        if isinstance(next_element, NavigableString):
            description += str(next_element)
            continue

        # Ignore illustrations
        if "illustration" in next_element.get('class', []) or "figure" in next_element.get('class', []):
            continue

        # Stop at the input section
        if next_element.name == 'h2' and next_element.get_text(strip=True) == 'Input':
            break

        description += str(next_element) + "\n"

    # Input section
    input_section = ""
    for next_element in problem_body:
        # Fast forward on text nodes
        if isinstance(next_element, NavigableString):
            description += str(next_element)
            continue

        # Ignore illustrations
        if "illustration" in next_element.get('class', []) or "figure" in next_element.get('class', []):
            continue

        # Stop at the output section
        if next_element.name == 'h2' and next_element.get_text(strip=True) == 'Output':
            break

        input_section += str(next_element) + "\n"

    # Output section
    output_section = ""
    sample_tests = []
    for next_element in problem_body:
        # Fast forward on text nodes
        if isinstance(next_element, NavigableString):
            description += str(next_element)
            continue

        # Ignore illustrations
        if "illustration" in next_element.get('class', []) or "figure" in next_element.get('class', []):
            continue

        if "sample" in next_element.get('class', []):
            sample_inputs = next_element.find('td').get_text(strip=True)
            sample_outputs = next_element.find('td').find_next_sibling().get_text(strip=True)

            sample_inputs = sample_inputs.split("\n")
            sample_outputs = sample_outputs.split("\n")

            sample_tests.append({
                'input': sample_inputs,
                'output': sample_outputs
            })

            continue

        output_section += str(next_element) + "\n"

    template = "let input = readline();\n\n// console.log(output);"

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
        'description': description.strip(),
        'input': input_section.strip(),
        'output': output_section.strip(),
        'template': template,
        "sampleTests": sample_tests,
        "tests": sample_tests
    }

    return doc

def format_as_toml(doc):
    title = doc['title']

    # Title and License
    toml = f"title = \"{title}\"\n"
    toml += "license = \"Creative Commons License (cc by)\"\n"

    toml += "\n"

    # Attribution
#   { name = "Tómas Ken Magnússon", url = "https://open.kattis.com/problem-authors/T%C3%B3mas%20Ken%20Magn%C3%BAsson" },
    toml += "attribution = [\n"
    for attrib in doc["attribution"]:
        toml += f"  {{ name = \"{attrib['name']}\", url = \"{attrib['url']}\" }},\n"
    toml += "]\n"

    toml += "\n"

    # Description
    toml += "description = '''\n"
    toml += doc['description']
    toml += "\n'''\n"

    toml += "\n"

    # Input
    toml += "input = '''\n"
    toml += doc['input']
    toml += "\n'''\n"

    toml += "\n"

    # Output
    toml += "output = '''\n"
    toml += doc['output']
    toml += "\n'''\n"

    toml += "\n"

    # Template
    toml += "template = '''\n"
    toml += doc['template']
    toml += "\n'''\n"

    toml += "\n"

    # Sample tests
    toml += "sampleTests = [\n"
    for test in doc['sampleTests']:
        toml += "  { input = "
        toml += str(test['input'])
        toml += ", output = "
        toml += str(test['output'])
        toml += " },\n"
    toml += "]\n"

    toml += "\n"

    # Tests
    toml += "tests = [\n"
    for test in doc['sampleTests']:
        toml += "  { input = "
        toml += str(test['input'])
        toml += ", output = "
        toml += str(test['output'])
        toml += " },\n"
    toml += "]\n"

    return toml

problem_name = "findingana"

data = scrape_problem(problem_name)
toml = format_as_toml(data)

output_path = "../frontend/src/pages/game/mock/challenge.toml"
with open(output_path, "w") as file:
    file.write(toml)
    print(f"Problem '{problem_name}' created in {output_path}")
