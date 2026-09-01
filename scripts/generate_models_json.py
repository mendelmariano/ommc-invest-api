#!/usr/bin/env python3
"""
Gera um arquivo JSON com todas as models a partir das classes Java em
src/main/java/**/entity

Uso:
  python scripts/generate_models_json.py

Saída:
  scripts/output/models.json  (um objeto com todas as models)
  scripts/output/models/<Model>.json  (um arquivo por model)
"""
import json
import re
from pathlib import Path


JAVA_ENTITY_GLOB = 'src/main/java/**/entity/*.java'
OUT_DIR = Path('scripts/output')


TYPE_MAP = {
    'String': 'string',
    'Long': 'integer',
    'Integer': 'integer',
    'int': 'integer',
    'long': 'integer',
    'Double': 'number',
    'double': 'number',
    'Float': 'number',
    'float': 'number',
    'Boolean': 'boolean',
    'boolean': 'boolean',
    'LocalDate': 'string',
    'LocalDateTime': 'string',
}


def java_type_to_simple(t: str):
    t = t.strip()
    # handle generics like List<Type>
    list_match = re.match(r'List<\s*([^>]+)\s*>', t)
    if list_match:
        inner = java_type_to_simple(list_match.group(1))
        return {'type': 'array', 'items': inner}

    # arrays
    if t.endswith('[]'):
        inner = java_type_to_simple(t[:-2])
        return {'type': 'array', 'items': inner}

    base = TYPE_MAP.get(t)
    if base:
        return {'type': base}
    # fallback: object (could be a reference to another entity)
    return {'type': 'object', 'javaType': t}


FIELD_RE = re.compile(r'^(?:\s*private|\s*protected|\s*public)\s+([A-Za-z0-9_<>,\s\[\]]+)\s+([A-Za-z0-9_]+)\s*;')
CLASS_RE = re.compile(r'public\s+class\s+([A-Za-z0-9_]+)|class\s+([A-Za-z0-9_]+)')


def parse_java_entity(path: Path):
    text = path.read_text(encoding='utf-8')
    # find class name
    m = CLASS_RE.search(text)
    if not m:
        return None
    class_name = m.group(1) or m.group(2)

    fields = []
    for line in text.splitlines():
        line = line.strip()
        if line.startswith('//') or line.startswith('@'):
            continue
        fm = FIELD_RE.match(line)
        if fm:
            jtype = ' '.join(fm.group(1).split())
            name = fm.group(2)
            fields.append({'name': name, 'javaType': jtype, 'type': java_type_to_simple(jtype)})

    return {'name': class_name, 'fields': fields, 'source': str(path)}


def main():
    files = list(Path('.').glob(JAVA_ENTITY_GLOB))
    if not files:
        print('Nenhum entity encontrado em', JAVA_ENTITY_GLOB)
        return

    models = {}
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    per_dir = OUT_DIR / 'models'
    per_dir.mkdir(parents=True, exist_ok=True)

    for f in sorted(files):
        parsed = parse_java_entity(f)
        if not parsed:
            continue
        name = parsed['name']
        models[name] = {'fields': parsed['fields'], 'source': parsed['source']}
        (per_dir / f'{name}.json').write_text(json.dumps(models[name], indent=2, ensure_ascii=False), encoding='utf-8')

    (OUT_DIR / 'models.json').write_text(json.dumps(models, indent=2, ensure_ascii=False), encoding='utf-8')
    print('Gerado:', OUT_DIR / 'models.json')


if __name__ == '__main__':
    main()
