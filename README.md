# PolicyGuard: Privacy-First AI Policy Framework

![Status](https://img.shields.io/badge/status-MVP-blue)
![Python](https://img.shields.io/badge/python-3.10+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

PolicyGuard is a privacy-first, agentic AI system that helps non-profits and enterprises create compliant AI policies without exposing sensitive data to the cloud.

**Key Features:**
- 🔐 **Privacy-First**: All organization data stays local
- 🤖 **Multi-Agent System**: 5 specialized CrewAI agents
- 📊 **Real-Time Intelligence**: Bright Data web scraping integration
- 🔧 **Configurable LLMs**: Switch between Groq, OpenAI, Anthropic, Azure
- 🚨 **Multi-Channel Alerts**: Email, Slack, Dashboard notifications
- 📋 **Audit Trail**: Complete action history for compliance

## Quick Start

### Prerequisites
- Python 3.10+
- Supabase account (free tier)
- Groq API key (free tier)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/policyguard.git
cd policyguard

# Create virtual environment
python3.10 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your Supabase and Groq credentials

# Run migrations
alembic upgrade head

# Start backend
python -m src.main
```

Backend runs on: `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

## Architecture

See `docs/ARCHITECTURE.md` for detailed system design.

## Tech Stack

- **Backend**: Python 3.10, FastAPI, SQLAlchemy
- **Database**: Supabase (Managed PostgreSQL)
- **LLMs**: Groq, OpenAI, Anthropic, Azure (configurable)
- **Agents**: CrewAI, LangChain
- **Web Intelligence**: Bright Data APIs
- **Frontend**: React 18, Supabase Auth
- **Notifications**: Slack, Email (SMTP)

## Configuration

### Switch LLM Providers

Edit `.env` to switch LLM providers (no code changes):

```bash
# Use Groq (free, fast)
LLM_PROVIDER=groq
GROQ_API_KEY=your_key

# Use OpenAI
LLM_PROVIDER=openai
OPENAI_API_KEY=your_key

# Use Anthropic/Claude
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_key
```

### Database Setup

1. Create Supabase project at https://supabase.com
2. Get connection string from Project Settings → Database → Connection Strings
3. Add to `.env`:

## API Documentation

Once running, visit: `http://localhost:8000/docs`

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src tests/

# Run specific test
pytest tests/unit/test_llm_providers.py
```

## Logging

Logs are configured in `utils/logging_config.yaml`.

- **Console Output**: Real-time logs during development
- **File Logs**: Stored in `logs/` directory
- **Error Logs**: Separate error file for debugging

## Development

```bash
# Install dev dependencies
pip install -r requirements.txt

# Format code
black src/ tests/

# Lint
flake8 src/ tests/

# Type check
mypy src/

# Pre-commit hooks
pre-commit install
pre-commit run --all-files
```

## Deployment

See `docs/DEPLOYMENT.md` for production deployment guides.

## Contributing

See `CONTRIBUTING.md` for contribution guidelines.

## Troubleshooting

See `docs/TROUBLESHOOTING.md` for common issues.

## License

MIT License - see LICENSE file

## Support

- 📖 [Documentation](docs/)
- 🐛 [Issues](https://github.com/yourusername/policyguard/issues)
- 💬 [Discussions](https://github.com/yourusername/policyguard/discussions)