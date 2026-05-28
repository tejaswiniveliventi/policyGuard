.PHONY: help install dev test lint format clean

help:
	@echo "PolicyGuard Development Commands"
	@echo "================================"
	@echo "make install    - Install dependencies"
	@echo "make dev        - Run development server"
	@echo "make test       - Run tests"
	@echo "make lint       - Run linting"
	@echo "make format     - Format code"
	@echo "make clean      - Clean up files"

install:
	pip install -r requirements.txt

dev:
	uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

test:
	pytest -v

test-cov:
	pytest --cov=src --cov-report=html tests/

lint:
	flake8 src/ tests/
	mypy src/

format:
	black src/ tests/
	isort src/ tests/

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache/
	rm -rf .coverage
	rm -rf htmlcov/
	rm -rf dist/
	rm -rf build/
	rm -rf *.egg-info/