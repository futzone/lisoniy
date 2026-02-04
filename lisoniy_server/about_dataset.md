# Dataset Types and Schema Guide

## System Architecture: Universal Polymorphic Storage

The Dataset Management API uses **polymorphic JSONB storage**, which means:
- ✅ **No strict schema enforcement** - Any valid JSON structure is accepted
- ✅ **Flexibility** - Create custom dataset types with any structure
- ✅ **Type field** - Used for organization and filtering, not validation
- ✅ **Metadata support** - Additional context via optional `entry_metadata` field

**Key Point:** The `type` field (e.g., "instruction", "parallel", "ner") is for **categorization only**. You can store any JSON structure regardless of the type.

---

## Recommended Schemas by Dataset Type

While the system accepts any structure, following these conventions ensures compatibility with common AI/ML tools and frameworks.

### 1. Instruction Dataset (`type: "instruction"`)

**Purpose:** Fine-tuning instruction-following models (LLMs)

**Recommended Schema:**
```json
{
  "instruction": "Task description or command",
  "input": "Optional context or input data",
  "output": "Expected response or completion"
}
```

**Example:**
```json
{
  "instruction": "Translate the following English text to Uzbek",
  "input": "Hello, how are you?",
  "output": "Salom, qalaysiz?"
}
```

**Alternative Schema (Chat format):**
```json
{
  "instruction": "System prompt or role description",
  "messages": [
    {"role": "user", "content": "User message"},
    {"role": "assistant", "content": "Assistant response"}
  ]
}
```

**Use Cases:**
- LLM fine-tuning (GPT, LLaMA, etc.)
- Instruction following datasets
- Task-oriented dialogue systems

---

### 2. Parallel Corpus (`type: "parallel"`)

**Purpose:** Machine translation, multilingual alignment

**Recommended Schema:**
```json
{
  "source_lang": "ISO 639-1 code (e.g., 'en', 'uz')",
  "target_lang": "ISO 639-1 code",
  "source_text": "Text in source language",
  "target_text": "Translation in target language"
}
```

**Example:**
```json
{
  "source_lang": "en",
  "target_lang": "uz",
  "source_text": "Artificial intelligence is transforming the world.",
  "target_text": "Sun'iy intellekt dunyoni o'zgartirmoqda."
}
```

**Extended Schema (with metadata):**
```json
{
  "source_lang": "en",
  "target_lang": "uz",
  "source_text": "Text...",
  "target_text": "Tarjima...",
  "domain": "technology",
  "quality_score": 0.95
}
```

**Use Cases:**
- Neural machine translation training
- Multilingual model alignment
- Translation memory systems

---

### 3. Named Entity Recognition (`type: "ner"`)

**Purpose:** Entity extraction and classification

**Recommended Schema:**
```json
{
  "text": "Full text with entities",
  "entities": [
    {
      "start": 0,
      "end": 4,
      "label": "PERSON",
      "entity": "John"
    }
  ]
}
```

**Example:**
```json
{
  "text": "John lives in New York and works at Google.",
  "entities": [
    {
      "start": 0,
      "end": 4,
      "label": "PERSON",
      "entity": "John"
    },
    {
      "start": 14,
      "end": 22,
      "label": "LOCATION",
      "entity": "New York"
    },
    {
      "start": 36,
      "end": 42,
      "label": "ORGANIZATION",
      "entity": "Google"
    }
  ]
}
```

**Alternative Schema (IOB/BIO format):**
```json
{
  "tokens": ["John", "lives", "in", "New", "York"],
  "tags": ["B-PER", "O", "O", "B-LOC", "I-LOC"]
}
```

**Use Cases:**
- NER model training
- Information extraction
- Text annotation pipelines

---

### 4. Legal Q&A (`type: "legal_qa"`)

**Purpose:** Legal question answering and reasoning

**Recommended Schema:**
```json
{
  "question": "Legal question",
  "context": "Relevant legal text or case",
  "answer": "Answer based on context",
  "jurisdiction": "Optional: e.g., 'UZ', 'US-CA'"
}
```

**Example:**
```json
{
  "question": "What is the maximum working hours per week in Uzbekistan?",
  "context": "Article 145 of the Labor Code of Uzbekistan states that normal working hours shall not exceed 40 hours per week.",
  "answer": "The maximum working hours per week in Uzbekistan is 40 hours, as stated in Article 145 of the Labor Code.",
  "jurisdiction": "UZ",
  "article_reference": "Labor Code Article 145"
}
```

**Use Cases:**
- Legal AI assistants
- Document Q&A systems
- Compliance automation

---

### 5. Classification (`type: "classification"`)

**Recommended Schema:**
```json
{
  "text": "Text to classify",
  "label": "Category or class",
  "confidence": 0.95
}
```

**Multi-label Example:**
```json
{
  "text": "Breaking news: Tech company announces...",
  "labels": ["technology", "business", "news"]
}
```

---

### 6. Sentiment Analysis (`type: "sentiment"`)

**Recommended Schema:**
```json
{
  "text": "Text to analyze",
  "sentiment": "positive|negative|neutral",
  "score": 0.85
}
```

---

### 7. Summarization (`type: "summarization"`)

**Recommended Schema:**
```json
{
  "document": "Long text to summarize",
  "summary": "Condensed version",
  "summary_type": "abstractive|extractive"
}
```

---

### 8. Question Answering (`type: "qa"`)

**Recommended Schema:**
```json
{
  "question": "What is...?",
  "context": "Paragraph containing the answer",
  "answer": "The answer",
  "answer_start": 42
}
```

---

## Custom Dataset Types

You can create **any custom type** for your specific use case:

```json
{
  "type": "custom_medical_diagnosis",
  "entries": [
    {
      "symptoms": ["fever", "cough", "fatigue"],
      "diagnosis": "Common cold",
      "treatment": "Rest and fluids",
      "severity": "mild"
    }
  ]
}
```

**Best Practices for Custom Types:**
1. Use descriptive type names (e.g., `medical_diagnosis`, `code_review`)
2. Document your schema in the dataset description
3. Keep structure consistent across entries
4. Use meaningful field names

---

## Using the Metadata Field

The optional `entry_metadata` field can store additional context:

```json
{
  "content": {
    "instruction": "...",
    "input": "...",
    "output": "..."
  },
  "entry_metadata": {
    "source": "human_annotated",
    "annotator_id": "user_123",
    "quality_score": 0.95,
    "tags": ["verified", "high_quality"],
    "created_date": "2026-01-27",
    "language": "en",
    "difficulty": "intermediate"
  }
}
```

**Use Cases for Metadata:**
- Data quality tracking
- Source attribution
- Filtering and search
- Versioning information
- Custom tags and categorization

---

## API Usage Examples

### Creating a Dataset

```bash
POST /api/v1/datasets/
Authorization: Bearer <token>

{
  "name": "Uzbek-English Translation Corpus",
  "type": "parallel",
  "description": "High-quality parallel sentences for Uz-En MT",
  "is_public": false
}
```

### Adding Entries (Bulk)

```bash
POST /api/v1/entries/bulk
Authorization: Bearer <token>

{
  "dataset_id": "uuid-here",
  "entries": [
    {
      "source_lang": "uz",
      "target_lang": "en",
      "source_text": "Salom",
      "target_text": "Hello"
    },
    {
      "source_lang": "uz",
      "target_lang": "en",
      "source_text": "Rahmat",
      "target_text": "Thank you"
    }
  ]
}
```

### Searching Entries

```bash
GET /api/v1/entries/?dataset_type=parallel&limit=100
```

---

## Schema Validation (Optional)

While the system doesn't enforce schemas, you can add validation in your application:

1. **Client-side validation** before sending to API
2. **Custom validation schemas** using JSON Schema or Pydantic
3. **Pre-processing scripts** to clean and validate data

---

## Performance Considerations

### JSONB Indexing

The system uses **GIN indexes** on the `content` JSONB field, enabling fast queries:

```sql
-- Fast queries on JSONB fields
SELECT * FROM data_entries 
WHERE content->>'source_lang' = 'uz';

SELECT * FROM data_entries 
WHERE content @> '{"label": "PERSON"}';
```

### Best Practices

1. **Consistent field names** - Use the same keys across entries
2. **Avoid deep nesting** - Keep JSON structures flat when possible
3. **Use metadata for filtering** - Store searchable data in `entry_metadata`
4. **Batch operations** - Use bulk endpoints for large imports (up to 1000 entries)

---

## Migration Guide

### From Other Formats

**Hugging Face Datasets:**
```python
# Convert HF dataset to API format
entries = []
for item in hf_dataset:
    entries.append({
        "instruction": item["instruction"],
        "input": item.get("input", ""),
        "output": item["output"]
    })

# Bulk insert
bulk_create_entries(dataset_id, entries)
```

**CSV to Parallel Corpus:**
```python
import csv

entries = []
with open('translations.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        entries.append({
            "source_lang": "uz",
            "target_lang": "en",
            "source_text": row["uzbek"],
            "target_text": row["english"]
        })
```

---

## Summary

| Dataset Type | Schema Type | Validation | Recommended Use |
|--------------|-------------|------------|-----------------|
| `instruction` | Flexible | None | LLM fine-tuning |
| `parallel` | Recommended | None | Machine translation |
| `ner` | Recommended | None | Entity extraction |
| `legal_qa` | Recommended | None | Legal AI |
| `classification` | Recommended | None | Text classification |
| **Custom** | **Any** | **None** | **Any purpose** |

**Key Takeaway:** The system is **100% flexible**. Use recommended schemas for compatibility, or create your own for custom needs!
